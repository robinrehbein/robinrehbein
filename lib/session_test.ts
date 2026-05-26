import { assert, assertEquals, assertNotEquals } from "@std/assert";
import {
  createSession,
  destroySession,
  isValidSession,
} from "@/lib/session.ts";

Deno.test("createSession returns a high-entropy id that validates", async () => {
  const kv = await Deno.openKv(":memory:");
  const id = await createSession(kv);
  assert(id.length >= 32, "session id too short");
  assertEquals(await isValidSession(kv, id), true);
  kv.close();
});

Deno.test("ids are unique per call", async () => {
  const kv = await Deno.openKv(":memory:");
  assertNotEquals(await createSession(kv), await createSession(kv));
  kv.close();
});

Deno.test("unknown id is invalid", async () => {
  const kv = await Deno.openKv(":memory:");
  assertEquals(await isValidSession(kv, "nope"), false);
  kv.close();
});

Deno.test("destroySession invalidates the id", async () => {
  const kv = await Deno.openKv(":memory:");
  const id = await createSession(kv);
  await destroySession(kv, id);
  assertEquals(await isValidSession(kv, id), false);
  kv.close();
});
