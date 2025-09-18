const { Server } = require("socket.io");
const conversationSockets = require("./conversation.socket");
const messageSockets = require("./message.socket");

let io;

const initSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    // Importer les événements conversationnels
    conversationSockets(socket, io);
    messageSockets(socket, io);

    socket.on("disconnect", () => {
      console.log("🔌 Client disconnected:", socket.id);
    });
  });
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initSockets, getIO };
