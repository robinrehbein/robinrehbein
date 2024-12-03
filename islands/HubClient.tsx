import { IS_BROWSER } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import { Button } from "../components/Button.tsx";
import { useWebSocket, WebSocketMessage } from "../hooks/useWebsocket.ts";

type Client = {
  id: string;
  name: string;
};

type MessageType = {
  type: "message";
  data: WebSocketMessage;
};

type ClientsMessage = {
  type: "clients";
  count: number;
  clients: Array<Client>;
};

const HubClient = () => {
  if (!IS_BROWSER) return null;

  const count = useSignal<number>(0);
  const clients = useSignal<Array<Client>>([]);

  const { status, sendMessage } = useWebSocket({
    url: `ws://${globalThis.location.host}${globalThis.location.pathname}`,
    reconnectAttempts: 3,
    reconnectInterval: 3000,

    onMessage: (event: MessageEvent<string>) => {
      const data: ClientsMessage | MessageType = JSON.parse(event.data);
      if (data.type === "clients") {
        count.value = data.count;
        clients.value = data.clients;
      }
      if (data.type === "message") {
        console.log("onmessage with data", data.data);
      }
    },
  });

  if (status.value === "CONNECTING") {
    return <div>Connecting...</div>;
  }
  if (status.value === "ERROR") {
    return <div>Error Connecting...</div>;
  }

  return (
    <div>
      Verbundene Geräte: {count.value}
      <ul>
        {clients.value.map((client) => (
          <li>
            {client.name}
            <Button
              onClick={() => {
                sendMessage(
                  JSON.stringify({
                    type: "message",
                    data: client,
                  }),
                );
              }}
            >
              send data
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HubClient;
