const ConversationModel = require("../models/conversation.model");

const ConversationService = {
  async listForUser(userId) {
    try {
      const data = await ConversationModel.getUserConversations(userId);

      console.log("[Service convo list] data : ", data);

      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async create({ creatorId, title, type, memberIds }) {
    if (type === "private" && memberIds.length === 1) {
      const existing = await ConversationModel.privateConversationExists(
        creatorId,
        memberIds[0]
      );
      if (existing) {
        return { duplicateId: existing };
      }
    }

    console.log("Controller Conversation create title: ", title);
    console.log("Controller Conversation create type: ", type);
    console.log("Controller Conversation create type: ", creatorId);
    console.log("Controller Conversation create type: ", memberIds);

    const id = await ConversationModel.createConversation(title, type);
    await ConversationModel.addMember(id, creatorId);
    await ConversationModel.addMembersBulk(id, memberIds);
    return id;
  },

  async rename({ conversationId, userId, title }) {
    const allowed = await ConversationModel.isMember(conversationId, userId);
    if (!allowed) throw new Error("FORBIDDEN");
    await ConversationModel.renameConversation(conversationId, title);
  },

  async addMember({ conversationId, requesterId, memberId }) {
    const allowed = await ConversationModel.isMember(
      conversationId,
      requesterId
    );
    if (!allowed) throw new Error("FORBIDDEN");
    const exists = await ConversationModel.isMember(conversationId, memberId);
    if (exists) throw new Error("ALREADY_MEMBER");
    await ConversationModel.addMember(conversationId, memberId);
  },

  async removeMember({ conversationId, requesterId, memberId }) {
    const allowed = await ConversationModel.isMember(
      conversationId,
      requesterId
    );
    if (!allowed) throw new Error("FORBIDDEN");
    await ConversationModel.removeMember(conversationId, memberId);
  },

  async leave({ conversationId, userId }) {
    await ConversationModel.removeMember(conversationId, userId);
  },
};

module.exports = ConversationService;
