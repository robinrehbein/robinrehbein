let kvPromise: Promise<Deno.Kv> | undefined;

/** Lazily open and memoise the application's Deno KV connection. */
export function getKv(): Promise<Deno.Kv> {
  if (!kvPromise) kvPromise = Deno.openKv();
  return kvPromise;
}
