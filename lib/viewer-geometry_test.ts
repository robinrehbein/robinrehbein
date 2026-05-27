import { assert, assertEquals } from "@std/assert";
import {
  dominantFaceNormal,
  sliceContourSegments,
} from "@/lib/viewer-geometry.ts";

Deno.test("dominantFaceNormal picks the largest coplanar face", () => {
  // A 10x10 quad in the z=0 plane (two triangles, normal +Z, total area 100)
  // plus one tiny triangle facing +X — the quad must dominate.
  const tris = [
    0,
    0,
    0,
    10,
    0,
    0,
    10,
    10,
    0,
    0,
    0,
    0,
    10,
    10,
    0,
    0,
    10,
    0,
    0,
    0,
    5,
    0,
    1,
    5,
    0,
    0,
    6, // tiny, normal ~ +X
  ];
  const n = dominantFaceNormal(tris);
  assert(n, "expected a normal");
  assertEquals(Math.round(n.z), 1, "dominant face should point +Z");
  assertEquals(Math.round(n.x), 0);
  assertEquals(Math.round(n.y), 0);
});

Deno.test("dominantFaceNormal returns null without usable geometry", () => {
  assertEquals(dominantFaceNormal([]), null);
  // a degenerate (zero-area) triangle
  assertEquals(dominantFaceNormal([0, 0, 0, 0, 0, 0, 0, 0, 0]), null);
});

Deno.test("sliceContourSegments cuts a triangle once per interior layer", () => {
  // Triangle spanning z 0..10; planes at z=1..9 each cross it once.
  const tris = [0, 0, 0, 10, 0, 0, 0, 0, 10];
  const segments = sliceContourSegments(tris, 0, 1, 10);
  assertEquals(segments.length, 9 * 6, "9 interior layers, one segment each");
  // every emitted z lies on an integer layer plane between 1 and 9
  for (let i = 2; i < segments.length; i += 3) {
    const z = segments[i];
    assert(z >= 1 && z <= 9, `z ${z} out of layer range`);
    assertEquals(z, Math.round(z), "z should sit exactly on a layer plane");
  }
});

Deno.test("sliceContourSegments ignores planes outside the model", () => {
  const tris = [0, 0, 0, 10, 0, 0, 0, 0, 10];
  // step pushes all sampled planes above the model → no segments
  assertEquals(sliceContourSegments(tris, 100, 1, 10).length, 0);
});
