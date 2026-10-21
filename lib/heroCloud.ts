// Point-cloud effect for the hero portrait. On load, fine dust fades in and slowly drifts
// together into the photo; on hover the photo dissolves back into a softly scattered cloud
// that leans toward the pointer, with slow waves running out from it. Plain WebGL, no library.
// Data comes from /me_cloud.png: red = brightness, green = depth (Depth Anything V2).

const GRID = 400;
const FOV = 32;
const DIST = 1 / Math.tan((FOV / 2) * Math.PI / 180);
const REVEAL_MS = 1800, ASSEMBLE_MS = 2600;
const HOVER = { depth: 0.3, burst: 0.17, wave: 1, tilt: 0.5 };

type Point = { x: number; y: number; lum: number; dep: number; sx: number; sy: number; sz: number };

const VERT = `
attribute vec2 aPos; attribute float aLum; attribute float aDep; attribute vec3 aScatter;
attribute vec3 aStart; attribute float aDelay;
uniform float uReveal, uAssemble, uDepth, uBurst, uWave, uCell, uTime, uDist;
uniform vec2 uRot; uniform vec2 uMouse;
varying float vLum; varying float vRound; varying float vAlpha;
void main() {
  vec3 p = vec3(aPos, (aDep - 0.5) * uDepth);
  p += aScatter * vec3(1.0, 1.0, 1.6) * uBurst * (0.1 + aScatter.z * 0.3);
  p.xy += vec2(sin(uTime * 0.5 + aScatter.x * 20.0), cos(uTime * 0.4 + aScatter.y * 20.0)) * 0.012 * uBurst;
  // Slow, broad waves running outward from the pointer.
  float d = length(aPos - uMouse);
  p.z += sin(d * 9.0 - uTime * 1.2) * 0.07 * uWave * exp(-d * 1.4);
  // Intro: each point drifts from its spot in the dust to its place in the photo.
  float t = smoothstep(0.0, 1.0, clamp((uAssemble - aDelay * 0.5) / 0.5, 0.0, 1.0));
  vec3 s0 = aStart + vec3(sin(uTime * 0.4 + aScatter.x * 30.0), cos(uTime * 0.35 + aScatter.y * 30.0), 0.0) * 0.03 * (1.0 - t);
  p = mix(s0, p, t);
  float cy = cos(uRot.y), sy = sin(uRot.y), cx = cos(uRot.x), sx = sin(uRot.x);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  float rr = fract(aScatter.x * 43.7 + aScatter.y * 12.3);
  vAlpha = smoothstep(rr * 0.7, rr * 0.7 + 0.3, uReveal);
  float loose = max(1.0 - t, clamp(uDepth + uBurst * 3.0, 0.0, 1.0));
  vLum = aLum; vRound = loose;
  float w = uDist - p.z;
  gl_PointSize = uCell * 1.25 * mix(1.0, 0.8 + aLum * 0.7, loose) * uDist / w;
  gl_Position = vec4(p.x * uDist, p.y * uDist, 0.0, w);
}`;

const FRAG = `
precision mediump float;
varying float vLum; varying float vRound; varying float vAlpha;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float sq = step(max(abs(d.x), abs(d.y)), 0.5);
  float rd = 1.0 - smoothstep(0.3, 0.5, length(d));
  vec3 c = mix(vec3(vLum), vec3(0.95, 0.93, 0.886) * (0.08 + pow(vLum, 1.2) * 1.05), vRound * 0.8);
  gl_FragColor = vec4(c, mix(sq, rd, vRound) * vAlpha);
}`;

function loadPoints(src: string): Promise<Point[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = GRID; c.height = GRID;
      const ctx = c.getContext("2d");
      if (!ctx) return reject(new Error("no 2d context"));
      ctx.drawImage(img, 0, 0, GRID, GRID);
      const px = ctx.getImageData(0, 0, GRID, GRID).data;
      const pts: Point[] = [];
      for (let gy = 0; gy < GRID; gy++) for (let gx = 0; gx < GRID; gx++) {
        const i = (gy * GRID + gx) * 4, lum = px[i] / 255;
        if (lum < 0.06) continue;
        const a = Math.random() * Math.PI * 2, r = 0.4 + Math.random() * 0.6;
        pts.push({
          x: ((gx + 0.5) / GRID - 0.5) * 2, y: (0.5 - (gy + 0.5) / GRID) * 2,
          lum, dep: px[i + 1] / 255, sx: Math.cos(a) * r, sy: Math.sin(a) * r, sz: Math.random(),
        });
      }
      resolve(pts);
    };
    img.onerror = () => reject(new Error("cloud data failed to load"));
    img.src = src;
  });
}

export type HeroCloud = { replay: () => void; destroy: () => void };

export async function createHeroCloud(stage: HTMLElement, canvas: HTMLCanvasElement, photo: HTMLElement): Promise<HeroCloud> {
  const ctx = canvas.getContext("webgl", { antialias: true, alpha: false, premultipliedAlpha: false });
  if (!ctx) throw new Error("WebGL unavailable");
  const gl: WebGLRenderingContext = ctx;
  const pts = await loadPoints("/me_cloud.png");

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader error");
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link error");
  gl.useProgram(prog);

  const n = pts.length;
  const buffer = (name: string, size: number, data: Float32Array) => {
    const b = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  };
  const rnd = Math.random;
  buffer("aPos", 2, new Float32Array(pts.flatMap((p) => [p.x, p.y])));
  buffer("aLum", 1, new Float32Array(pts.map((p) => p.lum)));
  buffer("aDep", 1, new Float32Array(pts.map((p) => p.dep)));
  buffer("aScatter", 3, new Float32Array(pts.flatMap((p) => [p.sx, p.sy, p.sz])));
  buffer("aStart", 3, new Float32Array(pts.flatMap(() => [(rnd() - 0.5) * 2.2, (rnd() - 0.5) * 2.2, (rnd() - 0.5) * 1.4])));
  buffer("aDelay", 1, new Float32Array(pts.map(() => rnd())));

  const u = (name: string) => gl.getUniformLocation(prog, name);
  const U = {
    reveal: u("uReveal"), assemble: u("uAssemble"), depth: u("uDepth"), burst: u("uBurst"), wave: u("uWave"),
    cell: u("uCell"), time: u("uTime"), dist: u("uDist"), rot: u("uRot"), mouse: u("uMouse"),
  };
  gl.uniform1f(U.dist, DIST);
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 1);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(stage.clientWidth * dpr), h = Math.round(stage.clientHeight * dpr);
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform1f(U.cell, w / GRID);
  }
  const ro = new ResizeObserver(() => { resize(); wake(); });
  ro.observe(stage); resize();

  const cur = { depth: 0, burst: 0, wave: 0, rx: 0, ry: 0, photo: 0 };
  const aim = { x: 0, y: 0 }, mouse = { x: 0, y: 0 };
  let hovering = false, start = performance.now(), raf = 0, running = false;
  const t0 = performance.now();

  function move(e: PointerEvent) {
    const b = stage.getBoundingClientRect();
    const nx = (e.clientX - b.left) / b.width - 0.5, ny = (e.clientY - b.top) / b.height - 0.5;
    aim.y = nx * 0.35 * HOVER.tilt; aim.x = ny * 0.18 * HOVER.tilt;
    mouse.x = nx * 2; mouse.y = -ny * 2;
  }
  const onEnter = (e: PointerEvent) => { if (e.pointerType === "mouse") { hovering = true; move(e); wake(); } };
  const onMove = (e: PointerEvent) => { if (hovering) move(e); };
  const onLeave = (e: PointerEvent) => { if (e.pointerType === "mouse") { hovering = false; wake(); } };
  const onDown = (e: PointerEvent) => { if (e.pointerType !== "mouse") { hovering = !hovering; move(e); wake(); } };
  stage.addEventListener("pointerenter", onEnter);
  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerleave", onLeave);
  stage.addEventListener("pointerdown", onDown);

  function frame(now: number) {
    const el = now - start;
    const assemble = Math.max(0, Math.min(1, (el - REVEAL_MS) / ASSEMBLE_MS));
    const k = 0.05;
    cur.depth += ((hovering ? HOVER.depth : 0) - cur.depth) * k;
    cur.burst += ((hovering ? HOVER.burst : 0) - cur.burst) * k;
    cur.wave += ((hovering ? HOVER.wave : 0) - cur.wave) * k;
    cur.rx += ((hovering ? aim.x : 0) - cur.rx) * k;
    cur.ry += ((hovering ? aim.y : 0) - cur.ry) * k;
    const settled = !hovering && assemble >= 1 && cur.depth + cur.burst + cur.wave * 0.1 + Math.abs(cur.rx) + Math.abs(cur.ry) < 0.01;
    cur.photo += ((settled ? 1 : 0) - cur.photo) * (settled ? 0.06 : 0.25);
    photo.style.opacity = cur.photo.toFixed(3);

    gl.uniform1f(U.reveal, Math.min(1, el / REVEAL_MS));
    gl.uniform1f(U.assemble, assemble);
    gl.uniform1f(U.depth, cur.depth);
    gl.uniform1f(U.burst, cur.burst);
    gl.uniform1f(U.wave, cur.wave);
    gl.uniform1f(U.time, (now - t0) / 1000);
    gl.uniform2f(U.rot, cur.rx, cur.ry);
    gl.uniform2f(U.mouse, mouse.x, mouse.y);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);

    // Stop the loop once the photo is fully back; pointer events or a replay wake it again.
    if (settled && cur.photo > 0.995) { photo.style.opacity = "1"; running = false; return; }
    raf = requestAnimationFrame(frame);
  }
  function wake() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }

  photo.style.opacity = "0";
  wake();

  return {
    replay: () => { hovering = false; start = performance.now(); cur.photo = 0; photo.style.opacity = "0"; wake(); },
    destroy: () => {
      cancelAnimationFrame(raf); running = false; ro.disconnect();
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("pointerdown", onDown);
      photo.style.opacity = "";
    },
  };
}
