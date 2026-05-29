import { assert } from "@std/assert";
import { renderToString } from "preact-render-to-string";
import { Badge } from "@/components/ui/Badge.tsx";

Deno.test("Badge renders children", () => {
  const html = renderToString(<Badge>Vase</Badge>);
  assert(html.includes("Vase"), "badge label missing");
});

Deno.test("Badge accent variant uses accent color", () => {
  const html = renderToString(<Badge variant="accent">Neu</Badge>);
  assert(html.includes("var(--accent)"), "accent color missing");
});
