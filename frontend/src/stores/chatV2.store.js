// File: src/stores/chat.store.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { io } from "socket.io-client";
import { ChatServices } from "../services/api/chat.api";
import { useUserStore } from "./user.store";

export const useChatStore = defineStore("chat", () => {
  const conversations = ref([]);
  const messages = ref({});
  const currentConversation = ref(null);
  const socket = ref(null);

  const userStore = useUserStore();

  // --- SOCKET.IO ---
  const initSocket = () => {
    if (!userStore.currentUser?.id_user) {
      console.error("User not logged in. Cannot init socket.");
      return;
    }

    socket.value = io("http://localhost:8000", {
      auth: { token },
      withCredentials: true,
    });

    socket.value.on("connect", () => {
      console.log("Socket connected:", socket.value.id);
      socket.value.emit("joinUserRoom", userStore.currentUser.id_user);
    });

    socket.value.on("conversationCreated", (conversation) => {
      conversations.value.push(conversation);
    });

    socket.value.on("newMessage", (message) => {
      if (!messages.value[message.conversationId]) {
        messages.value[message.conversationId] = [];
      }
      messages.value[message.conversationId].push(message);
    });

    socket.value.on("messageEdited", (updated) => {
      const msgs = messages.value[updated.conversationId] || [];
      const index = msgs.findIndex((m) => m.id_message === updated.id_message);
      if (index !== -1) msgs[index] = updated;
    });

    socket.value.on("messageDeleted", ({ id_message, conversationId }) => {
      const msgs = messages.value[conversationId] || [];
      messages.value[conversationId] = msgs.filter(
        (m) => m.id_message !== id_message
      );
    });
  };

  // --- CONVERSATIONS ---
  const fetchConversations = async () => {
    conversations.value = await ChatServices.getConversations();
  };

  const createConversation = async (payload) => {
    const convo = await ChatServices.createConversation(payload);
    conversations.value.push(convo);
    return convo;
  };

  const selectConversation = async (conversationId) => {
    currentConversation.value = conversationId;
    await fetchMessages(conversationId);
    socket.value.emit("joinConversation", conversationId);
  };

  // --- MESSAGES ---
  const fetchMessages = async (conversationId) => {
    messages.value[conversationId] = await ChatServices.getMessages(
      conversationId
    );
  };

  const sendMessage = async (content, file = null) => {
    if (!currentConversation.value) return;
    await ChatServices.sendMessage({
      conversationId: currentConversation.value,
      content,
      file,
    });
    // Le socket émettra l'événement newMessage automatiquement
  };

  const editMessage = async (messageId, content) => {
    if (!currentConversation.value) return;
    await ChatServices.editMessage({
      messageId,
      content,
      conversationId: currentConversation.value,
    });
  };

  const deleteMessage = async (messageId) => {
    if (!currentConversation.value) return;
    await ChatServices.deleteMessage({
      messageId,
      conversationId: currentConversation.value,
    });
  };

  return {
    conversations,
    messages,
    currentConversation,
    socket,
    initSocket,
    fetchConversations,
    createConversation,
    selectConversation,
    fetchMessages,
    sendMessage,
    editMessage,
    deleteMessage,
  };
});
