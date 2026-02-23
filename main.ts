import "@std/dotenv/load";
import { App, csrf, staticFiles } from "fresh";
import { type State } from "@/utils.ts";

export const app = new App<State>();

app.use(staticFiles());
app.use(csrf());
app.use(async (ctx) => {
  const res = await ctx.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
});
app.fsRoutes();

if (import.meta.main) {
  app.listen({
    hostname: "0.0.0.0",
    port: Number(Deno.env.get("PORT") ?? "8000"),
  });
}
