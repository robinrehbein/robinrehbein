import { assertEquals } from "@std/assert";
import { categoryLabel } from "@/lib/catalog.ts";

Deno.test("categoryLabel maps union keys to German labels", () => {
  assertEquals(categoryLabel("vase"), "Vase");
  assertEquals(categoryLabel("planter"), "Planter");
  assertEquals(categoryLabel("keycap"), "Keycaps");
  assertEquals(categoryLabel("organisation"), "Organisation");
});
