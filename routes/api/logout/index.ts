import { deleteCookie, getCookies } from "@std/http/cookie";
import { define } from "@/utils.ts";
import { deleteSession } from "@/lib/sessions.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const cookies = getCookies(ctx.req.headers);
    const sessionToken = cookies.session;

    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    const headers = new Headers();
    deleteCookie(headers, "session", { path: "/" });
    headers.set("location", "/");
    return new Response(null, { status: 302, headers });
  },
});
