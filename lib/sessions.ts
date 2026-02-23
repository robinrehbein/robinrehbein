import { kv } from "@/lib/kv.ts";

const SESSIONS_KEY = "admin_sessions";
const SESSION_TTL_MS = 60 * 60 * 24 * 7 * 1000; // 1 week

export async function createSession(): Promise<string> {
  const token = crypto.randomUUID();
  await kv.set([SESSIONS_KEY, token], true, { expireIn: SESSION_TTL_MS });
  return token;
}

export async function validateSession(token: string): Promise<boolean> {
  const res = await kv.get([SESSIONS_KEY, token]);
  return res.value === true;
}

export async function deleteSession(token: string): Promise<void> {
  await kv.delete([SESSIONS_KEY, token]);
}
