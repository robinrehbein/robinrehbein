// Pure geometry helpers for the 3D print viewer. Framework-agnostic so they
// can be unit-tested without three.js. Triangles are flat world-space floats:
// [ax,ay,az, bx,by,bz, cx,cy,cz, ...].

export type Vec3 = { x: number; y: number; z: number };

/**
 * Largest-area coplanar face normal across all triangles. Used to choose the
 * best print orientation: the dominant flat face is laid on the build plate.
 * Returns null when there is no usable geometry.
 */
export function dominantFaceNormal(tris: ArrayLike<number>): Vec3 | null {
  const buckets = new Map<string, Vec3 & { area: number }>();
  for (let i = 0; i + 8 < tris.length; i += 9) {
    const ux = tris[i + 3] - tris[i];
    const uy = tris[i + 4] - tris[i + 1];
    const uz = tris[i + 5] - tris[i + 2];
    const vx = tris[i + 6] - tris[i];
    const vy = tris[i + 7] - tris[i + 1];
    const vz = tris[i + 8] - tris[i + 2];
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz);
    const area = len * 0.5;
    if (area <= 1e-9) continue;
    nx /= len;
    ny /= len;
    nz /= len;
    const key = `${Math.round(nx * 20)},${Math.round(ny * 20)},${
      Math.round(nz * 20)
    }`;
    const bucket = buckets.get(key);
    if (bucket) bucket.area += area;
    else buckets.set(key, { x: nx, y: ny, z: nz, area });
  }
  let best: (Vec3 & { area: number }) | null = null;
  for (const bucket of buckets.values()) {
    if (!best || bucket.area > best.area) best = bucket;
  }
  return best ? { x: best.x, y: best.y, z: best.z } : null;
}

/**
 * Slice triangles with horizontal planes at each layer height and return the
 * contour line segments as flat pairs [x,y,z, x,y,z, ...] for LineSegments.
 */
export function sliceContourSegments(
  tris: ArrayLike<number>,
  minZ: number,
  step: number,
  layerCount: number,
): number[] {
  const segments: number[] = [];
  for (let layer = 1; layer < layerCount; layer += 1) {
    const z = minZ + layer * step;
    for (let t = 0; t + 8 < tris.length; t += 9) {
      const zs = [tris[t + 2], tris[t + 5], tris[t + 8]];
      if (z < Math.min(...zs) || z > Math.max(...zs)) continue;
      const xs = [tris[t], tris[t + 3], tris[t + 6]];
      const ys = [tris[t + 1], tris[t + 4], tris[t + 7]];
      const hits: number[] = [];
      for (let edge = 0; edge < 3; edge += 1) {
        const next = (edge + 1) % 3;
        const za = zs[edge];
        const zb = zs[next];
        if ((za < z && zb >= z) || (zb < z && za >= z)) {
          const f = (z - za) / (zb - za);
          hits.push(
            xs[edge] + (xs[next] - xs[edge]) * f,
            ys[edge] + (ys[next] - ys[edge]) * f,
            z,
          );
        }
      }
      if (hits.length === 6) segments.push(...hits);
    }
  }
  return segments;
}
