import { PageProps } from "fresh";
import { getCookies, setCookie } from "@std/http/cookie";
import { Button } from "../../components/atoms/Button.tsx";
import H from "../../components/atoms/H.tsx";
import Section from "../../components/atoms/Section.tsx";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    const req = ctx.req;
    const cookies = getCookies(req.headers);
    if (cookies.auth === "admin") {
      return new Response("", {
        status: 303,
        headers: { Location: "/admin" },
      });
    }
    return { data: {} };
  },
  async POST(ctx) {
    const req = ctx.req;
    const form = await req.formData();
    const password = form.get("password")?.toString();
    const adminPassword = Deno.env.get("ADMIN_PASSWORD") || "admin123";

    // console.log("[DEBUG_LOG] Login attempt");
    // console.log("[DEBUG_LOG] ADMIN_PASSWORD env set:", !!Deno.env.get("ADMIN_PASSWORD"));

    if (password === adminPassword) {
      const headers = new Headers();
      setCookie(headers, {
        name: "auth",
        value: "admin",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        path: "/",
        sameSite: "Lax",
      });
      headers.set("Location", "/admin");
      return new Response("", {
        status: 303,
        headers,
      });
    } else {
      return { data: { error: "Invalid password" } };
    }
  },
});

export default function LoginPage({ data }: PageProps<{ error?: string }>) {
  return (
    <Section
      separator={false}
      class="min-h-[60vh] flex flex-col items-center justify-center"
    >
      <div class="w-full max-w-md border border-foreground p-8">
        <H variant="h2" class="text-3xl font-clash-display uppercase mb-8">
          Admin Login
        </H>
        {data?.error && <p class="text-red-800 mb-4">{data.error}</p>}
        <form method="post" class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label
              for="password"
              class="font-zodiak uppercase text-sm font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              class="border border-foreground bg-transparent p-2 focus:outline-none"
              required
            />
          </div>
          <Button type="submit">Login</Button>
        </form>
      </div>
    </Section>
  );
}
