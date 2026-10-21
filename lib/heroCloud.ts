// Point-cloud effect for the hero portrait. On load the frame starts empty; fine dust of the
// whole picture, black background included, fades in across the frame and drifts, then gathers
// into the photo like ink (blots, a single drop or watercolour, taking turns per visit), so the
// black only appears where the points land. On hover the photo dissolves back into a
// softly scattered cloud that leans toward the pointer, with slow waves running out from it.
// Plain WebGL, no library.
// Data comes from /me_cloud.png: red = brightness, green = depth: Depth Anything V2, softened
// and blended with a smooth head-and-shoulders relief so the face, not the shirt, comes forward.

const GRID = 400;
const FOV = 32;
const DIST = 1 / Math.tan((FOV / 2) * Math.PI / 180);
const REVEAL_MS = 1400;
// After the dust has appeared, it gathers like ink. Three variants take turns from visit to visit.
type Ink = "blots" | "drop" | "watercolor";
const INKS: Ink[] = ["blots", "drop", "watercolor"];
const ASSEMBLE_MS: Record<Ink, number> = { blots: 2800, drop: 2800, watercolor: 3200 };

function nextInk(): Ink {
  try {
    const i = (Number(localStorage.getItem("hero-ink")) + 1) % INKS.length || 0;
    localStorage.setItem("hero-ink", String(i));
    return INKS[i];
  } catch {
    return INKS[Math.floor(Math.random() * INKS.length)];
  }
}
// Hover "Zerfliegen": the points scatter and the picture tilts with the pointer.
const HOVER = { depth: 0.45, burst: 0.2, wave: 0, tilt: 1, stir: 1 };

// scale: background points are sampled every second cell and drawn twice as large.
type Point = { x: number; y: number; lum: number; dep: number; sx: number; sy: number; sz: number; scale: number };

const VERT = `
attribute vec2 aPos; attribute float aLum; attribute float aDep; attribute vec3 aScatter;
attribute vec3 aStart; attribute float aDelay; attribute float aScale;
uniform float uReveal, uAssemble, uDepth, uBurst, uWave, uStir, uCell, uTime, uDist;
uniform vec2 uRot; uniform vec2 uMouse;
varying float vLum; varying float vRound; varying float vAlpha;
// CSS-style cubic-bezier(x1, y1, x2, y2): solve the curve's x for t with Newton steps, return y.
float bezier(float x, vec4 c) {
  float t = x;
  for (int i = 0; i < 5; i++) {
    float u = 1.0 - t;
    float bx = 3.0 * u * u * t * c.x + 3.0 * u * t * t * c.z + t * t * t;
    float dx = 3.0 * u * u * c.x + 6.0 * u * t * (c.z - c.x) + 3.0 * t * t * (1.0 - c.z);
    t = clamp(t - (bx - x) / max(dx, 1e-4), 0.0, 1.0);
  }
  float u = 1.0 - t;
  return 3.0 * u * u * t * c.y + 3.0 * u * t * t * c.w + t * t * t;
}
const vec4 GATHER = vec4(0.45, 0.0, 0.15, 1.0);  // soft start, long gentle landing
void main() {
  vec3 p = vec3(aPos, (aDep - 0.35) * uDepth);
  p += aScatter * vec3(1.0, 1.0, 1.6) * uBurst * (0.1 + aScatter.z * 0.3);
  p.xy += vec2(sin(uTime * 1.7 + aScatter.x * 20.0), cos(uTime * 1.3 + aScatter.y * 20.0)) * 0.01 * uBurst;
  // Slow, broad waves running outward from the pointer.
  float d = length(aPos - uMouse);
  p.z += sin(d * 9.0 - uTime * 1.2) * 0.07 * uWave * exp(-d * 1.4);
  // Points near the pointer (or the tap) drift gently; the further away, the calmer.
  float stir = 0.03 * uStir * exp(-d * 2.6);
  p += vec3(sin(uTime * 1.6 + aScatter.x * 40.0), cos(uTime * 1.4 + aScatter.y * 40.0), sin(uTime * 1.2 + aScatter.z * 40.0)) * stir;
  // Intro: each point drifts from its spot in the dust to its place in the photo.
  float t = bezier(clamp((uAssemble - aDelay * 0.55) / 0.45, 0.0, 1.0), GATHER);
  vec3 s0 = aStart + vec3(sin(uTime * 0.6 + aScatter.x * 30.0), cos(uTime * 0.5 + aScatter.y * 30.0), 0.0) * 0.04 * (1.0 - t);
  p = mix(s0, p, t);
  float cy = cos(uRot.y), sy = sin(uRot.y), cx = cos(uRot.x), sx = sin(uRot.x);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  // The dust appears point by point at random moments during the reveal phase.
  float rr = fract(aScatter.x * 43.7 + aScatter.y * 12.3);
  vAlpha = smoothstep(rr * 0.7, rr * 0.7 + 0.3, uReveal);
  float loose = max(1.0 - t, max(uBurst, uDepth));
  vLum = aLum; vRound = clamp(loose * 2.0, 0.0, 1.0);
  float w = uDist - p.z;
  gl_PointSize = uCell * 1.25 * aScale * mix(1.0, 0.9 + aLum * 1.1, clamp(loose * 1.5, 0.0, 1.0)) * uDist / w;
  gl_Position = vec4(p.x * uDist, p.y * uDist, 0.0, w);
}`;

const FRAG = `
precision mediump float;
varying float vLum; varying float vRound; varying float vAlpha;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float sq = step(max(abs(d.x), abs(d.y)), 0.5);
  float rd = smoothstep(0.5, 0.2, length(d));
  gl_FragColor = vec4(vec3(vLum), mix(sq, rd, vRound) * vAlpha);
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
        // The near-black background is part of the picture too, but at half resolution: one double-size
        // point per 2×2 block. Where the block's top-left pixel belongs to the face, its background
        // pixels get normal points instead, so no paper shows through along the face outline.
        const bg = lum < 0.06;
        const anchor = gx % 2 === 0 && gy % 2 === 0;
        const anchorBg = px[(((gy >> 1) << 1) * GRID + ((gx >> 1) << 1)) * 4] / 255 < 0.06;
        if (bg && !anchor && anchorBg) continue;
        const scale = bg && anchor ? 2 : 1;
        const a = Math.random() * Math.PI * 2, r = 0.4 + Math.random() * 0.6;
        pts.push({
          x: ((gx + scale / 2) / GRID - 0.5) * 2, y: (0.5 - (gy + scale / 2) / GRID) * 2,
          lum, dep: px[i + 1] / 255, sx: Math.cos(a) * r, sy: Math.sin(a) * r, sz: Math.random(), scale,
        });
      }
      resolve(pts);
    };
    img.onerror = () => reject(new Error("cloud data failed to load"));
    img.src = src;
  });
}

// When each point leaves the dust (0 = first, 1 = last), per ink variant.
function inkDelays(pts: Point[], ink: Ink): Float32Array {
  const rnd = Math.random, cl = (v: number) => Math.max(0, Math.min(1, v));
  let fx = 0, fy = 0, fn = 0;
  for (const p of pts) if (p.lum >= 0.15) { fx += p.x; fy += p.y; fn++; }
  fx /= fn || 1; fy /= fn || 1;
  const blots = Array.from({ length: ink === "watercolor" ? 4 : 6 }, () => [fx + (rnd() - 0.5) * 1.4, fy + (rnd() - 0.5) * 1.4]);
  const seed = rnd() * 6;
  // Smooth wobble from a few sines, for the ragged watercolour edges.
  const wob = (x: number, y: number) => Math.sin(x * 7.1 + seed * 3) * 0.5 + Math.sin(y * 6.3 - seed * 5) * 0.35 + Math.sin((x + y) * 13.7 + seed) * 0.15;
  return new Float32Array(pts.map((p) => {
    if (ink === "drop") {
      // One drop on the face; the ink spreads from there in a soft circle.
      const r = Math.hypot(p.x - fx, (p.y - fy) * 0.85);
      return cl(r / 1.45 * 0.8 + (1 - p.lum) * 0.12 + rnd() * 0.06);
    }
    const k = ink === "watercolor" ? 5 : 6;
    let w = 0;
    for (const [x, y] of blots) w += Math.exp(-k * Math.hypot(p.x - x, p.y - y));
    const d = -Math.log(w) / k;
    // Blots: dark first, light last. Watercolour: fewer blots with ragged, wandering edges.
    return ink === "watercolor"
      ? cl((d + wob(p.x, p.y) * 0.08) * 0.65 + p.lum * 0.3 + rnd() * 0.04)
      : cl(d * 0.6 + p.lum * 0.4 + rnd() * 0.05);
  }));
}

export type HeroCloud = { replay: () => void; destroy: () => void };

export async function createHeroCloud(stage: HTMLElement, canvas: HTMLCanvasElement, photo: HTMLElement, signal?: AbortSignal): Promise<HeroCloud> {
  const ctx = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: false });
  if (!ctx) throw new Error("WebGL unavailable");
  const gl: WebGLRenderingContext = ctx;
  const pts = await loadPoints("/me_cloud.png");
  signal?.throwIfAborted();

  const shaders: WebGLShader[] = [];
  const buffers: WebGLBuffer[] = [];
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!; shaders.push(s);
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
    const b = gl.createBuffer()!; buffers.push(b);
    gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  };
  buffer("aPos", 2, new Float32Array(pts.flatMap((p) => [p.x, p.y])));
  buffer("aLum", 1, new Float32Array(pts.map((p) => p.lum)));
  buffer("aDep", 1, new Float32Array(pts.map((p) => p.dep)));
  buffer("aScatter", 3, new Float32Array(pts.flatMap((p) => [p.sx, p.sy, p.sz])));
  const rnd = Math.random;
  buffer("aStart", 3, new Float32Array(pts.flatMap(() => [(rnd() - 0.5) * 2.2, (rnd() - 0.5) * 2.2, (rnd() - 0.5) * 1.4])));
  const ink = nextInk();
  buffer("aDelay", 1, inkDelays(pts, ink));
  buffer("aScale", 1, new Float32Array(pts.map((p) => p.scale)));

  const u = (name: string) => gl.getUniformLocation(prog, name);
  const U = {
    reveal: u("uReveal"), assemble: u("uAssemble"), depth: u("uDepth"), burst: u("uBurst"), wave: u("uWave"), stir: u("uStir"),
    cell: u("uCell"), time: u("uTime"), dist: u("uDist"), rot: u("uRot"), mouse: u("uMouse"),
  };
  gl.uniform1f(U.dist, DIST);
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(stage.clientWidth * dpr), h = Math.round(stage.clientHeight * dpr);
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform1f(U.cell, w / GRID);
  }
  const ro = new ResizeObserver(() => { resize(); wake(); });
  ro.observe(stage); resize();

  // Hover values move on critically damped springs: they accelerate, then settle without overshoot.
  type Spring = { x: number; v: number };
  const spring = (): Spring => ({ x: 0, v: 0 });
  const STIFF = 26, DAMP = 2 * Math.sqrt(STIFF);
  const step = (s: Spring, target: number, dt: number) => {
    s.v += ((target - s.x) * STIFF - s.v * DAMP) * dt;
    s.x += s.v * dt;
  };
  const cur = { depth: spring(), burst: spring(), wave: spring(), stir: spring(), rx: spring(), ry: spring(), photo: 0 };
  let last = performance.now();
  const aim = { x: 0, y: 0 }, mouse = { x: 0, y: 0 };
  let hovering = false, start = performance.now(), raf = 0, running = false;
  let visible = true, destroyed = false;
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
    const assemble = Math.max(0, Math.min(1, (el - REVEAL_MS) / ASSEMBLE_MS[ink]));
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
    step(cur.depth, hovering ? HOVER.depth : 0, dt);
    step(cur.burst, hovering ? HOVER.burst : 0, dt);
    step(cur.wave, hovering ? HOVER.wave : 0, dt);
    step(cur.stir, hovering ? HOVER.stir : 0, dt);
    step(cur.rx, hovering ? aim.x : 0, dt);
    step(cur.ry, hovering ? aim.y : 0, dt);
    const motion = Math.abs(cur.depth.x) + Math.abs(cur.burst.x) + Math.abs(cur.wave.x) * 0.1 + Math.abs(cur.stir.x) * 0.1 + Math.abs(cur.rx.x) + Math.abs(cur.ry.x);
    const settled = !hovering && assemble >= 1 && motion < 0.01;
    // Photo cross-fade: frame-rate independent exponential ease (≈250 ms in, ≈60 ms out).
    cur.photo += ((settled ? 1 : 0) - cur.photo) * (1 - Math.exp(-dt / (settled ? 0.25 : 0.06)));
    photo.style.opacity = cur.photo.toFixed(3);

    gl.uniform1f(U.reveal, Math.min(1, el / REVEAL_MS));
    gl.uniform1f(U.assemble, assemble);
    gl.uniform1f(U.depth, Math.max(0, cur.depth.x));
    gl.uniform1f(U.burst, Math.max(0, cur.burst.x));
    gl.uniform1f(U.wave, Math.max(0, cur.wave.x));
    gl.uniform1f(U.stir, Math.max(0, cur.stir.x));
    gl.uniform1f(U.time, (now - t0) / 1000);
    gl.uniform2f(U.rot, cur.rx.x, cur.ry.x);
    gl.uniform2f(U.mouse, mouse.x, mouse.y);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);

    // Stop the loop once the photo is fully back; pointer events or a replay wake it again.
    if (settled && cur.photo > 0.995) { photo.style.opacity = "1"; running = false; return; }
    raf = requestAnimationFrame(frame);
  }
  function wake() { if (!running && !destroyed && visible && !document.hidden) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } }

  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) { hovering = false; cancelAnimationFrame(raf); running = false; }
    else wake();
  });
  visibility.observe(stage);
  const onVisibility = () => {
    if (document.hidden) { hovering = false; cancelAnimationFrame(raf); running = false; }
    else wake();
  };
  document.addEventListener("visibilitychange", onVisibility);
  photo.style.opacity = "0";
  wake();

  return {
    replay: () => { hovering = false; start = performance.now(); cur.photo = 0; photo.style.opacity = "0"; wake(); },
    destroy: () => {
      destroyed = true; cancelAnimationFrame(raf); running = false; ro.disconnect();
      visibility.disconnect(); document.removeEventListener("visibilitychange", onVisibility);
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("pointerdown", onDown);
      buffers.forEach(b => gl.deleteBuffer(b));
      shaders.forEach(s => gl.deleteShader(s));
      gl.deleteProgram(prog);
      photo.style.opacity = "";
    },
  };
}
