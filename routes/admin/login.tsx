import { PageProps } from "fresh";
import { getCookies, setCookie } from "@std/http/cookie";
import { Button } from "@/components/atoms/Button.tsx";
import H from "@/components/atoms/H.tsx";
import Section from "@/components/atoms/Section.tsx";
import { define } from "@/utils.ts";
import { createSession, validateSession } from "@/lib/sessions.ts";

// Simple in-memory rate limiter: max 5 attempts per IP per 15 minutes
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  // Purge expired entries to prevent unbounded Map growth
  for (const [key, record] of loginAttempts) {
    if (now > record.resetAt) loginAttempts.delete(key);
  }
  const record = loginAttempts.get(ip);
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  record.count += 1;
  return record.count > MAX_ATTEMPTS;
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  const maxLen = Math.max(aBytes.length, bBytes.length);
  // Always iterate the full length to avoid early-exit timing leaks
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < maxLen; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

export const handler = define.handlers({
  async GET(ctx) {
    const cookies = getCookies(ctx.req.headers);
    const sessionToken = cookies.session;
    if (sessionToken && await validateSession(sessionToken)) {
      return new Response("", {
        status: 303,
        headers: { Location: "/admin" },
      });
    }
    return { data: {} };
  },
  async POST(ctx) {
    // Prefer headers set by trusted infrastructure (Cloudflare, Nginx).
    // x-forwarded-for is omitted intentionally — it is client-controlled and trivially spoofed.
    const ip = ctx.req.headers.get("cf-connecting-ip") ??
      ctx.req.headers.get("x-real-ip") ?? "unknown";

    if (isRateLimited(ip)) {
      return {
        data: { error: "Too many attempts. Please try again later." },
      };
    }

    const form = await ctx.req.formData();
    const password = form.get("password")?.toString() ?? "";
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");

    if (!adminPassword) {
      console.error(
        "[SECURITY] ADMIN_PASSWORD environment variable not set",
      );
      return { data: { error: "Server configuration error" } };
    }

    if (timingSafeStringEqual(password, adminPassword)) {
      const token = await createSession();
      const headers = new Headers();
      setCookie(headers, {
        name: "session",
        value: token,
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        path: "/",
        sameSite: "Lax",
        secure: true,
      });
      headers.set("Location", "/admin");
      return new Response("", { status: 303, headers });
    }

    return { data: { error: "Invalid password" } };
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
