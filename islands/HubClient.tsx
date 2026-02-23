import { IS_BROWSER } from "fresh/runtime";
import { useSignal } from "@preact/signals";
import { Button } from "../components/atoms/Button.tsx";
import H from "../components/atoms/H.tsx";
import { IconArrowDown, IconCircle, IconMail } from "../components/Icons.tsx";
import { useWebSocket } from "../hooks/useWebsocket.ts";
import {
  MessageType,
  WebSocketClient,
  WebSocketMessage,
} from "../lib/websocket.ts";

const HubClient = () => {
  const count = useSignal<number>(0);
  const clients = useSignal<Array<WebSocketClient>>([]);
  const me = useSignal<WebSocketClient | null>(null);

  const protocol = IS_BROWSER
    ? (globalThis.location.protocol === "https:" ? "wss:" : "ws:")
    : "";
  const host = IS_BROWSER ? globalThis.location.host : "";
  const pathname = IS_BROWSER ? globalThis.location.pathname : "";

  const { status, sendMessage } = useWebSocket({
    url: IS_BROWSER ? `${protocol}//${host}${pathname}` : "",
    reconnectAttempts: 3,
    reconnectInterval: 3000,

    onMessage: (
      event: MessageEvent<
        string
      >,
    ) => {
      const message: WebSocketMessage<
        | MessageType.MESSAGE
        | MessageType.BROADCAST
        | MessageType.WELCOME
        | MessageType.FILE
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
        alert(
          `Received message from ${
            message.sender?.name || "Unknown"
          }: ${message.data}`,
        );
      }
      if (message.type === MessageType.FILE) {
        const { fileName, fileData } = message.data;
        const confirmDownload = confirm(
          `Received file "${fileName}" from ${
            message.sender?.name || "Unknown"
          }. Download?`,
        );
        if (confirmDownload) {
          const link = document.createElement("a");
          link.href = fileData;
          link.download = fileName;
          link.click();
        }
      }
    },
  });

  if (!IS_BROWSER) return null;

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
              No other devices connected. Open this page on another device to
              share data.
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
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      class="w-full border border-foreground/60 group-hover:border-background/60 px-4 py-3 inline-flex items-center justify-between gap-3 font-clash-display uppercase text-sm tracking-wide hover:italic transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_currentColor] active:translate-y-0 active:shadow-none"
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
                      <span class="inline-flex items-center gap-2">
                        <IconMail class="size-4" />
                        Message
                      </span>
                      <IconArrowDown class="-rotate-90 size-3.5 opacity-80" />
                    </Button>
                    <div class="relative">
                      <input
                        type="file"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = (e.target as HTMLInputElement).files
                            ?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert("File too large (max 5MB)");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              sendMessage({
                                type: MessageType.FILE,
                                id: client.id,
                                sender: me.value!,
                                receiver: client,
                                data: {
                                  fileName: file.name,
                                  fileType: file.type,
                                  fileData: reader.result as string,
                                  size: file.size,
                                },
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Button class="w-full border border-foreground/60 group-hover:border-background/60 px-4 py-3 inline-flex items-center justify-between gap-3 font-clash-display uppercase text-sm tracking-wide hover:italic transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_currentColor] active:translate-y-0 active:shadow-none">
                        <span class="inline-flex items-center gap-2">
                          <IconArrowDown class="rotate-180 size-4" />
                          Share File
                        </span>
                        <IconArrowDown class="-rotate-90 size-3.5 opacity-80" />
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
