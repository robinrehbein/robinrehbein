import { assert } from "@std/assert";
import { renderToString } from "preact-render-to-string";
import { Price } from "@/components/ui/Price.tsx";

Deno.test("Price renders an exact euro amount", () => {
  const html = renderToString(<Price cents={1800} />);
  assert(html.includes("18 €"), "exact price missing");
});

Deno.test("Price with from prefix renders 'ab'", () => {
  const html = renderToString(<Price cents={1800} from />);
  assert(html.includes("ab 18 €"), "from price missing");
});
