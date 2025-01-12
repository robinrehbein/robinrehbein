import { Handlers } from "$fresh/server.ts";
import H from "../../components/atoms/H.tsx";
import HubClient from "../../islands/HubClient.tsx";
import { handleWebSocket } from "../../lib/websocket.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const res = await handleWebSocket(req);
    if (res) {
      return res;
    }
    return ctx.render();
  },
};

export default function Hub() {
  return (
    <>
      <H variant="h1">Hub</H>
      <HubClient />
    </>
  );
}
