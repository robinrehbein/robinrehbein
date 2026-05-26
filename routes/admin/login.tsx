import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { createSession } from "@/lib/session.ts";
import { attachSessionCookie } from "@/lib/admin-auth.ts";

export const handler = define.handlers({
  GET() {
    return { data: { error: false } };
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const password = form.get("password")?.toString() ?? "";
    const expected = Deno.env.get("ADMIN_PASSWORD") ?? "";
    if (!expected || password !== expected) {
      return { data: { error: true } };
    }
    const id = await createSession(await getKv());
    const headers = new Headers({ location: "/admin" });
    attachSessionCookie(headers, id);
    return new Response(null, { status: 303, headers });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <section class="shell flex min-h-[70vh] items-center justify-center py-16">
    <form method="post" class="card w-full max-w-sm p-6">
      <p class="eyebrow text-[var(--clay)]">Admin</p>
      <h1 class="display mt-3 text-3xl font-semibold">Anmelden</h1>
      {data.error && (
        <p class="mt-3 text-sm text-[var(--oxide)]">Falsches Passwort.</p>
      )}
      <label class="mt-5 block">
        <span class="eyebrow opacity-70">Passwort</span>
        <input type="password" name="password" class="field mt-1" required />
      </label>
      <button type="submit" class="button mt-5 w-full">Einloggen</button>
    </form>
  </section>
));
