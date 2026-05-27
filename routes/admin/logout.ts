import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { destroySession } from "@/lib/session.ts";
import { clearSessionCookie, readSessionCookie } from "@/lib/admin-auth.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const id = readSessionCookie(ctx.req.headers);
    if (id) await destroySession(await getKv(), id);
    const headers = new Headers({ location: "/admin/login" });
    clearSessionCookie(headers);
    return new Response(null, { status: 303, headers });
  },
});
