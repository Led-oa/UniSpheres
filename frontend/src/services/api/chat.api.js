import api from "../Connect.backend";

export const ChatService = {
  // Conversations
  async getConversations() {
    const response = await api.get("/conversations");
    return response.data;
  },

  async createConversation(data) {
    const response = await api.post("/conversations", data);
    return response.data;
  },

  async renameConversation(conversationId, title) {
    const response = await api.patch(`/conversations/${conversationId}`, {
      title,
    });
    return response.data;
  },

  async addMember(conversationId, memberId) {
    const response = await api.post(
      `/conversations/${conversationId}/members`,
      { memberId }
    );
    return response.data;
  },

  async removeMember(conversationId, memberId) {
    const response = await api.delete(
      `/conversations/${conversationId}/members/${memberId}`
    );
    return response.data;
  },

  async leaveConversation(conversationId) {
    const response = await api.patch(`/conversations/${conversationId}/leave`);
    return response.data;
  },

  // Messages
  async getMessages(conversationId) {
    const response = await api.get(`/messages/conversation/${conversationId}`);
    return response.data;
  },

  async sendMessage(data) {
    const formData = new FormData();
    formData.append("conversationId", data.conversationId);
    formData.append("content", data.content);

    if (data.file) {
      formData.append("file", data.file);
    }

    const response = await api.post("/messages", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async editMessage(messageId, content) {
    const response = await api.patch(`/messages/${messageId}`, { content });
    return response.data;
  },

  async deleteMessage(messageId) {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  },
};
