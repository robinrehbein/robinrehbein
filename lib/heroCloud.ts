// Point-cloud effect for the hero portrait. On load the photo builds up from a few large dots
// that split into ever smaller ones; on hover it turns into a 3D point cloud that tilts with
// the pointer. Plain WebGL, no library.
// Data comes from /me_cloud.png: red = brightness, green = depth (Depth Anything V2).

const GRID = 400;
const FOV = 32;
const DIST = 1 / Math.tan((FOV / 2) * Math.PI / 180);

// Dot sizes of the intro, in grid cells: each step splits every dot into smaller ones.
const LEVELS = [25, 12.5, 6.25, 3.125, 1];
const FADE_IN = 600, HOLD = 260, SPLIT = 520;

type Point = { gx: number; gy: number; x: number; y: number; lum: number; dep: number; sx: number; sy: number; sz: number };

const VERT = `
attribute vec2 aPos; attribute float aLum; attribute float aDep; attribute vec3 aScatter;
attribute vec4 aCell; attribute vec4 aNext;
uniform float uRefine, uMorph, uFade, uDepth, uBurst, uCell, uTime, uDist;
uniform vec2 uRot;
varying float vLum; varying float vRound; varying float vAlpha;
void main() {
  vec3 p; float size; float lum;
  if (uRefine > 0.5) {
    // Intro: every point sits on the dot of its cell and moves to its sub-cell's dot while splitting.
    vec4 c = mix(aCell, aNext, uMorph);
    p = vec3(c.xy, 0.0); size = uCell * c.z * 0.92; lum = c.w; vRound = 1.0;
  } else {
    p = vec3(aPos, (aDep - 0.5) * uDepth);
    p += aScatter * vec3(1.0, 1.0, 1.6) * uBurst * (0.1 + aScatter.z * 0.3);
    p.xy += vec2(sin(uTime * 0.9 + aScatter.x * 20.0), cos(uTime * 0.7 + aScatter.y * 20.0)) * 0.006 * uBurst;
    float loose = clamp(uDepth * 0.7 + uBurst * 4.0, 0.0, 1.0);
    size = uCell * 1.25 * mix(1.0, 0.8 + aLum * 0.7, loose); lum = aLum; vRound = loose;
  }
  float cy = cos(uRot.y), sy = sin(uRot.y), cx = cos(uRot.x), sx = sin(uRot.x);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  vLum = lum; vAlpha = uFade;
  float w = uDist - p.z;
  gl_PointSize = size * uDist / w;
  gl_Position = vec4(p.x * uDist, p.y * uDist, 0.0, w);
}`;

const FRAG = `
precision mediump float;
varying float vLum; varying float vRound; varying float vAlpha;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float sq = step(max(abs(d.x), abs(d.y)), 0.5);
  float rd = 1.0 - smoothstep(0.42, 0.5, length(d));
  vec3 c = mix(vec3(vLum), vec3(0.95, 0.93, 0.886) * (0.08 + pow(vLum, 1.2) * 1.05), vRound * 0.6);
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
          gx, gy, x: ((gx + 0.5) / GRID - 0.5) * 2, y: (0.5 - (gy + 0.5) / GRID) * 2,
          lum, dep: px[i + 1] / 255, sx: Math.cos(a) * r, sy: Math.sin(a) * r, sz: Math.random(),
        });
      }
      resolve(pts);
    };
    img.onerror = () => reject(new Error("cloud data failed to load"));
    img.src = src;
  });
}

// Per level: each point's dot centre (plane coords), dot size (grid cells) and the dot's mean brightness.
function levelData(pts: Point[], s: number): Float32Array {
  const out = new Float32Array(pts.length * 4);
  const key = (p: Point) => Math.floor(p.gx / s) * 100000 + Math.floor(p.gy / s);
  const sums = new Map<number, number>();
  for (const p of pts) sums.set(key(p), (sums.get(key(p)) ?? 0) + p.lum);
  pts.forEach((p, i) => {
    const cx = (Math.floor(p.gx / s) + 0.5) * s, cy = (Math.floor(p.gy / s) + 0.5) * s;
    out[i * 4] = s <= 1 ? p.x : (cx / GRID - 0.5) * 2;
    out[i * 4 + 1] = s <= 1 ? p.y : (0.5 - cy / GRID) * 2;
    out[i * 4 + 2] = s;
    out[i * 4 + 3] = s <= 1 ? p.lum : Math.min(1, (sums.get(key(p)) ?? 0) / (s * s) * 1.15);
  });
  return out;
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
    return b;
  };
  buffer("aPos", 2, new Float32Array(pts.flatMap((p) => [p.x, p.y])));
  buffer("aLum", 1, new Float32Array(pts.map((p) => p.lum)));
  buffer("aDep", 1, new Float32Array(pts.map((p) => p.dep)));
  buffer("aScatter", 3, new Float32Array(pts.flatMap((p) => [p.sx, p.sy, p.sz])));
  const levels = LEVELS.map((s) => levelData(pts, s));
  const cellBuf = buffer("aCell", 4, levels[0]);
  const nextBuf = buffer("aNext", 4, levels[1]);
  let shownStep = 0;
  function showStep(i: number) {
    if (i === shownStep) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, cellBuf); gl.bufferData(gl.ARRAY_BUFFER, levels[i], gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, nextBuf); gl.bufferData(gl.ARRAY_BUFFER, levels[Math.min(i + 1, levels.length - 1)], gl.STATIC_DRAW);
    shownStep = i;
  }

  const u = (name: string) => gl.getUniformLocation(prog, name);
  const U = {
    refine: u("uRefine"), morph: u("uMorph"), fade: u("uFade"), depth: u("uDepth"), burst: u("uBurst"),
    cell: u("uCell"), time: u("uTime"), dist: u("uDist"), rot: u("uRot"),
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

  const HOVER = { depth: 0.5, burst: 0.05 };
  const cur = { depth: 0, burst: 0, rx: 0, ry: 0, photo: 0 };
  const aim = { x: 0, y: 0 };
  let hovering = false, start = performance.now(), raf = 0, running = false;
  const t0 = performance.now();
  const introMs = FADE_IN + (LEVELS.length - 1) * (HOLD + SPLIT) + HOLD;
  const ease = (t: number) => t * t * (3 - 2 * t);

  function move(e: PointerEvent) {
    const b = stage.getBoundingClientRect();
    aim.y = ((e.clientX - b.left) / b.width - 0.5) * 0.35;
    aim.x = ((e.clientY - b.top) / b.height - 0.5) * 0.18;
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
    const intro = el < introMs;
    if (intro) {
      // Fade in the coarsest dots, then split level by level: hold, split, hold, split, …
      const t = Math.max(0, el - FADE_IN - HOLD), step = Math.floor(t / (HOLD + SPLIT));
      const inStep = t - step * (HOLD + SPLIT);
      showStep(Math.min(step, LEVELS.length - 2));
      gl.uniform1f(U.refine, 1);
      gl.uniform1f(U.fade, ease(Math.min(1, el / FADE_IN)));
      gl.uniform1f(U.morph, el < FADE_IN + HOLD ? 0 : ease(Math.min(1, inStep / SPLIT)));
    } else {
      gl.uniform1f(U.refine, 0);
      gl.uniform1f(U.fade, 1);
    }
    const k = 0.07;
    cur.depth += ((hovering ? HOVER.depth : 0) - cur.depth) * k;
    cur.burst += ((hovering ? HOVER.burst : 0) - cur.burst) * k;
    cur.rx += ((hovering ? aim.x : 0) - cur.rx) * k;
    cur.ry += ((hovering ? aim.y : 0) - cur.ry) * k;
    const settled = !hovering && !intro && cur.depth + cur.burst + Math.abs(cur.rx) + Math.abs(cur.ry) < 0.01;
    cur.photo += ((settled ? 1 : 0) - cur.photo) * (settled ? 0.06 : 0.25);
    photo.style.opacity = cur.photo.toFixed(3);

    gl.uniform1f(U.depth, cur.depth);
    gl.uniform1f(U.burst, cur.burst);
    gl.uniform1f(U.time, (now - t0) / 1000);
    gl.uniform2f(U.rot, intro ? 0 : cur.rx, intro ? 0 : cur.ry);
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
    replay: () => { hovering = false; start = performance.now(); cur.photo = 0; photo.style.opacity = "0"; showStep(0); wake(); },
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
