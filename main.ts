import "@std/dotenv/load";
import { App, staticFiles } from "fresh";
import { type State } from "@/utils.ts";

export const app = new App<State>();

app.use(staticFiles());
app.fsRoutes();

if (import.meta.main) {
  app.listen({
    hostname: "0.0.0.0",
    port: Number(Deno.env.get("PORT") ?? "8000"),
  });
}
