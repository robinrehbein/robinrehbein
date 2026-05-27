import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { isValidSession } from "@/lib/session.ts";
import { readSessionCookie } from "@/lib/admin-auth.ts";

export default define.middleware(async (ctx) => {
  // Let the login page (GET form + POST handler) through unguarded.
  if (ctx.url.pathname === "/admin/login") return ctx.next();

  const id = readSessionCookie(ctx.req.headers);
  if (id && (await isValidSession(await getKv(), id))) return ctx.next();

  return ctx.redirect("/admin/login");
});
