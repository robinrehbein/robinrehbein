import { assert } from "@std/assert";
import { renderToString } from "preact-render-to-string";
import { Button } from "@/components/ui/Button.tsx";

Deno.test("Button renders label and primary classes by default", () => {
  const html = renderToString(<Button>Kaufen</Button>);
  assert(html.includes("Kaufen"), "label missing");
  assert(html.includes("bg-[var(--ink)]"), "primary background missing");
});

Deno.test("Button secondary variant is outlined", () => {
  const html = renderToString(<Button variant="secondary">X</Button>);
  assert(html.includes("border"), "secondary border missing");
});

Deno.test("Button can render as an anchor", () => {
  const html = renderToString(<Button as="a" href="/x">Link</Button>);
  assert(html.includes("<a"), "anchor not rendered");
  assert(html.includes('href="/x"'), "href missing");
});
