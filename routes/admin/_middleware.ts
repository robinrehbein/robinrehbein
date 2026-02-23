import { getCookies } from "@std/http/cookie";
import { define } from "@/utils.ts";
import { validateSession } from "@/lib/sessions.ts";

export default define.middleware(async (ctx) => {
  if (ctx.url.pathname === "/admin/login") {
    return ctx.next();
  }

  const cookies = getCookies(ctx.req.headers);
  const sessionToken = cookies.session;

  if (!sessionToken || !(await validateSession(sessionToken))) {
    return new Response("", {
      status: 303,
      headers: { Location: "/admin/login" },
    });
  }

  return ctx.next();
});
