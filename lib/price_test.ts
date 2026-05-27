import { assertEquals } from "@std/assert";
import { formatEuro, formatFrom } from "@/lib/price.ts";

Deno.test("formatEuro shows whole euros without decimals", () => {
  assertEquals(formatEuro(3400), "34 €");
});

Deno.test("formatEuro shows cents when present", () => {
  assertEquals(formatEuro(1850), "18,50 €");
});

Deno.test("formatFrom prefixes with 'ab'", () => {
  assertEquals(formatFrom(3400), "ab 34 €");
});
