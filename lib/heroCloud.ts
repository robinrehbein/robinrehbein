// Point-cloud effect for the hero portrait: the points assemble into the photo on load,
// and the photo breaks apart into a 3D cloud on hover. Plain WebGL, no library.
// Data comes from /me_cloud.png: red = brightness, green = depth (Depth Anything V2).

export type IntroName = "mist" | "cloud" | "rain" | "vortex" | "bang" | "depth" | "wipe" | "sparks" | "iris" | "halves" | "spiral" | "corners";
export type HoverName = "mix" | "tilt" | "burst" | "wave" | "repel";

export const INTRO_LABELS: Record<IntroName, string> = {
  mist: "Zerstäubt",
  cloud: "Wolke",
  rain: "Regen",
  vortex: "Wirbel",
  bang: "Aus der Mitte",
  depth: "Aus der Tiefe",
  wipe: "Wischen",
  sparks: "Funken",
  iris: "Blende",
  halves: "Zwei Hälften",
  spiral: "Spirale",
  corners: "Magnet",
};

export const INTRO_NAMES = Object.keys(INTRO_LABELS) as IntroName[];

export const HOVER_LABELS: Record<HoverName, string> = {
  mix: "Mix",
  tilt: "3D kippen",
  burst: "Zerfliegen",
  wave: "Welle",
  repel: "Ausweichen",
};

const GRID = 400;
const FOV = 32;
const DIST = 1 / Math.tan((FOV / 2) * Math.PI / 180);

// nx/ny: position within the bounds of the visible face (0..1), so sweeps don't idle over empty background.
type Point = { x: number; y: number; lum: number; dep: number; sx: number; sy: number; sz: number; nx: number; ny: number };
type Intro = { ms: number; reveal: number; swirl: number; start: (p: Point) => [number, number, number, number] };

const rnd = Math.random;
const INTROS: Record<IntroName, Intro> = {
  mist: { ms: 2000, reveal: 1400, swirl: 0, start: () => [(rnd() - 0.5) * 2.2, (rnd() - 0.5) * 2.2, (rnd() - 0.5) * 1.4, rnd()] },
  cloud: { ms: 2000, reveal: 0, swirl: 0, start: (p) => [p.sx * 1.8, p.sy * 1.8, p.sz * 2.6, p.sz] },
  rain: { ms: 2200, reveal: 0, swirl: 0, start: (p) => [p.x + (rnd() - 0.5) * 0.06, 1.05 + rnd() * 0.5, (rnd() - 0.5) * 0.3, p.ny * 0.8 + rnd() * 0.12] },
  vortex: {
    ms: 2400, reveal: 0, swirl: 1,
    start: (p) => {
      const a = Math.atan2(p.y, p.x) + 2.5, r = 1.6 + rnd() * 0.6;
      return [Math.cos(a) * r, Math.sin(a) * r, (rnd() - 0.5) * 0.6, rnd() * 0.5];
    },
  },
  bang: { ms: 1800, reveal: 0, swirl: 0, start: (p) => [(rnd() - 0.5) * 0.02, (rnd() - 0.5) * 0.02, 0.6, Math.min(1, Math.hypot(p.x, p.y) / 1.2) * 0.8 + rnd() * 0.1] },
  depth: { ms: 2200, reveal: 0, swirl: 0, start: (p) => [p.x * 0.4, p.y * 0.4, -6 - rnd() * 4, (1 - p.lum) * 0.8 + rnd() * 0.15] },
  wipe: { ms: 2000, reveal: 0, swirl: 0, start: (p) => [-1.15 - rnd() * 0.2, p.y + (rnd() - 0.5) * 0.05, (rnd() - 0.5) * 0.2, p.nx * 0.85 + rnd() * 0.06] },
  sparks: { ms: 2200, reveal: 0, swirl: 0, start: (p) => [p.x + (rnd() - 0.5) * 0.5, -1.05 - rnd() * 0.3, (rnd() - 0.5) * 0.4, p.ny * 0.75 + rnd() * 0.15] },
  iris: {
    ms: 2000, reveal: 0, swirl: 0,
    start: (p) => {
      const a = Math.atan2(p.y, p.x), d = Math.hypot(p.x, p.y);
      return [Math.cos(a) * 1.2, Math.sin(a) * 1.2, (rnd() - 0.5) * 0.2, (1 - Math.min(1, d)) * 0.8 + rnd() * 0.06];
    },
  },
  halves: { ms: 1900, reveal: 0, swirl: 0, start: (p) => [p.x, p.y + (p.y >= 0.15 ? 0.9 : -0.9), (rnd() - 0.5) * 0.15, rnd() * 0.5] },
  spiral: { ms: 2200, reveal: 0, swirl: 1, start: (p) => [p.x * 0.05, p.y * 0.05, 0.2, Math.min(1, Math.hypot(p.x, p.y) / 1.3) * 0.85 + rnd() * 0.05] },
  corners: { ms: 2000, reveal: 0, swirl: 0, start: (p) => [(p.x < 0 ? -1.25 : 1.25) + (rnd() - 0.5) * 0.15, (p.y < 0 ? -1.25 : 1.25) + (rnd() - 0.5) * 0.15, (rnd() - 0.5) * 0.3, rnd() * 0.6] },
};

// Target strength of each hover channel per style.
const HOVERS: Record<HoverName, { depth: number; burst: number; wave: number; repel: number; tilt: number }> = {
  mix: { depth: 0.5, burst: 0.09, wave: 0, repel: 0, tilt: 1 },
  tilt: { depth: 0.55, burst: 0.02, wave: 0, repel: 0, tilt: 1 },
  burst: { depth: 0.4, burst: 0.2, wave: 0, repel: 0, tilt: 0.6 },
  wave: { depth: 0.3, burst: 0.02, wave: 1, repel: 0, tilt: 0.4 },
  repel: { depth: 0.3, burst: 0.02, wave: 0, repel: 1, tilt: 0.4 },
};

const VERT = `
attribute vec2 aPos; attribute float aLum; attribute float aDep; attribute vec3 aScatter; attribute vec3 aStart; attribute float aDelay;
uniform float uAssemble, uReveal, uSwirl, uDepth, uBurst, uWave, uRepel, uSize, uTime, uDist;
uniform vec2 uRot; uniform vec2 uMouse;
varying float vLum; varying float vLoose; varying float vReveal; varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  vec3 p = vec3(aPos, (aDep - 0.5) * uDepth);
  p += aScatter * vec3(1.0, 1.0, 1.6) * uBurst * (0.1 + aScatter.z * 0.3);
  p.xy += vec2(sin(uTime * 1.7 + aScatter.x * 20.0), cos(uTime * 1.3 + aScatter.y * 20.0)) * 0.01 * uBurst;
  vec2 dm = aPos - uMouse; float d = length(dm);
  p.z += sin(d * 18.0 - uTime * 5.0) * 0.06 * uWave * exp(-d * 2.2);
  float push = uRepel * 0.06 * exp(-d * d * 90.0);
  p.xy += (d > 0.0001 ? dm / d : vec2(0.0)) * push; p.z += push * 0.6;
  float t = smoothstep(0.0, 1.0, clamp((uAssemble - aDelay * 0.5) / 0.5, 0.0, 1.0));
  vec3 s0 = aStart + vec3(sin(uTime * 0.6 + aScatter.x * 30.0), cos(uTime * 0.5 + aScatter.y * 30.0), 0.0) * 0.04 * (1.0 - t);
  p = mix(s0, p, t);
  float ang = uSwirl * (1.0 - t) * (1.0 - t) * 5.0;
  p.xy = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * p.xy;
  float cy = cos(uRot.y), sy = sin(uRot.y), cx = cos(uRot.x), sx = sin(uRot.x);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  float rr = fract(aScatter.x * 43.7 + aScatter.y * 12.3);
  vReveal = smoothstep(rr * 0.7, rr * 0.7 + 0.3, uReveal);
  vLum = aLum;
  vLoose = max(1.0 - t, max(max(uBurst * 4.0, uDepth * 0.35), max(uWave, uRepel) * 0.6));
  float w = uDist - p.z;
  float sz = mix(uSize, uSize * (0.9 + aLum * 1.1), clamp(vLoose * 1.5, 0.0, 1.0));
  gl_PointSize = sz * uDist / w;
  gl_Position = vec4(p.x * uDist, p.y * uDist, 0.0, w);
}`;

const FRAG = `
precision mediump float;
varying float vLum; varying float vLoose; varying float vReveal; varying vec2 vUv;
uniform sampler2D uTex; uniform vec2 uGaze;
// Eye openings in photo UV space (measured on me_square.webp, 1100px).
float eyeMask(vec2 uv, vec2 c) {
  vec2 q = (uv - c) / vec2(0.027, 0.0085);
  return 1.0 - smoothstep(0.55, 1.0, length(q));
}
void main() {
  float m = max(eyeMask(vUv, vec2(0.450, 0.3365)), eyeMask(vUv, vec2(0.5582, 0.3355)));
  float lum = vLum;
  if (m > 0.0) lum = mix(vLum, texture2D(uTex, vUv - uGaze).r, m);
  vec2 d = gl_PointCoord - 0.5;
  float sq = step(max(abs(d.x), abs(d.y)), 0.5);
  float rd = smoothstep(0.5, 0.2, length(d));
  float k = clamp(vLoose * 2.0, 0.0, 1.0);
  float a = mix(sq, rd, k);
  vec3 c = mix(vec3(lum), vec3(0.95, 0.93, 0.886) * (0.08 + pow(lum, 1.2) * 1.05), clamp(vLoose * 1.5, 0.0, 1.0));
  gl_FragColor = vec4(c, a * vReveal);
}`;

function loadPoints(src: string): Promise<{ pts: Point[]; img: HTMLImageElement }> {
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
      for (let y = 0; y < GRID; y++) for (let x = 0; x < GRID; x++) {
        const i = (y * GRID + x) * 4, lum = px[i] / 255;
        if (lum < 0.06) continue;
        const a = rnd() * Math.PI * 2, r = 0.4 + rnd() * 0.6;
        pts.push({
          x: ((x + 0.5) / GRID - 0.5) * 2, y: (0.5 - (y + 0.5) / GRID) * 2,
          lum, dep: px[i + 1] / 255, sx: Math.cos(a) * r, sy: Math.sin(a) * r, sz: rnd(), nx: 0, ny: 0,
        });
      }
      let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
      for (const p of pts) if (p.lum >= 0.15) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
      for (const p of pts) { p.nx = Math.max(0, Math.min(1, (p.x - x0) / (x1 - x0))); p.ny = Math.max(0, Math.min(1, (p.y - y0) / (y1 - y0))); }
      resolve({ pts, img });
    };
    img.onerror = () => reject(new Error("cloud data failed to load"));
    img.src = src;
  });
}

export type HeroCloud = { setIntro: (n: IntroName) => void; setHover: (n: HoverName) => void; setEyes: (on: boolean) => void; replay: () => void; destroy: () => void };

export async function createHeroCloud(stage: HTMLElement, canvas: HTMLCanvasElement, photo: HTMLElement, opts: { intro: IntroName; hover: HoverName; eyes: boolean }): Promise<HeroCloud> {
  const ctx = canvas.getContext("webgl", { antialias: true, alpha: false, premultipliedAlpha: false });
  if (!ctx) throw new Error("WebGL unavailable");
  const gl: WebGLRenderingContext = ctx;
  const { pts, img } = await loadPoints("/me_cloud.png");

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
  const buffer = (name: string, size: number, data: Float32Array, usage: number = gl.STATIC_DRAW) => {
    const b = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    const loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    return b;
  };
  buffer("aPos", 2, new Float32Array(pts.flatMap((p) => [p.x, p.y])));
  buffer("aLum", 1, new Float32Array(pts.map((p) => p.lum)));
  buffer("aDep", 1, new Float32Array(pts.map((p) => p.dep)));
  buffer("aScatter", 3, new Float32Array(pts.flatMap((p) => [p.sx, p.sy, p.sz])));
  const startData = new Float32Array(n * 3), delayData = new Float32Array(n);
  const startBuf = buffer("aStart", 3, startData, gl.DYNAMIC_DRAW);
  const delayBuf = buffer("aDelay", 1, delayData, gl.DYNAMIC_DRAW);

  const u = (name: string) => gl.getUniformLocation(prog, name);
  const U = {
    assemble: u("uAssemble"), reveal: u("uReveal"), swirl: u("uSwirl"), depth: u("uDepth"), burst: u("uBurst"),
    wave: u("uWave"), repel: u("uRepel"), size: u("uSize"), time: u("uTime"), dist: u("uDist"), rot: u("uRot"), mouse: u("uMouse"),
  };
  gl.uniform1f(U.dist, DIST);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(u("uTex"), 0);
  const uGaze = u("uGaze");
  let eyes = opts.eyes;
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 1);

  let intro = INTROS[opts.intro];
  let hover = HOVERS[opts.hover];
  function setIntro(name: IntroName) {
    intro = INTROS[name];
    for (let i = 0; i < n; i++) {
      const v = intro.start(pts[i]);
      startData[i * 3] = v[0]; startData[i * 3 + 1] = v[1]; startData[i * 3 + 2] = v[2];
      delayData[i] = Math.max(0, Math.min(1, v[3]));
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, startBuf); gl.bufferData(gl.ARRAY_BUFFER, startData, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, delayBuf); gl.bufferData(gl.ARRAY_BUFFER, delayData, gl.DYNAMIC_DRAW);
    gl.uniform1f(U.swirl, intro.swirl);
  }
  setIntro(opts.intro);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(stage.clientWidth * dpr), h = Math.round(stage.clientHeight * dpr);
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform1f(U.size, (w / GRID) * 1.25);
  }
  const ro = new ResizeObserver(() => { resize(); wake(); });
  ro.observe(stage); resize();

  const cur = { depth: 0, burst: 0, wave: 0, repel: 0, rx: 0, ry: 0, photo: 0, gx: 0, gy: 0 };
  const aim = { x: 0, y: 0 }, mouse = { x: 0, y: 0 };
  let hovering = false, start = performance.now(), raf = 0, running = false;
  const t0 = performance.now();

  function move(e: PointerEvent) {
    const b = stage.getBoundingClientRect();
    const nx = (e.clientX - b.left) / b.width - 0.5, ny = (e.clientY - b.top) / b.height - 0.5;
    aim.y = nx * 0.35; aim.x = ny * 0.18;
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
    const reveal = intro.reveal ? Math.min(1, el / intro.reveal) : 1;
    const assemble = Math.max(0, Math.min(1, (el - intro.reveal) / intro.ms));
    const k = 0.08, h = hover;
    cur.depth += ((hovering ? h.depth : 0) - cur.depth) * k;
    cur.burst += ((hovering ? h.burst : 0) - cur.burst) * k;
    cur.wave += ((hovering ? h.wave : 0) - cur.wave) * k;
    cur.repel += ((hovering ? h.repel : 0) - cur.repel) * k;
    cur.rx += ((hovering ? aim.x * h.tilt : 0) - cur.rx) * k;
    cur.ry += ((hovering ? aim.y * h.tilt : 0) - cur.ry) * k;
    // Gaze: the pupils shift toward the pointer, at most a few photo pixels inside the eye opening.
    const fx = mouse.x - 0.005, fy = mouse.y - 0.33, fl = Math.max(1, Math.hypot(fx * 1.6, fy * 2.2));
    cur.gx += ((hovering && eyes ? (fx * 1.6 / fl) * 0.0065 : 0) - cur.gx) * 0.15;
    cur.gy += ((hovering && eyes ? (-fy * 2.2 / fl) * 0.0025 : 0) - cur.gy) * 0.15;
    const loose = cur.depth + cur.burst + cur.wave + cur.repel + Math.abs(cur.rx) + Math.abs(cur.ry);
    const settled = !hovering && assemble >= 1 && loose < 0.01;
    cur.photo += ((settled ? 1 : 0) - cur.photo) * (settled ? 0.07 : 0.25);
    photo.style.opacity = cur.photo.toFixed(3);

    gl.uniform1f(U.reveal, reveal);
    gl.uniform1f(U.assemble, assemble);
    gl.uniform1f(U.depth, cur.depth);
    gl.uniform1f(U.burst, cur.burst);
    gl.uniform1f(U.wave, cur.wave);
    gl.uniform1f(U.repel, cur.repel);
    gl.uniform1f(U.time, (now - t0) / 1000);
    gl.uniform2f(U.rot, cur.rx, cur.ry);
    gl.uniform2f(U.mouse, mouse.x, mouse.y);
    gl.uniform2f(uGaze, cur.gx, cur.gy);
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
    setIntro: (name) => { setIntro(name); },
    setHover: (name) => { hover = HOVERS[name]; },
    setEyes: (on) => { eyes = on; },
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
