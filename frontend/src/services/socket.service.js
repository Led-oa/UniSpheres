// src/services/socket.service.js
import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io("http://localhost:8000", {
      auth: { token },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("🔌 Connecté au serveur Socket.IO");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("🔌 Déconnecté du serveur Socket.IO");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Erreur de connexion Socket.IO:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
