const MessageService = require("../services/message.service");
const FileService = require("../services/file.service");
const { getIO } = require("../socket/index.socket");

const MessageController = {
  // Créer/envoyer un message
  async create(req, res) {
    try {
      const { conversationId, content } = req.body;
      const senderId = req.user.id_user; // supposons que tu as middleware auth qui ajoute user

      // Créer le message
      const message = await MessageService.create({
        conversationId,
        senderId,
        content,
      });

      // Si un fichier est attaché
      if (req.file?.path) {
        await FileService.create({
          file_name: req.file.originalname,
          file_path: req.file.path,
          message_id: message.id_message,
        });
        message.file = req.file.path;
        message.file_name = req.file.originalname;
      }

      // Diffusion Socket.IO
      try {
        const io = getIO();
        io.to(`conversation_${conversationId}`).emit("newMessage", message);
      } catch (err) {
        console.error("Socket.IO not initialized for message creation", err);
      }

      res.status(201).json(message);
    } catch (err) {
      console.error("MessageController.create error:", err);
      res.status(400).json({ error: err.message });
    }
  },

  // Modifier un message
  async update(req, res) {
    try {
      const messageId = req.params.messageId;
      const { content } = req.body;
      const senderId = req.user.id_user;

      const updated = await MessageService.update({
        messageId,
        senderId,
        content,
      });

      // Diffusion Socket.IO
      try {
        const io = getIO();
        io.to(`conversation_${updated.conversation_id}`).emit(
          "messageEdited",
          updated
        );
      } catch (err) {
        console.error("Socket.IO not initialized for message update", err);
      }
      res.json(updated);
    } catch (err) {
      console.error("MessageController.update error:", err);
      res.status(403).json({ error: err.message });
    }
  },

  // Récupérer tous les messages d'une conversation
  async getByConversation(req, res) {
    try {
      const conversationId = req.params.conversationId;
      const userId = req.user.id_user;
      const messages = await MessageService.getByConversation(
        conversationId,
        userId
      );

      console.log("[Controller Messages ] get message by convo : ", messages);

      res.json(messages);
    } catch (err) {
      console.error("MessageController.getByConversation error:", err);
      res.status(403).json({ error: err.message });
    }
  },

  // Supprimer un message
  async remove(req, res) {
    try {
      const messageId = req.params.messageId;
      const senderId = req.user.id_user;

      await MessageService.remove({ messageId, senderId });

      // Diffusion Socket.IO
      try {
        const io = getIO();
        io.to(`conversation_${req.body.conversationId}`).emit(
          "messageDeleted",
          { id_message: Number(messageId) }
        );
      } catch (err) {
        console.error("Socket.IO not initialized for message deletion", err);
      }

      res.json({ success: true });
    } catch (err) {
      console.error("MessageController.remove error:", err);
      res.status(403).json({ error: err.message });
    }
  },
};

module.exports = MessageController;
