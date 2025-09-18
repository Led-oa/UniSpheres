// File: src/socket/message.socket.js
const MessageService = require("../services/message.service");
const FileService = require("../services/file.service");
const FilePathToUrl = require("../utils/urlCleaner.utils");

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
    console.log("sendMessage event received:", {
      conversationId: data.conversationId,
      hasContent: !!data.content,
      hasFile: !!data.file,
      senderId: data.senderId,
    });

    try {
      const { conversationId, senderId, content, file } = data;

      // Vérifier que senderId est bien fourni
      if (!senderId) {
        console.error("senderId is missing in socket data");
        socket.emit("errorMessage", { message: "Sender ID is required" });
        return;
      }

      // Créer le message en BDD via le service
      const message = await MessageService.create({
        conversationId,
        senderId,
        content,
      });

      console.log("Message created in DB:", message.id_message);

      // Ajouter fichier si fourni
      if (file) {
        // Attendre le traitement complet du fichier
        console.log("Processing file:", file.originalname);
        const fileRecord = await FileService.create({
          file_name: file.originalname,
          file_path: file.path,
          message_id: message.id_message,
        });

        // Ajouter les infos COMPLÈTES du fichier
        message.file = FilePathToUrl.urlCleaner(file.path); // URL propre
        message.file_path = file.path; // Chemin original
        message.file_name = file.originalname;
        message.file_id = fileRecord.id_file;

        console.log("File processed successfully");
      }

      // Diffuser le message à tous les membres de la conversation
      io.to(`conversation_${conversationId}`).emit("newMessage", message);

      console.log("Message broadcasted to conversation:", conversationId);
    } catch (err) {
      console.error("sendMessage error:", err);
      socket.emit("errorMessage", { message: err.message });
    }
  });

  // Modifier un message
  socket.on("editMessage", async (data) => {
    console.log("editMessage event received:", data);
    try {
      const { messageId, senderId, content, conversationId } = data;

      // Vérifier les données requises
      if (!messageId || !senderId || !content || !conversationId) {
        throw new Error("Missing required fields");
      }

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

      // Vérifier les données requises
      if (!messageId || !senderId || !conversationId) {
        throw new Error("Missing required fields");
      }

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
