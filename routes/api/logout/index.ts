import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";

export const handler: Handlers = {
  GET(req) {
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
};
