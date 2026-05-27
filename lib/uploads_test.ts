import { assert, assertEquals } from "@std/assert";
import { uploadFileName } from "@/lib/uploads.ts";

Deno.test("uploadFileName keeps slug + extension and timestamps", () => {
  const name = uploadFileName("My Photo.JPG", "ripple-vase", 1700000000000);
  assertEquals(name, "ripple-vase-1700000000000.jpg");
});

Deno.test("uploadFileName falls back to bin for missing extension", () => {
  const name = uploadFileName("noext", "x", 5);
  assert(name.endsWith(".bin"), `expected .bin fallback, got ${name}`);
});

Deno.test("uploadFileName sanitises unsafe extension chars", () => {
  const name = uploadFileName("a.p n g", "x", 5);
  assertEquals(name, "x-5.png");
});

Deno.test("uploadFileName neutralises path traversal in the slug", () => {
  const name = uploadFileName("x.png", "../../etc/passwd", 5);
  assert(!name.includes("/"), `filename must not contain '/': ${name}`);
  assert(!name.includes(".."), `filename must not contain '..': ${name}`);
  assertEquals(name, "etc-passwd-5.png");
});
