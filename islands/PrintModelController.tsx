import { useEffect } from "preact/hooks";
import {
  dominantFaceNormal,
  sliceContourSegments,
} from "@/lib/viewer-geometry.ts";
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
    let modelTriangles: Float32Array | null = null;
    let animation = 0;
    let resizeObserver: ResizeObserver | null = null;

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
        } mm Schichthoehe · ${nozzleDiameter.toFixed(2)} mm Duese`;
      }
      if (layerMetaEl) {
        layerMetaEl.textContent = `${layerHeight.toFixed(2)} mm Schichthoehe`;
      }
      if (nozzleMetaEl) {
        nozzleMetaEl.textContent = `${
          nozzleDiameter.toFixed(2)
        } mm Duesendurchmesser`;
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

    // Layer lines as planar cross-section contours: intersect the mesh with a
    // horizontal plane at each layer height so the lines follow the model's
    // actual surface (like a slicer's perimeter view).
    //
    // FOLLOW-UP (deferred, per request): this only renders the perimeter
    // contour. Possible later upgrades — (2) simulated zig-zag infill clipped
    // to each layer's cross-section polygon, or (3) true toolpaths by running
    // an actual slicer / parsing G-code. Both are substantially more work than
    // these contours and were intentionally left out for now.
    function drawLayerLines() {
      if (!runtime || !scene || !model || !modelTriangles) return;
      clearLayerLines();
      if (!layerToggle?.checked) return;

      const { THREE } = runtime;
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      if (!Number.isFinite(size.z) || size.z <= 0) return;

      const layerCount = Math.min(
        Math.max(Math.round(size.z / currentLayerHeight()), 1),
        140,
      );
      const step = size.z / layerCount;
      const segments = sliceContourSegments(
        modelTriangles,
        box.min.z,
        step,
        layerCount,
      );

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(segments, 3),
      );
      const lineMaterial = new THREE.LineBasicMaterial({
        color: "#17130e",
        transparent: true,
        opacity: 0.32,
      });
      const group = new THREE.Group();
      group.add(new THREE.LineSegments(geometry, lineMaterial));
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

    // Flatten an object's triangles into world-space [ax,ay,az,bx,...] floats.
    // Capped so very dense meshes stay responsive.
    function collectWorldTriangles(root: ThreeModule.Object3D): Float32Array {
      const { THREE } = runtime!;
      root.updateWorldMatrix(true, true);
      const out: number[] = [];
      const v = new THREE.Vector3();
      const MAX_TRIS = 120000;
      let count = 0;
      root.traverse((child: ThreeModule.Object3D) => {
        const mesh = child as MeshLike & {
          geometry?: ThreeModule.BufferGeometry;
          matrixWorld?: ThreeModule.Matrix4;
        };
        if (!mesh.isMesh || !mesh.geometry || !mesh.matrixWorld) return;
        const position = mesh.geometry.getAttribute("position");
        if (!position) return;
        const index = mesh.geometry.getIndex();
        const vertexCount = index ? index.count : position.count;
        for (let i = 0; i + 2 < vertexCount && count < MAX_TRIS; i += 3) {
          for (let k = 0; k < 3; k += 1) {
            const vi = index ? index.getX(i + k) : i + k;
            v.fromBufferAttribute(position, vi).applyMatrix4(mesh.matrixWorld);
            out.push(v.x, v.y, v.z);
          }
          count += 1;
        }
      });
      return new Float32Array(out);
    }

    // Best print orientation (heuristic): lay the largest coplanar face on the
    // plate. Returns the rotation that points that face's normal straight down.
    function bestDownQuaternion(
      tris: Float32Array,
    ): ThreeModule.Quaternion | null {
      const { THREE } = runtime!;
      const normal = dominantFaceNormal(tris);
      if (!normal) return null;
      return new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(normal.x, normal.y, normal.z).normalize(),
        new THREE.Vector3(0, 0, -1),
      );
    }

    function placeModel(object: ThreeModule.Object3D) {
      if (!runtime || !scene) return;
      const { THREE } = runtime;
      if (model) {
        scene.remove(model);
        disposeObject(model);
      }

      // Wrap in a pivot so we can orient/position freely regardless of any
      // transform the loader baked into the object.
      const pivot = new THREE.Group();
      pivot.add(object);

      // 1) Auto-orient into the best print orientation (largest face down).
      const down = bestDownQuaternion(collectWorldTriangles(pivot));
      if (down) pivot.quaternion.premultiply(down);
      pivot.updateWorldMatrix(true, true);

      // 2) Seat on the build plate (min.z = 0) and center on the grid (x,y = 0).
      const box = new THREE.Box3().setFromObject(pivot);
      const center = new THREE.Vector3();
      box.getCenter(center);
      pivot.position.set(-center.x, -center.y, -box.min.z);
      pivot.updateWorldMatrix(true, true);

      model = pivot;
      scene.add(model);
      modelTriangles = collectWorldTriangles(model);

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
        // Lazily boot the 3D runtime on first use; surfaces load errors here.
        await ensureViewer();
        if (disposed || !runtime) return;
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
          "Modell geladen. Material, Finish und Druckparameter koennen angepasst werden.",
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
      // Populate the form's file input (for submission) without dispatching a
      // change event — loadFile is called explicitly below, so dispatching
      // would load the same file twice.
      if (fileInput) {
        const transfer = new DataTransfer();
        transfer.items.add(file);
        fileInput.files = transfer.files;
      }
      void loadFile(file);
    }

    // The 3D runtime (three.js + WebGL) is heavy and loaded lazily. This is
    // idempotent: the scene is built once, on first call. Interaction wiring
    // does NOT depend on this completing — see the synchronous setup below.
    let viewerPromise: Promise<void> | null = null;
    function ensureViewer(): Promise<void> {
      if (!viewerPromise) viewerPromise = buildViewer();
      return viewerPromise;
    }

    async function buildViewer() {
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
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(viewerMount);

      const animate = () => {
        if (!renderer || !scene || !camera || !controls) return;
        controls.update();
        renderer.render(scene, camera);
        animation = requestAnimationFrame(animate);
      };
      animate();

      // A model may have been dropped/selected before the runtime finished
      // booting; render it now and apply current settings.
      updateMaterial();
      drawLayerLines();
    }

    // --- Interaction wiring (synchronous, independent of the 3D runtime) ---
    // These must attach the moment the island hydrates so drag & drop and
    // clicking work immediately, even while three.js is still loading.
    const syncAndRedraw = () => {
      syncForm();
      updateMaterial();
      drawLayerLines();
    };
    const onFileInput = () => {
      const file = fileInput?.files?.[0];
      if (file) void loadFile(file);
    };
    const onDragOver = (event: Event) => event.preventDefault();
    const onDrop = (event: DragEvent) => {
      event.preventDefault();
      const file = event.dataTransfer?.files?.[0];
      if (file) assignFile(file);
    };
    const onClick = () => fileInput?.click();

    materialInput?.addEventListener("change", syncAndRedraw);
    colorInput?.addEventListener("input", syncAndRedraw);
    layerInput?.addEventListener("input", syncAndRedraw);
    nozzleInput?.addEventListener("input", syncAndRedraw);
    layerToggle?.addEventListener("change", syncAndRedraw);
    fileInput?.addEventListener("change", onFileInput);
    viewerDropzone.addEventListener("dragover", onDragOver);
    viewerDropzone.addEventListener("drop", onDrop);
    viewerDropzone.addEventListener("click", onClick);

    syncForm();
    setStatus("idle", "STL, STEP/STP oder 3MF zur Pruefung ablegen.");

    // Boot the 3D scene in the background so the empty viewer renders, but do
    // not block interaction on it. Failures surface as a status message.
    void ensureViewer().catch((error) => {
      setStatus(
        "error",
        error instanceof Error
          ? `Viewer konnte nicht gestartet werden: ${error.message}`
          : "Viewer konnte nicht gestartet werden.",
      );
    });

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      materialInput?.removeEventListener("change", syncAndRedraw);
      colorInput?.removeEventListener("input", syncAndRedraw);
      layerInput?.removeEventListener("input", syncAndRedraw);
      nozzleInput?.removeEventListener("input", syncAndRedraw);
      layerToggle?.removeEventListener("change", syncAndRedraw);
      fileInput?.removeEventListener("change", onFileInput);
      viewerDropzone.removeEventListener("dragover", onDragOver);
      viewerDropzone.removeEventListener("drop", onDrop);
      viewerDropzone.removeEventListener("click", onClick);
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
