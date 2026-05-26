import { assertEquals } from "@std/assert";
import { App } from "fresh";
import { type State } from "@/utils.ts";
import { handler } from "@/routes/shop/index.tsx";

Deno.test("GET /shop redirects to / permanently", async () => {
  const app = new App<State>().get("/shop", handler.GET).handler();
  const res = await app(new Request("http://localhost/shop"));
  await res.body?.cancel();
  assertEquals(res.status, 308);
  assertEquals(res.headers.get("location"), "/");
});
