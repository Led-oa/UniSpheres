// File: src/services/api/chat.api.js
import api from "../Connect.backend"; // ton instance axios configurée

export const ChatServices = {
  // --- Conversations ---
  async getConversations() {
    try {
      const response = await api.get("/conversations");
      return response.data.conversations;
    } catch (err) {
      console.error("ChatServices.getConversations error:", err);
      throw err;
    }
  },

  async createConversation({ title, type, memberIds }) {
    try {
      const response = await api.post("/conversations", {
        title,
        type,
        memberIds,
      });
      return response.data;
    } catch (err) {
      console.error("ChatServices.createConversation error:", err);
      throw err;
    }
  },

  async renameConversation(conversationId, title) {
    try {
      const response = await api.patch(`/conversations/${conversationId}`, {
        title,
      });
      return response.data;
    } catch (err) {
      console.error("ChatServices.renameConversation error:", err);
      throw err;
    }
  },

  async addMember(conversationId, memberId) {
    try {
      const response = await api.post(
        `/conversations/${conversationId}/members`,
        { memberId }
      );
      return response.data;
    } catch (err) {
      console.error("ChatServices.addMember error:", err);
      throw err;
    }
  },

  async removeMember(conversationId, memberId) {
    try {
      const response = await api.delete(
        `/conversations/${conversationId}/members/${memberId}`
      );
      return response.data;
    } catch (err) {
      console.error("ChatServices.removeMember error:", err);
      throw err;
    }
  },

  async leaveConversation(conversationId) {
    try {
      const response = await api.patch(
        `/conversations/${conversationId}/leave`
      );
      return response.data;
    } catch (err) {
      console.error("ChatServices.leaveConversation error:", err);
      throw err;
    }
  },

  // --- Messages ---
  async getMessages(conversationId) {
    try {
      const response = await api.get(`/messages/${conversationId}`);
      return response.data;
    } catch (err) {
      console.error("ChatServices.getMessages error:", err);
      throw err;
    }
  },

  async sendMessage({ conversationId, content, file = null }) {
    try {
      const formData = new FormData();
      formData.append("conversationId", conversationId);
      formData.append("content", content);
      if (file) formData.append("file", file);

      const response = await api.post("/messages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (err) {
      console.error("ChatServices.sendMessage error:", err);
      throw err;
    }
  },

  async editMessage({ messageId, content, conversationId }) {
    try {
      const response = await api.patch(`/messages/${messageId}`, {
        content,
        conversationId,
      });
      return response.data;
    } catch (err) {
      console.error("ChatServices.editMessage error:", err);
      throw err;
    }
  },

  async deleteMessage({ messageId, conversationId }) {
    try {
      const response = await api.delete(`/messages/${messageId}`, {
        params: { conversationId },
      });
      return response.data;
    } catch (err) {
      console.error("ChatServices.deleteMessage error:", err);
      throw err;
    }
  },
};
