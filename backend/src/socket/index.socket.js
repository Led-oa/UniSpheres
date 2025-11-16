const { Server } = require("socket.io");
const conversationSockets = require("./conversation.socket");
const messageSockets = require("./message.socket");

let io;

const initSockets = (server) => {
  // Origines autorisées
  const allowedOrigins = [
    "http://localhost",
    "http://localhost:80",
    "http://localhost:5173",
    "http://127.0.0.1",
    "http://127.0.0.1:80",
    "http://127.0.0.1:5173",
  ];

  io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        // Autoriser toutes les IPs du réseau local
        const allowedPatterns = [
          /^http:\/\/localhost(:\d+)?$/,
          /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/,
          /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/,
        ];

        const isAllowed = allowedPatterns.some((p) => p.test(origin));
        callback(null, isAllowed);
      },
      credentials: true,
      methods: ["GET", "POST"],
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
