// File: src/socket/message.socket.js
const MessageService = require("../services/message.service");
const FileService = require("../services/file.service");

module.exports = (socket, io) => {
  console.log(`🟢 Message socket connected: ${socket.id}`);

  // Rejoindre une conversation pour recevoir ses événements en temps réel
  socket.on("joinConversation", async (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`Socket ${socket.id} joined conversation_${conversationId}`);
  });

  // Quitter une conversation
  socket.on("leaveConversation", async (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
    console.log(`Socket ${socket.id} left conversation_${conversationId}`);
  });

  // Créer / envoyer un message
  socket.on("sendMessage", async (data) => {
    try {
      const { conversationId, senderId, content, file } = data;

      // Créer le message en BDD via le service
      const message = await MessageService.create({
        conversationId,
        senderId,
        content,
      });

      // Ajouter fichier si fourni
      if (file) {
        await FileService.create({
          file_name: file.originalname,
          file_path: file.path,
          message_id: message.id_message,
        });
        message.file = file.path;
        message.file_name = file.originalname;
      }

      // Diffuser le message à tous les membres de la conversation
      io.to(`conversation_${conversationId}`).emit("newMessage", message);
    } catch (err) {
      console.error("sendMessage error:", err);
      socket.emit("errorMessage", { message: err.message });
    }
  });

  // Modifier un message
  socket.on("editMessage", async (data) => {
    try {
      const { messageId, senderId, content, conversationId } = data;

      const updated = await MessageService.update({
        messageId,
        senderId,
        content,
      });

      io.to(`conversation_${conversationId}`).emit("messageEdited", updated);
    } catch (err) {
      console.error("editMessage error:", err);
      socket.emit("errorMessage", { message: err.message });
    }
  });

  // Supprimer un message
  socket.on("deleteMessage", async (data) => {
    try {
      const { messageId, senderId, conversationId } = data;

      await MessageService.remove({ messageId, senderId });

      io.to(`conversation_${conversationId}`).emit("messageDeleted", {
        id_message: messageId,
      });
    } catch (err) {
      console.error("deleteMessage error:", err);
      socket.emit("errorMessage", { message: err.message });
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Message socket disconnected: ${socket.id}`);
  });
};
