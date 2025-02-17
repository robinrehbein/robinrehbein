import { IS_BROWSER } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import { Button } from "../components/atoms/Button.tsx";
import { useWebSocket } from "../hooks/useWebsocket.ts";
import {
  MessageType,
  WebSocketClient,
  WebSocketEvent,
  WebSocketMessage,
} from "../lib/websocket.ts";

const isBroadcastData = (
  data: any,
): data is WebSocketMessage<MessageType.BROADCAST> => {
  return data.type === "broadcast";
};

const isMessageData = (
  data: any,
): data is WebSocketMessage<MessageType.MESSAGE> => {
  return data.type === "message";
};

const HubClient = () => {
  if (!IS_BROWSER) return null;

  const count = useSignal<number>(0);
  const clients = useSignal<Array<WebSocketClient>>([]);

  const { status, sendMessage } = useWebSocket({
    url: `ws://${globalThis.location.host}${globalThis.location.pathname}`,
    reconnectAttempts: 3,
    reconnectInterval: 3000,

    onMessage: (
      event: MessageEvent<
        string
      >,
    ) => {
      const message: WebSocketMessage<
        MessageType.MESSAGE | MessageType.BROADCAST
      > = JSON.parse(event.data);

      if (isBroadcastData(message)) {
        count.value = message.data.count;
        clients.value = message.data.clients;
      }
      if (isMessageData(message)) {
        console.log("onmessage with data", message.data);
        alert(`Received data: ${JSON.stringify(message.data)}`);
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
                sendMessage({
                  type: MessageType.MESSAGE,
                  id: client.id,
                  sender: client,
                  receiver: client,
                  data: "Hello from the Hub!",
                });
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
