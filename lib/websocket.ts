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
  "Lynx",
  "Cobra",
  "Great",
  "Banger",
  "Viper",
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
  const message = JSON.stringify({
    type: "clients",
    count: activeConnections.size,
    clients: Array.from(activeConnections.values()),
  });

  activeConnections.keys().forEach((socket) => socket.send(message));
};

const createClient = () => {
  const id = crypto.randomUUID();
  const name = `${names[Math.floor(Math.random() * names.length)]} ${
    names[Math.floor(Math.random() * names.length)]
  }`;
  return { id, name: name };
};

const sendMessage = (data: any) => {
  const [[sock, _client]] = Array.from(activeConnections.entries())
    .filter(
      (
        [_socket, client],
      ) => client.id === data.id,
    );
  sock.send(JSON.stringify({ type: "data", data }));
};

const handleWebSocket = (req: Request) => {
  if (req.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.addEventListener("open", () => {
      const client = createClient();
      activeConnections.set(socket, client);
      broadcastClients();
      console.log("Client connected! Total:", activeConnections.size);
    });

    socket.addEventListener("message", (event) => {
      const { data, type } = JSON.parse(event.data);
      if (type === "message") {
        sendMessage(data);
      }
    });

    socket.addEventListener("error", (event) => {
      socket.send(JSON.stringify({ type: "error", event }));
    });

    socket.addEventListener("close", () => {
      activeConnections.delete(socket);
      broadcastClients();
      console.log("Client disconnected! Total:", activeConnections.size);
    });

    return response;
  }
};

export { handleWebSocket };
