enum MessageType {
  BROADCAST = "broadcast",
  MESSAGE = "message",
}

type BroadcastData = {
  count: number;
  clients: Array<{ id: string; name: string }>;
};

type MessageData =
  | string
  | Blob
  | File
  | ArrayBufferLike
  | ArrayBufferView;

type WebSocketData<T extends MessageType> = T extends MessageType.BROADCAST
  ? BroadcastData
  : T extends MessageType.MESSAGE ? MessageData
  : never;

type WebSocketBroadcastMessage = {
  type: MessageType.BROADCAST;
  data: WebSocketData<MessageType.BROADCAST>;
};

type WebSocketDataMessage = {
  type: MessageType.MESSAGE;
  id: string;
  sender: WebSocketClient;
  receiver: WebSocketClient;
  data: WebSocketData<MessageType.MESSAGE>;
};
type WebSocketMessage<T extends MessageType> = T extends MessageType.BROADCAST
  ? WebSocketBroadcastMessage
  : T extends MessageType.MESSAGE ? WebSocketDataMessage
  : never;

type WebSocketClient = {
  id: string;
  name: string;
};

enum WebSocketStatus {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
  ERROR = "ERROR",
}

enum WebSocketEvent {
  OPEN = "open",
  MESSAGE = "message",
  ERROR = "error",
  CLOSE = "close",
}

const activeConnections = new Map<WebSocket, { id: string; name: string }>();

const names = [
  "Fox",
  "Wolf",
  "Bear",
  "Eagle",
  "Owl",
  "Lion",
  "Tiger",
  "Hawk",
  "Dolphin",
  "Panther",
  "Falcon",
  "Phoenix",
  "Dragon",
  "Raven",
  "Serpent",
  "Jaguar",
  "Viper",
  "Lynx",
  "Cobra",
  "Great",
  "Banger",
  "Griffin",
  "Leopard",
  "Cheetah",
  "Falcon",
  "Osprey",
  "Condor",
  "Mamba",
  "Cougar",
  "Kestrel",
  "Mongoose",
  "Scorpion",
  "Python",
  "Badger",
  "Wolverine",
  "Raptor",
  "Shark",
  "Octopus",
  "Mantis",
  "Spider",
  "Wasp",
  "Hornet",
  "Krait",
  "Jackal",
  "Hyena",
  "Gazelle",
  "Antelope",
  "Ibex",
  "Cobra",
  "Viper",
  "Orca",
  "Piranha",
];

const broadcastClients = () => {
  const message: WebSocketMessage<MessageType.BROADCAST> = {
    type: MessageType.BROADCAST,
    data: {
      count: activeConnections.size,
      clients: Array.from(activeConnections.values()),
    },
  };

  activeConnections.keys().forEach((socket) =>
    socket.send(JSON.stringify(message))
  );
};

const createClient = (): WebSocketClient => {
  const id = crypto.randomUUID();
  const name = `${names[Math.floor(Math.random() * names.length)]} ${
    names[Math.floor(Math.random() * names.length)]
  }`;
  return { id, name };
};

const sendMessage = (
  { data, type, sender }: WebSocketMessage<MessageType.MESSAGE>,
) => {
  const [[sock, _client]] = Array.from(activeConnections.entries())
    .filter(
      (
        [_socket, client],
      ) => client.id === sender.id,
    );
  sock.send(JSON.stringify({ type, data }));
};

const handleWebSocket = (req: Request) => {
  if (req.headers.get("upgrade") !== "websocket") return;

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener(WebSocketEvent.OPEN, () => {
    const client = createClient();
    activeConnections.set(socket, client);
    broadcastClients();
    console.log("Client connected! Total:", activeConnections.size);
  });

  socket.addEventListener(
    WebSocketEvent.MESSAGE,
    (event: MessageEvent<WebSocketMessage<MessageType.MESSAGE>>) => {
      console.log("Message received:", event.data);
      const { data, type } = event.data;

      if (type === "message") {
        sendMessage(event.data);
      }
    },
  );

  socket.addEventListener(WebSocketEvent.ERROR, (event) => {
    socket.send(JSON.stringify({ type: "error", event }));
  });

  socket.addEventListener("close", () => {
    console.log("WebSocket disconnected!");
    activeConnections.delete(socket);
    broadcastClients();
    console.log("Client disconnected! Total:", activeConnections.size);
  });

  return response;
};

export {
  handleWebSocket,
  MessageType,
  type WebSocketBroadcastMessage,
  type WebSocketClient,
  type WebSocketData,
  type WebSocketDataMessage,
  type WebSocketEvent,
  type WebSocketMessage,
  WebSocketStatus,
};
