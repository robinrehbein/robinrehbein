import { IS_BROWSER } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import { Button } from "../components/atoms/Button.tsx";
import H from "../components/atoms/H.tsx";
import { IconCircle } from "../components/Icons.tsx";
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
  const me = useSignal<WebSocketClient | null>(null);

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
        MessageType.MESSAGE | MessageType.BROADCAST | MessageType.WELCOME
      > = JSON.parse(event.data);

      if (message.type === MessageType.BROADCAST) {
        count.value = message.data.count;
        clients.value = message.data.clients;
      }
      if (message.type === MessageType.WELCOME) {
        me.value = message.data;
      }
      if (message.type === MessageType.MESSAGE) {
        console.log("onmessage with data", message.data);
        alert(`Received data: ${JSON.stringify(message.data)}`);
      }
    },
  });

  if (status.value === "CONNECTING") {
    return (
      <div class="flex items-center gap-2 italic">
        <IconCircle class="size-3 animate-ping text-yellow-600" />
        Connecting to Hub...
      </div>
    );
  }
  if (status.value === "ERROR") {
    return (
      <div class="flex items-center gap-2 text-red-800 italic">
        <IconCircle class="size-3 text-red-800" />
        Error Connecting to Hub.
      </div>
    );
  }

  const otherClients = clients.value.filter((c) => c.id !== me.value?.id);

  return (
    <div class="flex flex-col gap-12">
      <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-foreground pb-8">
        <div>
          <p class="text-sm uppercase font-medium mb-1">Your Device</p>
          <H variant="h3" class="text-2xl font-clash-display uppercase">
            {me.value?.name || "Initializing..."}
          </H>
        </div>
        <div class="text-right">
          <p class="text-sm uppercase font-medium mb-1">Connected Devices</p>
          <p class="text-2xl font-clash-display">{count.value}</p>
        </div>
      </div>

      <div>
        <H variant="h3" class="text-xl font-clash-display uppercase mb-8">
          Available Devices
        </H>
        {otherClients.length === 0
          ? (
            <p class="italic opacity-70">
              No other devices connected. Open this page on another device to share data.
            </p>
          )
          : (
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherClients.map((client) => (
                <li
                  key={client.id}
                  class="border border-foreground p-6 flex flex-col justify-between gap-6 hover:bg-foreground hover:text-background transition-colors group"
                >
                  <div>
                    <p class="text-xs uppercase font-medium mb-1 opacity-70 group-hover:opacity-100">
                      Device Name
                    </p>
                    <p class="text-lg font-medium">{client.name}</p>
                  </div>
                  <div class="flex flex-col gap-4">
                    <Button
                      class="w-full group-hover:bg-background group-hover:text-foreground"
                      onClick={() => {
                        const text = prompt("Enter message to share:");
                        if (text) {
                          sendMessage({
                            type: MessageType.MESSAGE,
                            id: client.id,
                            sender: me.value!,
                            receiver: client,
                            data: text,
                          });
                        }
                      }}
                    >
                      Share Message
                    </Button>
                    <div class="relative">
                      <input
                        type="file"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            alert(`File support coming soon! You tried to share: ${file.name}`);
                          }
                        }}
                      />
                      <Button
                        class="w-full group-hover:bg-background group-hover:text-foreground opacity-50 pointer-events-none"
                      >
                        Share File (Soon)
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
      </div>
    </div>
  );
};

export default HubClient;
