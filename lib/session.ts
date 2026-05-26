const PREFIX = ["session"] as const;
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

/** Hex-encode random bytes into an unguessable session id. */
function randomId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Create a session in KV with a TTL and return its opaque id. */
export async function createSession(kv: Deno.Kv): Promise<string> {
  const id = randomId();
  await kv.set([...PREFIX, id], { createdAt: Date.now() }, {
    expireIn: TTL_MS,
  });
  return id;
}

/** True if the id maps to a live session. */
export async function isValidSession(
  kv: Deno.Kv,
  id: string,
): Promise<boolean> {
  if (!id) return false;
  const entry = await kv.get([...PREFIX, id]);
  return entry.value !== null;
}

/** Remove a session (logout). */
export async function destroySession(kv: Deno.Kv, id: string): Promise<void> {
  await kv.delete([...PREFIX, id]);
}
