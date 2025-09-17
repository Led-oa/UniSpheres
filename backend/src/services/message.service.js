const MessageModel = require("../models/message.model");
const FilePathToUrl = require("../utils/urlCleaner.utils");

const MessageService = {
  // Créer/envoyer un message
  async create({ conversationId, senderId, content }) {
    try {
      return await MessageModel.create({ conversationId, senderId, content });
    } catch (err) {
      console.error("MessageService.create error:", err);
      throw new Error("MESSAGE_CREATE_FAILED");
    }
  },

  // Modifier un message
  async update({ messageId, senderId, content }) {
    try {
      const updated = await MessageModel.update({
        messageId,
        senderId,
        content,
      });
      if (!updated) throw new Error("MESSAGE_UPDATE_FORBIDDEN");
      return updated;
    } catch (err) {
      console.error("MessageService.update error:", err);
      throw new Error(err.message || "MESSAGE_UPDATE_FAILED");
    }
  },

  // Récupérer tous les messages d'une conversation
  async getByConversation(conversationId, userId) {
    try {
      console.log("Convo id : ", conversationId);
      console.log("User id : ", userId);
      const data = await MessageModel.getByConversation(conversationId, userId);
      // console.log("[Service Messages ] get message by convo : ", data);
      console.log(
        "[Service Messages ] get message by convo length: ",
        data.length
      );

      // Transformer les chemins de fichier en URLs
      const cleanedData = data.map((item) => {
        if (item.profile_pic) {
          item.profile_pic = FilePathToUrl.urlCleaner(item.profile_pic);
        }
        if (item.file_path) {
          item.file_path = FilePathToUrl.urlCleaner(item.file_path);
        }
        return item;
      });

      return cleanedData;
    } catch (err) {
      console.error("MessageService.getByConversation error:", err);
      throw new Error(err.message || "MESSAGE_FETCH_FAILED");
    }
  },

  // Supprimer un message
  async remove({ messageId, senderId }) {
    try {
      const ok = await MessageModel.delete({ messageId, senderId });
      if (!ok) throw new Error("MESSAGE_DELETE_FORBIDDEN");
      return true;
    } catch (err) {
      console.error("MessageService.remove error:", err);
      throw new Error(err.message || "MESSAGE_DELETE_FAILED");
    }
  },
};

module.exports = MessageService;
