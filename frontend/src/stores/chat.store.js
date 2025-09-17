import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { ChatService } from "../services/api/chat.api";

export const useChatStore = defineStore("chat", {
  state: () => ({
    socket: null,
    conversations: [],
    currentConversation: null,
    messages: [],
    loading: false,
    error: null,
  }),

  actions: {
    // Initialisation de la connexion Socket.IO avec authentification par token
    initializeSocket(token) {
      this.socket = io("http://localhost:8000", {
        auth: { token },
      });

      // Événements de conversation
      this.socket.on("conversationCreated", (conversation) => {
        this.conversations.push(conversation);
      });

      this.socket.on("conversationRenamed", ({ conversationId, title }) => {
        const conversation = this.conversations.find(
          (c) => c.id_conversation === conversationId
        );
        if (conversation) {
          conversation.title = title;
        }
      });

      this.socket.on("addedToConversation", ({ conversationId }) => {
        // Recharger les conversations si l'utilisateur est ajouté
        this.getConversations();
      });

      this.socket.on("removedFromConversation", ({ conversationId }) => {
        // Filtrer la conversation si l'utilisateur est retiré
        this.conversations = this.conversations.filter(
          (c) => c.id_conversation !== conversationId
        );
        if (this.currentConversation?.id_conversation === conversationId) {
          this.currentConversation = null;
          this.messages = [];
        }
      });

      this.socket.on("conversationDeleted", ({ conversationId }) => {
        this.conversations = this.conversations.filter(
          (c) => c.id_conversation !== conversationId
        );
        if (this.currentConversation?.id_conversation === conversationId) {
          this.currentConversation = null;
          this.messages = [];
        }
      });

      // Événements de message
      this.socket.on("newMessage", (message) => {
        if (
          this.currentConversation?.id_conversation === message.conversation_id
        ) {
          this.messages.push(message);
        }
      });

      this.socket.on("messageEdited", (updatedMessage) => {
        const index = this.messages.findIndex(
          (m) => m.id_message === updatedMessage.id_message
        );
        if (index !== -1) {
          this.messages[index] = updatedMessage;
        }
      });

      this.socket.on("messageDeleted", ({ id_message }) => {
        this.messages = this.messages.filter(
          (m) => m.id_message !== id_message
        );
      });

      // Gestion des erreurs de connexion
      this.socket.on("connect_error", (error) => {
        console.error("Erreur de connexion Socket.IO:", error);
        this.error = "Erreur de connexion au serveur de messagerie";
      });

      this.socket.on("errorMessage", (errorData) => {
        console.error("Erreur de message:", errorData);
        this.error =
          errorData.message || "Erreur lors de l'opération de messagerie";
      });
    },

    // Déconnexion Socket.IO
    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
    },

    // Rejoindre une conversation
    joinConversation(conversationId) {
      if (this.socket) {
        this.socket.emit("joinConversation", conversationId);
      }
    },

    // Quitter une conversation
    leaveConversation(conversationId) {
      if (this.socket) {
        this.socket.emit("leaveConversation", conversationId);
      }
    },

    // Récupérer les conversations
    async getConversations() {
      this.loading = true;
      try {
        const response = await ChatService.getConversations();
        this.conversations = response.conversations || [];
        this.error = null;
      } catch (error) {
        this.error =
          error.response?.data?.error ||
          "Erreur lors de la récupération des conversations";
      } finally {
        this.loading = false;
      }
    },

    // Créer une conversation
    async createConversation(data) {
      this.loading = true;
      try {
        const response = await ChatService.createConversation(data);

        if (response.error && response.conversationId) {
          // Conversation privée déjà existante, on la sélectionne
          this.currentConversation = this.conversations.find(
            (c) => c.id_conversation === response.conversationId
          );
          if (this.currentConversation) {
            await this.getMessages(this.currentConversation.id_conversation);
            this.joinConversation(this.currentConversation.id_conversation);
          }
          return { exists: true, conversationId: response.conversationId };
        }

        // Émettre l'événement via socket
        if (this.socket) {
          this.socket.emit("conversationCreated", response);
        }

        this.error = null;
        return response;
      } catch (error) {
        this.error =
          error.response?.data?.error ||
          "Erreur lors de la création de la conversation";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Renommer une conversation
    async renameConversation(conversationId, title) {
      try {
        await ChatService.renameConversation(conversationId, title);

        // Émettre l'événement via socket
        if (this.socket) {
          this.socket.emit("conversationRenamed", { conversationId, title });
        }

        this.error = null;
      } catch (error) {
        this.error =
          error.response?.data?.error ||
          "Erreur lors du renommage de la conversation";
        throw error;
      }
    },

    // Ajouter un membre à une conversation
    async addMember(conversationId, memberId) {
      try {
        await ChatService.addMember(conversationId, memberId);

        // Émettre l'événement via socket
        if (this.socket) {
          this.socket.emit("addedToConversation", { conversationId, memberId });
        }

        this.error = null;
      } catch (error) {
        this.error =
          error.response?.data?.error || "Erreur lors de l'ajout du membre";
        throw error;
      }
    },

    // Retirer un membre d'une conversation
    async removeMember(conversationId, memberId) {
      try {
        await ChatService.removeMember(conversationId, memberId);

        // Émettre l'événement via socket
        if (this.socket) {
          this.socket.emit("removedFromConversation", {
            conversationId,
            memberId,
          });
        }

        this.error = null;
      } catch (error) {
        this.error =
          error.response?.data?.error || "Erreur lors du retrait du membre";
        throw error;
      }
    },

    // Quitter une conversation
    async leaveConversation(conversationId) {
      try {
        await ChatService.leaveConversation(conversationId);

        // Émettre l'événement via socket
        if (this.socket) {
          this.socket.emit("leftConversation", { conversationId });
        }

        // Mettre à jour l'état local
        this.conversations = this.conversations.filter(
          (c) => c.id_conversation !== conversationId
        );
        if (this.currentConversation?.id_conversation === conversationId) {
          this.currentConversation = null;
          this.messages = [];
        }

        this.error = null;
      } catch (error) {
        this.error =
          error.response?.data?.error ||
          "Erreur lors de la sortie de la conversation";
        throw error;
      }
    },

    // Récupérer les messages d'une conversation
    async getMessages(conversationId) {
      this.loading = true;
      try {
        const messages = await ChatService.getMessages(conversationId);
        this.messages = messages;
        this.error = null;

        // Rejoindre la conversation via socket
        this.joinConversation(conversationId);
      } catch (error) {
        this.error =
          error.response?.data?.error ||
          "Erreur lors de la récupération des messages";
      } finally {
        this.loading = false;
      }
    },

    // Envoyer un message
    async sendMessage(data) {
      try {
        const message = await ChatService.sendMessage(data);

        // Émettre l'événement via socket
        if (this.socket) {
          this.socket.emit("sendMessage", {
            conversationId: data.conversationId,
            content: data.content,
            file: data.file,
          });
        }

        this.error = null;
        return message;
      } catch (error) {
        this.error =
          error.response?.data?.error || "Erreur lors de l'envoi du message";
        throw error;
      }
    },

    // Modifier un message
    async editMessage(messageId, content) {
      try {
        const updatedMessage = await ChatService.editMessage(
          messageId,
          content
        );

        // Émettre l'événement via socket
        if (this.socket && this.currentConversation) {
          this.socket.emit("editMessage", {
            messageId,
            content,
            conversationId: this.currentConversation.id_conversation,
          });
        }

        this.error = null;
        return updatedMessage;
      } catch (error) {
        this.error =
          error.response?.data?.error ||
          "Erreur lors de la modification du message";
        throw error;
      }
    },

    // Supprimer un message
    async deleteMessage(messageId) {
      try {
        await ChatService.deleteMessage(messageId);

        // Émettre l'événement via socket
        if (this.socket && this.currentConversation) {
          this.socket.emit("deleteMessage", {
            messageId,
            conversationId: this.currentConversation.id_conversation,
          });
        }

        this.error = null;
      } catch (error) {
        this.error =
          error.response?.data?.error ||
          "Erreur lors de la suppression du message";
        throw error;
      }
    },

    // Sélectionner une conversation
    selectConversation(conversation) {
      this.currentConversation = conversation;
      if (conversation) {
        this.getMessages(conversation.id_conversation);
      } else {
        this.messages = [];
      }
    },

    // Effacer les erreurs
    clearError() {
      this.error = null;
    },
  },

  getters: {
    // Obtenir les conversations triées par date de dernier message
    sortedConversations: (state) => {
      return [...state.conversations].sort((a, b) => {
        return (
          new Date(b.last_message_at || b.created_at) -
          new Date(a.last_message_at || a.created_at)
        );
      });
    },

    // Vérifier si le socket est connecté
    isConnected: (state) => {
      return state.socket && state.socket.connected;
    },
  },
});
