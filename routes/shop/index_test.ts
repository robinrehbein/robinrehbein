import { assertEquals } from "@std/assert";
import { parseCategory } from "@/routes/shop/index.tsx";

Deno.test("parseCategory accepts valid category keys", () => {
  assertEquals(parseCategory("vase"), "vase");
  assertEquals(parseCategory("keycap"), "keycap");
});

Deno.test("parseCategory rejects unknown or missing values", () => {
  assertEquals(parseCategory("nope"), undefined);
  assertEquals(parseCategory(""), undefined);
  assertEquals(parseCategory(null), undefined);
});
