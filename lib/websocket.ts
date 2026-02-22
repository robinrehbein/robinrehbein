enum MessageType {
  BROADCAST = "broadcast",
  MESSAGE = "message",
  WELCOME = "welcome",
  FILE = "file",
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

type FileData = {
  fileName: string;
  fileType: string;
  fileData: string; // Base64 encoded for simplicity in JSON
  size: number;
};

type WebSocketData<T extends MessageType> = T extends MessageType.BROADCAST
  ? BroadcastData
  : T extends MessageType.MESSAGE ? MessageData
  : T extends MessageType.FILE ? FileData
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

type WebSocketFileMessage = {
  type: MessageType.FILE;
  id: string;
  sender: WebSocketClient;
  receiver: WebSocketClient;
  data: WebSocketData<MessageType.FILE>;
};

type WebSocketWelcomeMessage = {
  type: MessageType.WELCOME;
  data: WebSocketClient;
};

type WebSocketMessage<T extends MessageType> = T extends MessageType.BROADCAST
  ? WebSocketBroadcastMessage
  : T extends MessageType.MESSAGE ? WebSocketDataMessage
  : T extends MessageType.FILE ? WebSocketFileMessage
  : T extends MessageType.WELCOME ? WebSocketWelcomeMessage
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
  message: WebSocketDataMessage | WebSocketFileMessage,
) => {
  const target = Array.from(activeConnections.entries())
    .find(
      (
        [_socket, client],
      ) => client.id === message.receiver.id,
    );
  if (target) {
    const [sock] = target;
    sock.send(
      JSON.stringify({
        type: message.type,
        data: message.data,
        sender: message.sender,
      }),
    );
  }
};

const handleWebSocket = (req: Request) => {
  if (req.headers.get("upgrade") !== "websocket") return;

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener(WebSocketEvent.OPEN, () => {
    const client = createClient();
    activeConnections.set(socket, client);

    // Send welcome message to the client so they know their own identity
    socket.send(JSON.stringify({
      type: "welcome",
      data: client,
    }));

    broadcastClients();
    console.log("Client connected! Total:", activeConnections.size);
  });

  socket.addEventListener(
    WebSocketEvent.MESSAGE,
    (event: MessageEvent<string>) => {
      console.log("Message received:", event.data);
      try {
        const message = JSON.parse(event.data) as WebSocketMessage<
          MessageType.MESSAGE | MessageType.FILE
        >;
        if (
          message.type === MessageType.MESSAGE ||
          message.type === MessageType.FILE
        ) {
          sendMessage(message);
        }
      } catch (e) {
        console.error("Failed to parse websocket message", e);
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
  type WebSocketFileMessage,
  type WebSocketMessage,
  WebSocketStatus,
};
