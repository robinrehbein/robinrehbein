import { deleteCookie } from "@std/http/cookie";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    const req = ctx.req;
    const url = new URL(req.url);
    const headers = new Headers();
    deleteCookie(headers, "session", { path: "/admin", domain: url.hostname });
    deleteCookie(headers, "auth", { path: "/" });

    headers.set("location", "/");
    return new Response(null, {
      status: 302,
      headers,
    });
  },
});
