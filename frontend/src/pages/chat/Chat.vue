<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useChatStore } from "../../stores/chat.store";
import { useAuthStore } from "../../stores/auth.store";
import socketService from "../../services/socket.service";

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();
const authStore = useAuthStore();

const conversationId = route.params.id;
const messagesContainer = ref(null);
const messageInput = ref(null);
const fileInput = ref(null);

const conversation = ref(null);
const messages = ref([]);
const loading = ref(true);
const newMessage = ref("");
const selectedFile = ref(null);
const editingMessage = ref(null);
const viewingImage = ref(null);
const socket = ref(null);
const optimisticMessages = ref(new Map());

// Charger la conversation et les messages
onMounted(async () => {
  await loadConversation();
  await loadMessages();
  setupSocketListeners();
  scrollToBottom();
});

onUnmounted(() => {
  cleanupSocketListeners();
});

const loadConversation = async () => {
  try {
    console.log("Chargement de la conversation:", conversationId);

    conversation.value = await chatStore.getConversationById(conversationId);

    console.log("Conversation trouvée:", conversation.value);
  } catch (error) {
    console.error("Erreur lors du chargement de la conversation:", error);
    conversation.value = createFallbackConversation();
  }
};

const createFallbackConversation = () => {
  let fallbackConvo = {
    id_conversation: parseInt(conversationId),
    title: `Conversation ${conversationId}`,
    type: "private",
    member_count: 2,
    created_at: new Date().toISOString(),
  };

  if (chatStore.messages.length > 0) {
    const firstMessage = chatStore.messages[0];
    fallbackConvo.created_at = firstMessage.created_at;
    fallbackConvo.last_message_at = firstMessage.created_at;

    if (firstMessage.sender_name && !isOwnMessage(firstMessage)) {
      fallbackConvo.title = firstMessage.sender_name;
      fallbackConvo.other_user_name = firstMessage.sender_name;
    }
  }

  return fallbackConvo;
};

const loadMessages = async () => {
  try {
    loading.value = true;
    console.log("Chargement des messages pour la conversation:", conversationId);

    // Utiliser la méthode existante du store
    await chatStore.getMessages(conversationId);

    // messages.value = chatStore.messages;

    messages.value = chatStore.messages.map((msg) => ({ ...msg, status: "sent" }));

    console.log("Messages chargés:", messages.value.length);
  } catch (error) {
    console.error("Erreur lors du chargement des messages:", error);
  } finally {
    loading.value = false;
    scrollToBottom();
  }
};

const setupSocketListeners = () => {
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
    // Quitter la room de la conversation
    socket.value.emit("leaveConversation", conversationId);

    // Retirer tous les listeners spécifiques à Chat.vue
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
// const handleNewMessage = (message) => {
//   console.log("Nouveau message reçu:", message);
//   if (message.conversation_id == conversationId) {
//     // Vérifier si le message existe déjà pour éviter les doublons
//     const messageExists = messages.value.some((m) => m.id_message === message.id_message);
//     if (!messageExists) {
//       messages.value.push(message);
//       scrollToBottom();
//     }
//   }
// };

const handleNewMessage = (message) => {
  if (message.conversation_id == conversationId) {
    // Vérifier si c'est un message optimiste à remplacer
    const tempId = optimisticMessages.value.get(message.content);
    let optimisticIndex = -1;

    if (tempId) {
      optimisticIndex = messages.value.findIndex((m) => m.id_message === tempId);
      optimisticMessages.value.delete(message.content);
    }

    if (optimisticIndex !== -1) {
      // Remplacer le message optimiste
      messages.value[optimisticIndex] = { ...message, status: "sent" };
    } else {
      // Vérifier si le message existe déjà
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

// const handleMessageEdited = (updatedMessage) => {
//   console.log("Message modifié:", updatedMessage);
//   if (updatedMessage.conversation_id == conversationId) {
//     const index = messages.value.findIndex(
//       (m) => m.id_message === updatedMessage.id_message
//     );
//     if (index !== -1) {
//       messages.value[index] = updatedMessage;
//     }
//   }
// };
const handleMessageEdited = (updatedMessage) => {
  if (updatedMessage.conversation_id == conversationId) {
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
  if (data.conversationId == conversationId && conversation.value) {
    conversation.value.title = data.title;
  }
};

const handleConversationDeleted = (data) => {
  console.log("Conversation supprimée:", data);
  if (data.conversationId == conversationId) {
    // Rediriger l'utilisateur si la conversation actuelle est supprimée
    alert("Cette conversation a été supprimée");
    router.push("/messageries");
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
    "bg-blue-500 text-gray-800": isOwnMessage(message) && message.status !== "failed",
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
    return true; // Supposer que c'est une image pour les prévisualisations
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

const showConversationSettings = () => {
  // router.push(`/chat/${conversationId}/settings`);
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
  console.log("sendMessage called");
  console.log("newMessage:", newMessage.value);
  console.log("selectedFile:", selectedFile.value);
  console.log("editingMessage:", editingMessage.value);

  if (!newMessage.value.trim() && !selectedFile.value) {
    console.log("Message vide et pas de fichier - abandon");
    return;
  }

  try {
    if (editingMessage.value) {
      // console.log("Editing message:", editingMessage.value.id_message);
      // // Modification de message existant
      // await chatStore.editMessage(
      //   editingMessage.value.id_message,
      //   newMessage.value.trim()
      // );
      // editingMessage.value = null;
      console.log("Editing message:", editingMessage.value.id_message);

      // Utiliser Socket.IO pour la modification
      if (socket.value) {
        socket.value.emit("editMessage", {
          messageId: editingMessage.value.id_message,
          senderId: authStore.user.id_user,
          content: newMessage.value.trim(),
          conversationId: conversationId,
        });
      } else {
        // Fallback vers REST API
        await chatStore.editMessage(
          editingMessage.value.id_message,
          newMessage.value.trim()
        );
      }

      editingMessage.value = null;
    } else {
      // Nouveau message avec UI optimiste
      console.log("Creating new message");

      const messageContent = newMessage.value.trim();
      const tempMessageId = "temp-" + Date.now();

      console.log("Creating optimistic message with temp ID:", tempMessageId);

      // Créer un message optimiste
      const optimisticMessage = {
        id_message: tempMessageId,
        content: messageContent,
        conversation_id: parseInt(conversationId),
        sender_id: authStore.user.id_user,
        sender_name: authStore.user.name || authStore.user.email,
        created_at: new Date().toISOString(),
        status: "sending",
      };

      console.log("Sending new message : ", optimisticMessage);

      // Gérer la prévisualisation du fichier
      if (selectedFile.value) {
        console.log("File selected:", selectedFile.value.name, selectedFile.value.type);
        if (selectedFile.value.type.startsWith("image/")) {
          optimisticMessage.file = URL.createObjectURL(selectedFile.value);
          console.log("Image preview created");
        }
        optimisticMessage.file_name = selectedFile.value.name;
      }

      // Ajouter à la liste
      messages.value.push(optimisticMessage);
      optimisticMessages.value.set(messageContent, tempMessageId);
      scrollToBottom();

      // 🟢 CHOIX DU MODE D'ENVOI - APPROCHE MIXTE
      if (selectedFile.value) {
        // 🟢 ENVOI REST POUR LES FICHIERS
        console.log("Using REST API for file upload");

        const formData = new FormData();
        formData.append("conversationId", conversationId);
        formData.append("content", messageContent);
        formData.append("file", selectedFile.value);

        try {
          const response = await chatStore.sendMessage(formData);
          console.log("File message sent via REST:", response);

          // Le backend émettra un événement socket pour la diffusion
          // On attend que le message optimiste soit remplacé par le vrai message
        } catch (error) {
          console.error("File upload error:", error);
          // Marquer le message comme échoué
          const index = messages.value.findIndex((m) => m.id_message === tempMessageId);
          if (index !== -1) {
            messages.value[index].status = "failed";
            optimisticMessages.value.delete(messageContent);
          }
        }
      } else {
        // 🟢 ENVOI SOCKET.IO POUR LE TEXTE
        console.log("Using Socket.io for text message");

        const messageData = {
          conversationId: conversationId,
          content: messageContent,
          senderId: authStore.user.id_user,
        };

        console.log("Message data prepared:", messageData);

        // Émettre via socket
        if (socket.value) {
          console.log("Emitting sendMessage via socket");
          socket.value.emit("sendMessage", messageData);
          console.log("Message emitted successfully");
        } else {
          console.error("Socket not available");
          throw new Error("Socket not connected");
        }
      }

      // Timeout pour détecter les échecs (seulement pour Socket.IO)
      if (!selectedFile.value) {
        setTimeout(() => {
          const index = messages.value.findIndex((m) => m.id_message === tempMessageId);
          if (index !== -1 && messages.value[index].status === "sending") {
            console.log("Message timeout - marking as failed");
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

    console.log("Form cleaned up");
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);

    // Marquer le message comme échoué
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
        // 🟢 RETRY AVEC FICHIER - UTILISER REST
        console.log("Retrying file message with REST");

        // Pour les fichiers, on ne peut pas renvoyer le fichier original
        // On envoie seulement le texte
        const formData = new FormData();
        formData.append("conversationId", conversationId);
        formData.append("content", message.content);

        await chatStore.sendMessage(formData);
      } else {
        // 🟢 RETRY SANS FICHIER - UTILISER SOCKET.IO
        if (socket.value) {
          socket.value.emit("sendMessage", {
            conversationId: conversationId,
            content: message.content,
            senderId: authStore.user.id_user,
          });

          // Reset timeout
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
  if (message.status === "sending") return; // Ne pas permettre l'édition pendant l'envoi

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
      // await chatStore.deleteMessage(messageId);
      if (socket.value && messageToDelete) {
        // Utiliser Socket.IO pour la suppression
        socket.value.emit("deleteMessage", {
          messageId: messageId,
          senderId: authStore.user.id_user,
          conversationId: conversationId,
        });
      } else {
        // Fallback vers REST API
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

// Watch for messages from store
watch(
  () => chatStore.messages,
  (newMessages) => {
    // Ne pas écraser les messages optimistes
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
  <div class="h-screen flex flex-col bg-gray-100">
    <!-- Header de la conversation -->
    <div
      class="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between"
    >
      <div class="flex items-center space-x-3">
        <button @click="$router.back()" class="p-2 rounded-lg hover:bg-gray-100">
          <svg
            class="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
          >
            <span class="text-blue-600 font-semibold">
              {{ getConversationInitials(conversation) }}
            </span>
          </div>
          <div v-if="conversation">
            <h2 class="font-semibold text-gray-900">
              {{ conversation.title || getConversationName(conversation) }}
            </h2>
            <p class="text-sm text-gray-500">
              {{
                conversation.type === "private"
                  ? "Conversation privée"
                  : `${conversation.member_count} membres`
              }}
            </p>
          </div>
          <div v-else>
            <div class="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div class="h-3 bg-gray-200 rounded w-16 mt-1 animate-pulse"></div>
          </div>
        </div>
      </div>

      <button @click="showConversationSettings" class="p-2 rounded-lg hover:bg-gray-100">
        <svg
          class="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>
    </div>

    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
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
                  class="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg"
                >
                  <div class="flex-shrink-0">
                    <svg
                      class="w-6 h-6 text-gray-400"
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
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ message.file_name || "Fichier joint" }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ getFileType(message.file_path || message.file) }}
                    </p>
                  </div>
                  <button
                    @click="
                      downloadFile(message.file_path || message.file, message.file_name)
                    "
                    class="p-1 hover:bg-gray-200 rounded"
                  >
                    <svg
                      class="w-4 h-4 text-gray-600"
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

              <!-- Métadonnées du message -->
              <div class="flex items-center justify-between mt-1">
                <span
                  class="text-xs"
                  :class="isOwnMessage(message) ? 'text-blue-100' : 'text-gray-500'"
                >
                  {{ formatTime(message.created_at) }}
                </span>
                <span
                  v-if="isOwnMessage(message) && message.status === 'sent'"
                  class="text-xs ml-2"
                  :class="isOwnMessage(message) ? 'text-blue-100' : 'text-gray-500'"
                >
                  ✓✓
                </span>
              </div>
            </div>

            <!-- Menu des options du message (visible au hover) -->
            <div
              v-if="isOwnMessage(message) && message.status !== 'sending'"
              class="absolute top-0 right-0 z-40 transform translate-x-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <div class="bg-white rounded-lg shadow-lg border border-gray-200 ml-2">
                <button
                  @click="editMessage(message)"
                  class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Modifier</span>
                </button>
                <button
                  @click="deleteMessage(message.id_message)"
                  class="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Zone d'édition de message -->
    <div v-if="editingMessage" class="bg-yellow-50 border-t border-yellow-200 px-4 py-3">
      <div class="flex items-center space-x-2">
        <span class="text-sm text-yellow-800">Modification du message</span>
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

    <!-- Zone d'envoi de message -->
    <div class="bg-white border-t border-gray-200 px-4 py-3">
      <form @submit.prevent="sendMessage" class="flex items-end space-x-3">
        <!-- Input fichier -->
        <label class="flex-shrink-0 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            class="hidden"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            multiple
          />
          <svg
            class="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </label>

        <!-- Zone de texte -->
        <div class="flex-1 bg-gray-100 rounded-lg">
          <textarea
            v-model="newMessage"
            ref="messageInput"
            placeholder="Écrivez votre message..."
            class="w-full bg-transparent border-none focus:ring-0 resize-none py-2 px-3"
            rows="1"
            @keydown.enter.except.prevent="sendMessage"
            @input="adjustTextareaHeight"
          ></textarea>
        </div>

        <!-- Bouton d'envoi -->
        <button
          type="submit"
          :disabled="!newMessage.trim() && !selectedFile"
          class="flex-shrink-0 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </form>

      <!-- Aperçu du fichier sélectionné -->
      <div
        v-if="selectedFile"
        class="mt-3 p-2 bg-gray-50 rounded-lg flex items-center justify-between"
      >
        <div class="flex items-center space-x-2">
          <svg
            class="w-5 h-5 text-gray-400"
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
          <span class="text-sm text-gray-700 truncate">{{ selectedFile.name }}</span>
          <span class="text-xs text-gray-500"
            >({{ formatFileSize(selectedFile.size) }})</span
          >
        </div>
        <button @click="removeSelectedFile" class="text-gray-400 hover:text-gray-600">
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

    <!-- Modal de visualisation d'image -->
    <div
      v-if="viewingImage"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="viewingImage = null"
    >
      <div class="max-w-4xl max-h-full p-4">
        <img :src="viewingImage" class="max-w-full max-h-full object-contain" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
