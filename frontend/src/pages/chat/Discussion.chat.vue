<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useChatStore } from "../../stores/chat.store";
import { useAuthStore } from "../../stores/auth.store";
import { useAdminStore } from "../../stores/admin.store";
import socketService from "../../services/socket.service";

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();
const authStore = useAuthStore();
const adminStore = useAdminStore();

// États pour la navigation
const activeTab = ref("Tout");
const tabs = ["Tout", "Groupe", "Privé"];
const searchQuery = ref("");

// États pour la conversation
const selectedConversation = ref(null);
const messagesContainer = ref(null);
const messageInput = ref(null);
const fileInput = ref(null);

const messages = ref([]);
const loading = ref(false);
const newMessage = ref("");
const selectedFile = ref(null);
const editingMessage = ref(null);
const viewingImage = ref(null);
const socket = ref(null);
const optimisticMessages = ref(new Map());

// États pour la création de conversation
const showCreateModal = ref(false);
const newConversation = ref({
  type: "private",
  title: "",
  memberIds: [],
});

// Computed properties
const user = computed(() => authStore.user);
const conversations = computed(() => chatStore.conversations);
const sortedConversations = computed(() => chatStore.sortedConversations);

const availableUsers = computed(() => {
  if (!adminStore.users || !Array.isArray(adminStore.users)) {
    return [];
  }
  if (!authStore.user || !authStore.user.id_user) {
    return adminStore.users;
  }
  return adminStore.users.filter((user) => user.id_user !== authStore.user.id_user);
});

const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return availableUsers.value;
  }

  const query = searchQuery.value.toLowerCase();
  return availableUsers.value.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.role && user.role.toLowerCase().includes(query))
  );
});

const canCreateConversation = computed(() => {
  if (newConversation.value.type === "private") {
    return newConversation.value.memberIds.length === 1;
  } else {
    return newConversation.value.title && newConversation.value.memberIds.length >= 1;
  }
});

// Filtrage des conversations par onglet
const filteredConversations = computed(() => {
  if (activeTab.value === "Tout") {
    return sortedConversations.value;
  } else if (activeTab.value === "Groupe") {
    return sortedConversations.value.filter((conv) => conv.type === "group");
  } else if (activeTab.value === "Privé") {
    return sortedConversations.value.filter((conv) => conv.type === "private");
  }
  return sortedConversations.value;
});

// Charger les données initiales
onMounted(async () => {
  try {
    await chatStore.getConversations();
    await loadUser();
    if (authStore.token) {
      chatStore.initializeSocket(authStore.token);
    }
  } catch (err) {
    console.error("Erreur lors du chargement:", err);
  }
});

onUnmounted(() => {
  cleanupSocketListeners();
});

const loadUser = async () => {
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUserData();
    } catch (error) {
      console.error("Failed to fetch user data");
    }
  }
};

// Sélectionner une conversation
const selectConversation = async (conversation) => {
  selectedConversation.value = conversation;
  await loadMessages(conversation.id_conversation);
  setupSocketListeners(conversation.id_conversation);
};

const loadMessages = async (conversationId) => {
  try {
    loading.value = true;
    console.log("Chargement des messages pour la conversation:", conversationId);

    await chatStore.getMessages(conversationId);
    messages.value = chatStore.messages.map((msg) => ({ ...msg, status: "sent" }));

    console.log("Messages chargés:", messages.value.length);
  } catch (error) {
    console.error("Erreur lors du chargement des messages:", error);
  } finally {
    loading.value = false;
    scrollToBottom();
  }
};

const setupSocketListeners = (conversationId) => {
  // Utiliser le service Socket pour la connexion
  socket.value = socketService.connect(authStore.token);

  if (!socket.value) {
    console.error("Impossible de se connecter au serveur Socket.IO");
    return;
  }

  // Rejoindre la conversation
  socket.value.emit("joinConversation", conversationId);

  // Écouter les nouveaux messages
  socket.value.on("newMessage", handleNewMessage);
  socket.value.on("messageEdited", handleMessageEdited);
  socket.value.on("messageDeleted", handleMessageDeleted);
  socket.value.on("errorMessage", handleErrorMessage);
  socket.value.on("conversationRenamed", handleConversationRenamed);
  socket.value.on("conversationDeleted", handleConversationDeleted);

  console.log("Listeners Socket.IO configurés pour la conversation:", conversationId);
};

const cleanupSocketListeners = () => {
  if (socket.value) {
    if (selectedConversation.value) {
      socket.value.emit("leaveConversation", selectedConversation.value.id_conversation);
    }

    socket.value.off("newMessage", handleNewMessage);
    socket.value.off("messageEdited", handleMessageEdited);
    socket.value.off("messageDeleted", handleMessageDeleted);
    socket.value.off("errorMessage", handleErrorMessage);
    socket.value.off("conversationRenamed", handleConversationRenamed);
    socket.value.off("conversationDeleted", handleConversationDeleted);

    console.log("Listeners Socket.IO nettoyés");
  }
};

// Handlers pour les événements Socket.IO
const handleNewMessage = (message) => {
  if (
    selectedConversation.value &&
    message.conversation_id == selectedConversation.value.id_conversation
  ) {
    const tempId = optimisticMessages.value.get(message.content);
    let optimisticIndex = -1;

    if (tempId) {
      optimisticIndex = messages.value.findIndex((m) => m.id_message === tempId);
      optimisticMessages.value.delete(message.content);
    }

    if (optimisticIndex !== -1) {
      messages.value[optimisticIndex] = { ...message, status: "sent" };
    } else {
      const messageExists = messages.value.some(
        (m) => m.id_message === message.id_message
      );
      if (!messageExists) {
        messages.value.push({ ...message, status: "sent" });
      }
    }

    scrollToBottom();
  }
};

const handleMessageEdited = (updatedMessage) => {
  if (
    selectedConversation.value &&
    updatedMessage.conversation_id == selectedConversation.value.id_conversation
  ) {
    const index = messages.value.findIndex(
      (m) => m.id_message === updatedMessage.id_message
    );
    if (index !== -1) {
      messages.value[index] = { ...updatedMessage, status: "sent" };
    }
  }
};

const handleMessageDeleted = ({ id_message }) => {
  console.log("Message supprimé:", id_message);
  messages.value = messages.value.filter((m) => m.id_message !== id_message);
};

const handleErrorMessage = (errorData) => {
  console.error("Erreur Socket.IO:", errorData);
  chatStore.error = errorData.message || "Erreur lors de l'opération de messagerie";
};

const handleConversationRenamed = (data) => {
  console.log("Conversation renommée:", data);
  if (
    selectedConversation.value &&
    data.conversationId == selectedConversation.value.id_conversation
  ) {
    selectedConversation.value.title = data.title;
  }
};

const handleConversationDeleted = (data) => {
  console.log("Conversation supprimée:", data);
  if (
    selectedConversation.value &&
    data.conversationId == selectedConversation.value.id_conversation
  ) {
    alert("Cette conversation a été supprimée");
    selectedConversation.value = null;
    messages.value = [];
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const isOwnMessage = (message) => {
  return message.sender_id === authStore.user?.id_user;
};

const getMessageClasses = (message) => {
  return {
    "bg-blue-500 text-white": isOwnMessage(message) && message.status !== "failed",
    "bg-gray-400 text-gray-500": isOwnMessage(message) && message.status === "failed",
    "bg-white border border-gray-200": !isOwnMessage(message),
    "opacity-80": message.status === "sending",
  };
};

const isImageFile = (filename) => {
  if (!filename) return false;
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  const isUrl = typeof filename === "string" && filename.startsWith("http");
  const isBlob = typeof filename === "string" && filename.startsWith("blob:");

  if (isUrl || isBlob) {
    return true;
  }

  return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
};

const getFileType = (filename) => {
  if (!filename) return "Fichier";
  const extension = filename.split(".").pop().toLowerCase();
  const typeMap = {
    pdf: "PDF",
    doc: "Word",
    docx: "Word",
    xls: "Excel",
    xlsx: "Excel",
    ppt: "PowerPoint",
    pptx: "PowerPoint",
  };
  return typeMap[extension] || extension.toUpperCase();
};

const formatFileSize = (bytes) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getConversationInitials = (convo) => {
  if (!convo) return "??";
  if (convo.display_name) {
    return convo.display_name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }
  return "DM";
};

const getConversationName = (convo) => {
  if (!convo) return "Conversation";
  if (convo.title) return convo.title;
  if (convo.display_name) return convo.display_name;
  return "Conversation sans nom";
};

const getUserInitials = (user) => {
  if (user.name) {
    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }
  return user.email.substring(0, 2).toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (days === 1) {
    return "Hier";
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString();
  }
};

const handleFileSelect = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    selectedFile.value = files[0];
  }
};

const removeSelectedFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const adjustTextareaHeight = () => {
  const textarea = messageInput.value;
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  }
};

const sendMessage = async () => {
  if (!selectedConversation.value) return;

  if (!newMessage.value.trim() && !selectedFile.value) {
    return;
  }

  try {
    if (editingMessage.value) {
      console.log("Editing message:", editingMessage.value.id_message);

      if (socket.value) {
        socket.value.emit("editMessage", {
          messageId: editingMessage.value.id_message,
          senderId: authStore.user.id_user,
          content: newMessage.value.trim(),
          conversationId: selectedConversation.value.id_conversation,
        });
      } else {
        await chatStore.editMessage(
          editingMessage.value.id_message,
          newMessage.value.trim()
        );
      }

      editingMessage.value = null;
    } else {
      const messageContent = newMessage.value.trim();
      const tempMessageId = "temp-" + Date.now();

      // Créer un message optimiste
      const optimisticMessage = {
        id_message: tempMessageId,
        content: messageContent,
        conversation_id: parseInt(selectedConversation.value.id_conversation),
        sender_id: authStore.user.id_user,
        sender_name: authStore.user.name || authStore.user.email,
        created_at: new Date().toISOString(),
        status: "sending",
      };

      // Gérer la prévisualisation du fichier
      if (selectedFile.value) {
        if (selectedFile.value.type.startsWith("image/")) {
          optimisticMessage.file = URL.createObjectURL(selectedFile.value);
        }
        optimisticMessage.file_name = selectedFile.value.name;
      }

      // Ajouter à la liste
      messages.value.push(optimisticMessage);
      optimisticMessages.value.set(messageContent, tempMessageId);
      scrollToBottom();

      // Envoi du message
      if (selectedFile.value) {
        const formData = new FormData();
        formData.append("conversationId", selectedConversation.value.id_conversation);
        formData.append("content", messageContent);
        formData.append("file", selectedFile.value);

        try {
          await chatStore.sendMessage(formData);
        } catch (error) {
          console.error("File upload error:", error);
          const index = messages.value.findIndex((m) => m.id_message === tempMessageId);
          if (index !== -1) {
            messages.value[index].status = "failed";
            optimisticMessages.value.delete(messageContent);
          }
        }
      } else {
        const messageData = {
          conversationId: selectedConversation.value.id_conversation,
          content: messageContent,
          senderId: authStore.user.id_user,
        };

        if (socket.value) {
          socket.value.emit("sendMessage", messageData);
        } else {
          console.error("Socket not available");
          throw new Error("Socket not connected");
        }
      }

      // Timeout pour détecter les échecs
      if (!selectedFile.value) {
        setTimeout(() => {
          const index = messages.value.findIndex((m) => m.id_message === tempMessageId);
          if (index !== -1 && messages.value[index].status === "sending") {
            messages.value[index].status = "failed";
            optimisticMessages.value.delete(messageContent);
          }
        }, 10000);
      }
    }

    // Nettoyer le formulaire
    newMessage.value = "";
    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = "";
    adjustTextareaHeight();
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    const failedIndex = messages.value.findIndex((m) => m.status === "sending");
    if (failedIndex !== -1) {
      messages.value[failedIndex].status = "failed";
    }
  }
};

const retryMessage = async (message) => {
  try {
    const index = messages.value.findIndex((m) => m.id_message === message.id_message);
    if (index !== -1) {
      messages.value[index].status = "sending";

      if (message.file_name || message.file_path) {
        const formData = new FormData();
        formData.append("conversationId", selectedConversation.value.id_conversation);
        formData.append("content", message.content);

        await chatStore.sendMessage(formData);
      } else {
        if (socket.value) {
          socket.value.emit("sendMessage", {
            conversationId: selectedConversation.value.id_conversation,
            content: message.content,
            senderId: authStore.user.id_user,
          });

          setTimeout(() => {
            if (messages.value[index]?.status === "sending") {
              messages.value[index].status = "failed";
            }
          }, 10000);
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors de la réessai:", error);
  }
};

const editMessage = (message) => {
  if (message.status === "sending") return;

  editingMessage.value = message;
  newMessage.value = message.content;
  messageInput.value.focus();
};

const cancelEdit = () => {
  editingMessage.value = null;
  newMessage.value = "";
};

const deleteMessage = async (messageId) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
    try {
      const messageToDelete = messages.value.find((m) => m.id_message === messageId);
      if (socket.value && messageToDelete) {
        socket.value.emit("deleteMessage", {
          messageId: messageId,
          senderId: authStore.user.id_user,
          conversationId: selectedConversation.value.id_conversation,
        });
      } else {
        await chatStore.deleteMessage(messageId);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du message:", error);
    }
  }
};

const openFile = (filePath) => {
  if (isImageFile(filePath)) {
    viewingImage.value = filePath;
  } else {
    window.open(filePath, "_blank");
  }
};

const downloadFile = (filePath, fileName) => {
  const link = document.createElement("a");
  link.href = filePath;
  link.download = fileName || "download";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Méthodes pour la création de conversation
const isUserSelected = (userId) => {
  return newConversation.value.memberIds.includes(userId);
};

const toggleUserSelection = (userId) => {
  if (newConversation.value.type === "private") {
    newConversation.value.memberIds = [userId];
  } else {
    const index = newConversation.value.memberIds.indexOf(userId);
    if (index === -1) {
      newConversation.value.memberIds.push(userId);
    } else {
      newConversation.value.memberIds.splice(index, 1);
    }
  }
};

const openCreateModal = async () => {
  showCreateModal.value = true;
  await adminStore.fetchUsers();
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  resetNewConversation();
};

const resetNewConversation = () => {
  newConversation.value = {
    type: "private",
    title: "",
    memberIds: [],
  };
  searchQuery.value = "";
};

const createNewConversation = async () => {
  try {
    const result = await chatStore.createConversation({
      title: newConversation.value.title,
      type: newConversation.value.type,
      memberIds: newConversation.value.memberIds,
    });

    if (result && result.id_conversation) {
      // Recharger la liste des conversations
      await chatStore.getConversations();
      // Sélectionner la nouvelle conversation
      const newConv = conversations.value.find(
        (c) => c.id_conversation === result.id_conversation
      );
      if (newConv) {
        await selectConversation(newConv);
      }
    }

    closeCreateModal();
  } catch (error) {
    console.error("Erreur lors de la création:", error);
  }
};

// Watch for messages from store
watch(
  () => chatStore.messages,
  (newMessages) => {
    const sentMessages = newMessages.map((msg) => ({ ...msg, status: "sent" }));
    const optimisticMessages = messages.value.filter(
      (m) => m.status === "sending" || m.status === "failed"
    );

    messages.value = [...optimisticMessages, ...sentMessages];
    scrollToBottom();
  }
);

// Auto-resize textarea
watch(newMessage, adjustTextareaHeight);
</script>

<template>
  <div class="h-screen flex bg-gray-50">
    <!-- Sidebar des conversations -->
    <div class="w-80 border-r border-gray-200 bg-white flex flex-col">
      <!-- En-tête avec barre de recherche -->
      <div class="p-4 border-b border-gray-200">
        <h1 class="text-xl font-bold text-gray-800 mb-4">Discussions</h1>

        <!-- Barre de recherche -->
        <div class="relative mb-4">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Onglets de filtrage -->
        <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'flex-1 py-2 text-sm font-medium rounded-md transition',
              activeTab === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Liste des conversations -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="chatStore.loading" class="flex justify-center items-center h-32">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <div v-else-if="filteredConversations.length === 0" class="text-center py-12">
          <svg
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p class="text-gray-600 mb-4">Aucune conversation pour le moment</p>
          <button
            @click="openCreateModal"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Commencer une conversation
          </button>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="conversation in filteredConversations"
            :key="conversation.id_conversation"
            @click="selectConversation(conversation)"
            class="p-4 cursor-pointer hover:bg-gray-50 transition"
            :class="{
              'bg-blue-50':
                selectedConversation?.id_conversation === conversation.id_conversation,
            }"
          >
            <div class="flex items-center space-x-3">
              <!-- Avatar -->
              <div class="relative">
                <div
                  class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <span class="text-blue-600 font-semibold">
                    {{ getConversationInitials(conversation) }}
                  </span>
                </div>
                <div
                  class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                ></div>
              </div>

              <!-- Informations de la conversation -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <h3 class="font-medium text-gray-900 truncate">
                    {{ conversation.title || getConversationName(conversation) }}
                  </h3>
                  <span class="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {{
                      formatDate(conversation.last_message_at || conversation.created_at)
                    }}
                  </span>
                </div>

                <p
                  v-if="conversation.last_message"
                  class="text-sm text-gray-600 truncate mt-1"
                >
                  {{ conversation.last_message }}
                </p>
                <p v-else class="text-sm text-gray-400 italic mt-1">Aucun message</p>

                <div class="flex items-center mt-1">
                  <span class="text-xs text-gray-500">
                    {{ conversation.type === "private" ? "Privé" : "Groupe" }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bouton de création de conversation -->
      <div class="p-4 border-t border-gray-200">
        <button
          @click="openCreateModal"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nouvelle conversation
        </button>
      </div>
    </div>

    <!-- Zone de chat principale -->
    <div class="flex-1 flex flex-col" v-if="selectedConversation">
      <!-- Header de la conversation -->
      <div
        class="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
          >
            <span class="text-blue-600 font-semibold">
              {{ getConversationInitials(selectedConversation) }}
            </span>
          </div>
          <div>
            <h2 class="font-semibold text-gray-900">
              {{
                selectedConversation.title || getConversationName(selectedConversation)
              }}
            </h2>
            <p class="text-sm text-gray-500">En ligne</p>
          </div>
        </div>
      </div>

      <!-- Zone des messages -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
      >
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center h-32">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <!-- Messages -->
        <div v-else>
          <div
            v-for="message in messages"
            :key="message.id_message"
            class="flex"
            :class="{ 'justify-end': isOwnMessage(message) }"
          >
            <div class="relative group max-w-xs lg:max-w-md xl:max-w-lg">
              <div class="rounded-lg px-4 py-2" :class="getMessageClasses(message)">
                <!-- Contenu du message -->
                <p class="break-words">{{ message.content }}</p>

                <!-- Indicateur d'envoi en cours -->
                <div
                  v-if="message.status === 'sending'"
                  class="flex items-center mt-2 text-blue-100 text-xs"
                >
                  <div
                    class="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"
                  ></div>
                  Envoi en cours...
                </div>

                <!-- Indicateur d'échec -->
                <div
                  v-if="message.status === 'failed'"
                  class="flex items-center mt-2 text-white text-xs"
                >
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Échec de l'envoi
                  <button @click="retryMessage(message)" class="ml-2 underline">
                    Réessayer
                  </button>
                </div>

                <!-- Fichier joint -->
                <div v-if="message.file_path || message.file" class="mt-2">
                  <div
                    v-if="isImageFile(message.file_path || message.file)"
                    class="rounded-lg overflow-hidden"
                  >
                    <img
                      :src="message.file_path || message.file"
                      :alt="message.file_name || 'Fichier joint'"
                      class="max-w-full h-auto max-h-48 object-cover cursor-pointer"
                      @click="openFile(message.file_path || message.file)"
                    />
                  </div>
                  <div
                    v-else
                    class="flex items-center p-3 bg-white bg-opacity-20 rounded-lg"
                  >
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium truncate">
                        {{ message.file_name || "Fichier joint" }}
                      </p>
                      <p class="text-xs opacity-90">
                        {{ getFileType(message.file_name) }}
                      </p>
                    </div>
                    <div class="flex space-x-2 ml-3">
                      <button
                        @click="openFile(message.file_path || message.file)"
                        class="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="
                          downloadFile(
                            message.file_path || message.file,
                            message.file_name
                          )
                        "
                        class="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Timestamp -->
                <div
                  class="flex items-center justify-end mt-1 text-xs"
                  :class="{
                    'text-blue-100': isOwnMessage(message) && message.status !== 'failed',
                    'text-gray-400': !isOwnMessage(message),
                    'text-gray-500': message.status === 'failed',
                  }"
                >
                  <span>{{ formatTime(message.created_at) }}</span>
                  <span
                    v-if="isOwnMessage(message) && message.status === 'sent'"
                    class="ml-1"
                  >
                    ✓
                  </span>
                </div>
              </div>

              <!-- Menu d'actions pour les messages -->
              <div
                v-if="
                  isOwnMessage(message) &&
                  message.status !== 'sending' &&
                  message.status !== 'failed'
                "
                class="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-lg rounded-lg border border-gray-200 p-1"
              >
                <button
                  @click="editMessage(message)"
                  class="flex items-center px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md w-full"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Modifier
                </button>
                <button
                  @click="deleteMessage(message.id_message)"
                  class="flex items-center px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md w-full"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Zone de saisie de message -->
      <div class="bg-white border-t border-gray-200 p-6">
        <!-- Message en cours d'édition -->
        <div
          v-if="editingMessage"
          class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-yellow-800 font-medium">
              Modification du message
            </span>
            <button @click="cancelEdit" class="text-yellow-600 hover:text-yellow-800">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Fichier sélectionné -->
        <div
          v-if="selectedFile"
          class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3"
        >
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <svg
                class="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <p class="text-sm font-medium text-blue-900">
                  {{ selectedFile.name }}
                </p>
                <p class="text-xs text-blue-700">
                  {{ formatFileSize(selectedFile.size) }}
                </p>
              </div>
            </div>
            <button @click="removeSelectedFile" class="text-blue-600 hover:text-blue-800">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Formulaire de saisie -->
        <div class="flex space-x-3">
          <!-- Bouton pour joindre un fichier -->
          <div class="flex items-center">
            <input
              ref="fileInput"
              type="file"
              @change="handleFileSelect"
              class="hidden"
              accept="*/*"
            />
            <button
              @click="$refs.fileInput.click()"
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
          </div>

          <!-- Zone de texte -->
          <div class="flex-1 relative">
            <textarea
              ref="messageInput"
              v-model="newMessage"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.enter.shift.exact.prevent="newMessage += '\n'"
              placeholder="Tapez votre message..."
              rows="1"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style="min-height: 48px; max-height: 120px"
            ></textarea>
          </div>

          <!-- Bouton d'envoi -->
          <div class="flex items-center">
            <button
              @click="sendMessage"
              :disabled="(!newMessage.trim() && !selectedFile) || loading"
              class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-lg transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue quand aucune conversation n'est sélectionnée -->
    <div v-else class="flex-1 flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <svg
          class="w-24 h-24 text-gray-400 mx-auto mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          Bienvenue dans la messagerie
        </h3>
        <p class="text-gray-600 mb-6 max-w-md">
          Sélectionnez une conversation existante ou créez-en une nouvelle pour commencer
          à discuter.
        </p>
        <button
          @click="openCreateModal"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          Créer une conversation
        </button>
      </div>
    </div>

    <!-- Modal de création de conversation -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeCreateModal"
    >
      <div class="bg-white rounded-lg w-full max-w-md mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Nouvelle conversation</h3>

          <!-- Type de conversation -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Type de conversation
            </label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="newConversation.type"
                  value="private"
                  class="mr-2"
                />
                <span>Privé</span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="newConversation.type"
                  value="group"
                  class="mr-2"
                />
                <span>Groupe</span>
              </label>
            </div>
          </div>

          <!-- Titre (pour les groupes) -->
          <div v-if="newConversation.type === 'group'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nom du groupe
            </label>
            <input
              v-model="newConversation.title"
              type="text"
              placeholder="Entrez le nom du groupe..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Recherche d'utilisateurs -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{
                newConversation.type === "private"
                  ? "Sélectionner un utilisateur"
                  : "Ajouter des membres"
              }}
            </label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un utilisateur..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            />

            <!-- Liste des utilisateurs -->
            <div class="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
              <div
                v-for="user in filteredUsers"
                :key="user.id_user"
                @click="toggleUserSelection(user.id_user)"
                class="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                :class="{
                  'bg-blue-50': isUserSelected(user.id_user),
                }"
              >
                <div
                  class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3"
                >
                  <span class="text-blue-600 text-sm font-medium">
                    {{ getUserInitials(user) }}
                  </span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">
                    {{ user.name || user.email }}
                  </p>
                  <p class="text-xs text-gray-500">{{ user.role }}</p>
                </div>
                <div
                  v-if="isUserSelected(user.id_user)"
                  class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <div
                v-if="filteredUsers.length === 0"
                class="p-4 text-center text-gray-500"
              >
                Aucun utilisateur trouvé
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3">
            <button
              @click="closeCreateModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Annuler
            </button>
            <button
              @click="createNewConversation"
              :disabled="!canCreateConversation"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md"
            >
              Créer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue pour les images en plein écran -->
    <div
      v-if="viewingImage"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      @click="viewingImage = null"
    >
      <div class="relative max-w-4xl max-h-full">
        <img
          :src="viewingImage"
          alt="Image en plein écran"
          class="max-w-full max-h-full object-contain"
        />
        <button
          @click="viewingImage = null"
          class="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles personnalisés */
.chat-container {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animation pour les nouveaux messages */
.message-enter-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsive design */
@media (max-width: 768px) {
  .conversation-list {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    background: white;
  }
}

/* Amélioration de l'accessibilité */
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

input:focus,
textarea:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 0;
}
</style>
