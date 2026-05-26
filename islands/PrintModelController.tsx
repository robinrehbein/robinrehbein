import { useEffect } from "preact/hooks";
import type * as ThreeModule from "three";
import type { OrbitControls as OrbitControlsType } from "three/examples/jsm/controls/OrbitControls.js";
import type { STLLoader as STLLoaderType } from "three/examples/jsm/loaders/STLLoader.js";

type Runtime = {
  THREE: typeof ThreeModule;
  OrbitControls: typeof OrbitControlsType;
  STLLoader: typeof STLLoaderType;
};

type OcctImport = {
  ReadStepFile: (
    content: Uint8Array,
    params: Record<string, unknown> | null,
  ) => {
    success: boolean;
    error?: string;
    meshes?: OcctMesh[];
  };
};

type OcctMesh = {
  attributes: {
    position: { array: number[] };
    normal?: { array: number[] };
  };
  index?: { array: number[] };
};

type GlobalWithOcct = typeof globalThis & {
  occtimportjs?: (options?: {
    locateFile?: (path: string) => string;
  }) => Promise<OcctImport>;
};

type MeshLike = ThreeModule.Object3D & {
  isMesh?: boolean;
  geometry?: { dispose?: () => void };
  material?: { dispose?: () => void } | Array<{ dispose?: () => void }>;
};

const browserGlobal = globalThis as GlobalWithOcct;

const materialFinishes: Record<
  string,
  { roughness: number; metalness: number; opacity?: number }
> = {
  "PLA Matte": { roughness: 0.9, metalness: 0.02 },
  PETG: { roughness: 0.55, metalness: 0.02 },
  "PETG Transparent": { roughness: 0.2, metalness: 0.01, opacity: 0.58 },
  "ABS/ASA": { roughness: 0.72, metalness: 0.02 },
  Woodfill: { roughness: 0.95, metalness: 0 },
  "TPU Flex": { roughness: 0.82, metalness: 0 },
};

async function loadRuntime(): Promise<Runtime> {
  const [three, controls, stl] = await Promise.all([
    import("three"),
    import("three/examples/jsm/controls/OrbitControls.js"),
    import("three/examples/jsm/loaders/STLLoader.js"),
  ]);

  return {
    THREE: three,
    OrbitControls: controls.OrbitControls,
    STLLoader: stl.STLLoader,
  };
}

function loadOcctScript() {
  if (browserGlobal.occtimportjs) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="/vendor/occt-import-js.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("OCCT konnte nicht geladen werden.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "/vendor/occt-import-js.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("OCCT konnte nicht geladen werden."));
    document.head.append(script);
  });
}

export default function PrintModelController() {
  useEffect(() => {
    let disposed = false;
    let runtime: Runtime | null = null;
    let scene: ThreeModule.Scene | null = null;
    let camera: ThreeModule.PerspectiveCamera | null = null;
    let renderer: ThreeModule.WebGLRenderer | null = null;
    let controls: OrbitControlsType | null = null;
    let model: ThreeModule.Object3D | null = null;
    let layerLines: ThreeModule.Group | null = null;
    let animation = 0;

    const root = document.querySelector<HTMLElement>("[data-print-viewer]");
    const mount = root?.querySelector<HTMLElement>("[data-viewer-mount]");
    const dropzone = root?.querySelector<HTMLElement>("[data-viewer-dropzone]");
    const statusEl = root?.querySelector<HTMLElement>("[data-viewer-status]");
    const fileEl = root?.querySelector<HTMLElement>("[data-viewer-file]");
    const messageEl = root?.querySelector<HTMLElement>("[data-viewer-message]");
    const dimensionsEl = root?.querySelector<HTMLElement>(
      "[data-viewer-dimensions]",
    );
    const layerMetaEl = root?.querySelector<HTMLElement>(
      "[data-viewer-layer-meta]",
    );
    const nozzleMetaEl = root?.querySelector<HTMLElement>(
      "[data-viewer-nozzle-meta]",
    );
    const materialInput = root?.querySelector<HTMLSelectElement>(
      "[data-viewer-material]",
    );
    const colorInput = root?.querySelector<HTMLInputElement>(
      "[data-viewer-color]",
    );
    const layerInput = root?.querySelector<HTMLInputElement>(
      "[data-viewer-layer]",
    );
    const nozzleInput = root?.querySelector<HTMLInputElement>(
      "[data-viewer-nozzle]",
    );
    const layerToggle = root?.querySelector<HTMLInputElement>(
      "[data-viewer-layers]",
    );
    const fileInput = document.querySelector<HTMLInputElement>(
      'input[name="model"]',
    );
    const formMaterial = document.querySelector<HTMLSelectElement>(
      'select[name="material"]',
    );
    const formFinish = document.querySelector<HTMLInputElement>(
      'input[name="finish"]',
    );

    if (!root || !mount || !dropzone) {
      return;
    }

    const viewerMount = mount;
    const viewerDropzone = dropzone;

    function setStatus(
      status: "idle" | "loading" | "ready" | "error",
      message: string,
    ) {
      if (!statusEl || !messageEl) return;
      statusEl.className = `viewer-status ${status}`;
      statusEl.textContent = {
        idle: "Bereit",
        loading: "Laedt",
        ready: "Gerendert",
        error: "Fehler",
      }[status];
      messageEl.textContent = message;
    }

    function currentLayerHeight() {
      return Number(layerInput?.value || "0.2");
    }

    function currentNozzleDiameter() {
      return Number(nozzleInput?.value || "0.4");
    }

    function currentColor() {
      return colorInput?.value || "#c85f39";
    }

    function currentMaterial() {
      return materialInput?.value || "PLA Matte";
    }

    function syncForm() {
      const layerHeight = currentLayerHeight();
      const nozzleDiameter = currentNozzleDiameter();
      if (formMaterial) formMaterial.value = currentMaterial();
      if (formFinish) {
        formFinish.value = `${currentColor()} · ${
          layerHeight.toFixed(2)
        } mm Layer · ${nozzleDiameter.toFixed(2)} mm Nozzle`;
      }
      if (layerMetaEl) {
        layerMetaEl.textContent = `${layerHeight.toFixed(2)} mm Layer`;
      }
      if (nozzleMetaEl) {
        nozzleMetaEl.textContent = `${nozzleDiameter.toFixed(2)} mm Nozzle`;
      }
    }

    function disposeObject(object: ThreeModule.Object3D) {
      object.traverse((child: ThreeModule.Object3D) => {
        const mesh = child as MeshLike;
        mesh.geometry?.dispose?.();
        const material = mesh.material;
        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose?.());
        } else {
          material?.dispose?.();
        }
      });
    }

    function updateMaterial() {
      if (!runtime || !model) return;
      const finish = materialFinishes[currentMaterial()] ??
        materialFinishes["PLA Matte"];
      model.traverse((child: ThreeModule.Object3D) => {
        const mesh = child as MeshLike;
        if (!mesh.isMesh) return;
        mesh.material = new runtime!.THREE.MeshStandardMaterial({
          color: currentColor(),
          roughness: finish.roughness,
          metalness: finish.metalness,
          transparent: Boolean(finish.opacity),
          opacity: finish.opacity ?? 1,
        });
      });
    }

    function clearLayerLines() {
      if (!scene || !layerLines) return;
      scene.remove(layerLines);
      disposeObject(layerLines);
      layerLines = null;
    }

    function drawLayerLines() {
      if (!runtime || !scene || !model) return;
      clearLayerLines();
      if (!layerToggle?.checked) return;

      const { THREE } = runtime;
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      if (!Number.isFinite(size.z) || size.z <= 0) return;

      const group = new THREE.Group();
      const lineMaterial = new THREE.LineBasicMaterial({
        color: "#17130e",
        transparent: true,
        opacity: 0.22,
      });
      const layerCount = Math.min(
        Math.max(Math.round(size.z / currentLayerHeight()), 1),
        220,
      );
      const step = size.z / layerCount;
      const x = size.x / 2 + currentNozzleDiameter() * 0.4;
      const y = size.y / 2 + currentNozzleDiameter() * 0.4;

      for (let i = 0; i <= layerCount; i += 1) {
        const z = box.min.z + i * step;
        const points = [
          new THREE.Vector3(center.x - x, center.y - y, z),
          new THREE.Vector3(center.x + x, center.y - y, z),
          new THREE.Vector3(center.x + x, center.y + y, z),
          new THREE.Vector3(center.x - x, center.y + y, z),
          new THREE.Vector3(center.x - x, center.y - y, z),
        ];
        group.add(
          new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points),
            lineMaterial,
          ),
        );
      }

      layerLines = group;
      scene.add(group);
    }

    function fitCamera() {
      if (!runtime || !camera || !controls || !model) return;
      const { THREE } = runtime;
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      const maxDim = Math.max(size.x, size.y, size.z, 1);
      const distance = maxDim / (2 * Math.tan((camera.fov * Math.PI) / 360));
      camera.position.set(
        center.x + distance * 0.9,
        center.y - distance * 1.25,
        center.z + distance * 0.85,
      );
      camera.near = Math.max(distance / 100, 0.01);
      camera.far = distance * 100;
      camera.updateProjectionMatrix();
      controls.target.copy(center);
      controls.update();
      if (dimensionsEl) {
        dimensionsEl.textContent = `${size.x.toFixed(1)} × ${
          size.y.toFixed(1)
        } × ${size.z.toFixed(1)} mm`;
      }
    }

    function placeModel(object: ThreeModule.Object3D) {
      if (!scene) return;
      if (model) {
        scene.remove(model);
        disposeObject(model);
      }
      model = object;
      scene.add(model);
      updateMaterial();
      fitCamera();
      drawLayerLines();
    }

    function geometryFromOcctMesh(mesh: OcctMesh) {
      if (!runtime) throw new Error("Viewer ist noch nicht bereit.");
      const { THREE } = runtime;
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(mesh.attributes.position.array, 3),
      );
      if (mesh.attributes.normal?.array?.length) {
        geometry.setAttribute(
          "normal",
          new THREE.Float32BufferAttribute(mesh.attributes.normal.array, 3),
        );
      } else {
        geometry.computeVertexNormals();
      }
      if (mesh.index?.array?.length) geometry.setIndex(mesh.index.array);
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      return geometry;
    }

    async function parseStep(buffer: ArrayBuffer) {
      if (!runtime) throw new Error("Viewer ist noch nicht bereit.");
      await loadOcctScript();
      const createImporter = browserGlobal.occtimportjs;
      if (!createImporter) {
        throw new Error("STEP-Importer ist nicht verfuegbar.");
      }
      const occt = await createImporter({
        locateFile: (path) => `/vendor/${path}`,
      });
      const result = occt.ReadStepFile(new Uint8Array(buffer), {
        linearUnit: "millimeter",
        linearDeflectionType: "bounding_box_ratio",
        linearDeflection: 0.001,
        angularDeflection: 0.5,
      });
      if (!result.success || !result.meshes?.length) {
        throw new Error(
          result.error ?? "STEP-Datei konnte nicht trianguliert werden.",
        );
      }
      const group = new runtime.THREE.Group();
      result.meshes.forEach((mesh) => {
        group.add(new runtime!.THREE.Mesh(geometryFromOcctMesh(mesh)));
      });
      return group;
    }

    async function loadFile(file: File) {
      if (!runtime) {
        setStatus("error", "Viewer ist noch nicht bereit.");
        return;
      }

      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!["stl", "step", "stp", "3mf"].includes(extension)) {
        setStatus(
          "error",
          "Bitte eine STL-, STEP-, STP- oder 3MF-Datei verwenden.",
        );
        return;
      }

      setStatus("loading", `${file.name} wird geladen ...`);
      if (fileEl) fileEl.textContent = file.name;

      try {
        const buffer = await file.arrayBuffer();
        let object: ThreeModule.Object3D;
        if (extension === "stl") {
          const geometry = new runtime.STLLoader().parse(buffer);
          geometry.computeVertexNormals();
          object = new runtime.THREE.Mesh(geometry);
        } else if (extension === "3mf") {
          const { ThreeMFLoader } = await import(
            "three/examples/jsm/loaders/3MFLoader.js"
          );
          object = new ThreeMFLoader().parse(buffer);
        } else {
          object = await parseStep(buffer);
        }

        placeModel(object);
        setStatus(
          "ready",
          "Modell geladen. Material, Farbe und Layer koennen angepasst werden.",
        );
      } catch (error) {
        setStatus(
          "error",
          error instanceof Error
            ? error.message
            : "Modell konnte nicht geladen werden.",
        );
      }
    }

    function assignFile(file: File) {
      if (fileInput) {
        const transfer = new DataTransfer();
        transfer.items.add(file);
        fileInput.files = transfer.files;
        fileInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
      void loadFile(file);
    }

    async function init() {
      setStatus("loading", "Viewer wird geladen ...");
      runtime = await loadRuntime();
      if (disposed) return;

      const { THREE } = runtime;
      scene = new THREE.Scene();
      scene.background = new THREE.Color("#f4f0e6");

      camera = new THREE.PerspectiveCamera(38, 1, 0.01, 10000);
      camera.position.set(90, -120, 80);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio ?? 1, 2));
      renderer.shadowMap.enabled = true;
      viewerMount.append(renderer.domElement);

      controls = new runtime.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      scene.add(new THREE.HemisphereLight("#fff7e6", "#5a6259", 2.1));
      const keyLight = new THREE.DirectionalLight("#ffffff", 2.2);
      keyLight.position.set(120, -160, 180);
      keyLight.castShadow = true;
      scene.add(keyLight);

      const grid = new THREE.GridHelper(180, 18, "#17130e", "#bcb5a7");
      grid.rotation.x = Math.PI / 2;
      grid.position.z = -0.01;
      scene.add(grid);

      const resize = () => {
        if (!renderer || !camera) return;
        const rect = viewerMount.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height);
        camera.aspect = rect.width / Math.max(rect.height, 1);
        camera.updateProjectionMatrix();
      };
      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(viewerMount);

      const animate = () => {
        if (!renderer || !scene || !camera || !controls) return;
        controls.update();
        renderer.render(scene, camera);
        animation = requestAnimationFrame(animate);
      };
      animate();

      const syncAndRedraw = () => {
        syncForm();
        updateMaterial();
        drawLayerLines();
      };
      materialInput?.addEventListener("change", syncAndRedraw);
      colorInput?.addEventListener("input", syncAndRedraw);
      layerInput?.addEventListener("input", syncAndRedraw);
      nozzleInput?.addEventListener("input", syncAndRedraw);
      layerToggle?.addEventListener("change", syncAndRedraw);
      fileInput?.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        if (file) void loadFile(file);
      });
      viewerDropzone.addEventListener(
        "dragover",
        (event) => event.preventDefault(),
      );
      viewerDropzone.addEventListener("drop", (event) => {
        event.preventDefault();
        const file = event.dataTransfer?.files?.[0];
        if (file) assignFile(file);
      });
      viewerDropzone.addEventListener("click", () => fileInput?.click());

      syncForm();
      setStatus("idle", "STL, STEP/STP oder 3MF hier ablegen.");

      return () => {
        resizeObserver.disconnect();
        materialInput?.removeEventListener("change", syncAndRedraw);
        colorInput?.removeEventListener("input", syncAndRedraw);
        layerInput?.removeEventListener("input", syncAndRedraw);
        nozzleInput?.removeEventListener("input", syncAndRedraw);
        layerToggle?.removeEventListener("change", syncAndRedraw);
      };
    }

    let cleanup: (() => void) | undefined;
    void init()
      .then((result) => {
        cleanup = result;
      })
      .catch((error) => {
        setStatus(
          "error",
          error instanceof Error
            ? `Viewer konnte nicht gestartet werden: ${error.message}`
            : "Viewer konnte nicht gestartet werden.",
        );
      });

    return () => {
      disposed = true;
      cleanup?.();
      if (animation) cancelAnimationFrame(animation);
      controls?.dispose();
      renderer?.dispose();
      renderer?.domElement?.remove();
      if (scene) disposeObject(scene);
    };
  }, []);

  return (
    <span
      aria-hidden="true"
      class="viewer-controller-marker"
      data-print-viewer-controller
    />
  );
}
