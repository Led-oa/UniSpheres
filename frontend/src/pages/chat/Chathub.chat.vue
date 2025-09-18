<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useChatStore } from "../../stores/chat.store";
import { useAuthStore } from "../../stores/auth.store";

import { useAdminStore } from "../../stores/admin.store";

const router = useRouter();
const chatStore = useChatStore();
const authStore = useAuthStore();
const adminStore = useAdminStore();

const showCreateModal = ref(false);
const searchQuery = ref("");
const newConversation = ref({
  type: "private",
  title: "",
  memberIds: [],
});

// Computed properties
const loading = computed(() => chatStore.loading);
const error = computed(() => chatStore.error);
const conversations = computed(() => chatStore.conversations);
const sortedConversations = computed(() => chatStore.sortedConversations);

const availableUsers = computed(() => {
  if (!adminStore.users || !Array.isArray(adminStore.users)) {
    return [];
  }

  if (!authStore.user || !authStore.user.id) {
    return adminStore.users;
  }

  return adminStore.users.filter((user) => user.id !== authStore.user.id);
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

// Methods
const getConversationInitials = (conversation) => {
  if (conversation.display_name) {
    return conversation.display_name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }
  return "DM";
};

const getConversationName = (conversation) => {
  if (conversation.title) {
    return conversation.title;
  }
  if (conversation.display_name) {
    return conversation.display_name;
  }
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

const isUserSelected = (userId) => {
  return newConversation.value.memberIds.includes(userId);
};

const toggleUserSelection = (userId) => {
  if (newConversation.value.type === "private") {
    // Pour les conversations privées, on ne peut sélectionner qu'un seul utilisateur
    newConversation.value.memberIds = [userId];
  } else {
    // Pour les groupes, on peut sélectionner plusieurs utilisateurs
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

const selectConversation = (conversation) => {
  // router.push(`/messageries/${conversation.id_conversation}`);
  return {
    name: "DiscussionEtudiant",
    params: {
      id: conversation.id_conversation,
    },
  };
};

const clearError = () => {
  chatStore.clearError();
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

    if (result && result.exists) {
      router.push(`/messageries/${result.conversationId}`);
    } else if (result && result.id_conversation) {
      router.push(`/messageries/${result.id_conversation}`);
    }

    closeCreateModal();
  } catch (error) {
    console.error("Erreur lors de la création:", error);
  }
};

// Lifecycle hooks
onMounted(async () => {
  try {
    await chatStore.getConversations();

    if (authStore.token) {
      chatStore.initializeSocket(authStore.token);
    }
  } catch (err) {
    console.error("Erreur lors du chargement:", err);
  }
});

onUnmounted(() => {
  chatStore.disconnectSocket();
});
</script>
<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Header avec bouton de création -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Mes conversations</h1>
      <button
        @click="openCreateModal"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        Nouvelle conversation
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error message -->
    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      {{ error }}
      <button @click="clearError" class="float-right text-red-800 font-bold">×</button>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && sortedConversations.length === 0" class="text-center py-12">
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
        ></path>
      </svg>
      <p class="text-gray-600 mb-4">Aucune conversation pour le moment</p>
      <button
        @click="openCreateModal"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Commencer une conversation
      </button>
    </div>

    <!-- Liste des conversations -->
    <div v-else class="grid gap-4">
      <router-link
        v-for="conversation in sortedConversations"
        :key="conversation.id_conversation"
        :to="selectConversation(conversation)"
        class="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div class="flex items-center space-x-4">
          <!-- Avatar de la conversation -->
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <span class="text-blue-600 font-semibold">
                {{ getConversationInitials(conversation) }}
              </span>
            </div>
          </div>

          <!-- Informations de la conversation -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-900 truncate">
                {{ conversation.title || getConversationName(conversation) }}
              </h2>
              <span class="text-sm text-gray-500">
                {{ formatDate(conversation.last_message_at || conversation.created_at) }}
              </span>
            </div>

            <p v-if="conversation.last_message" class="text-gray-600 truncate">
              {{ conversation.last_message }}
            </p>
            <p v-else class="text-gray-400 italic">Aucun message</p>

            <div class="flex items-center mt-1">
              <span class="text-sm text-gray-500 mr-2">
                {{ conversation.type === "private" ? "Privé" : "Groupe" }}
              </span>
              <span class="text-sm text-gray-400">
                • {{ conversation.member_count || 2 }} membre(s)
              </span>
            </div>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Modal de création de conversation -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="closeCreateModal"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-lg"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Nouvelle conversation</h2>
          <button @click="closeCreateModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Type selection -->
        <div class="px-6 py-4 border-b border-gray-200">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Type de conversation</label
          >
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input
                type="radio"
                v-model="newConversation.type"
                value="private"
                class="mr-2"
              />
              Privée
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                v-model="newConversation.type"
                value="group"
                class="mr-2"
              />
              Groupe
            </label>
          </div>
        </div>

        <!-- Group name input -->
        <div
          v-if="newConversation.type === 'group'"
          class="px-6 py-4 border-b border-gray-200"
        >
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Nom du groupe</label
          >
          <input
            v-model="newConversation.title"
            type="text"
            placeholder="Nom du groupe"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Search -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="relative">
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
              placeholder="Rechercher un utilisateur..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Users list -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="adminStore.loading" class="p-8 text-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"
            ></div>
            <p class="mt-2 text-gray-600">Chargement des utilisateurs...</p>
          </div>
          <div
            v-else-if="filteredUsers.length === 0"
            class="p-8 text-center text-gray-500"
          >
            <div class="text-6xl mb-4">👥</div>
            <p>Aucun utilisateur trouvé</p>
          </div>
          <ul v-else class="divide-y divide-gray-200">
            <li
              v-for="user in filteredUsers"
              :key="user.id_user"
              class="p-4 hover:bg-blue-50 cursor-pointer flex items-center space-x-3 transition"
            >
              <!-- Checkbox/Radio avec input réel -->
              <label class="flex items-center cursor-pointer">
                <input
                  :type="newConversation.type === 'private' ? 'radio' : 'checkbox'"
                  :name="
                    newConversation.type === 'private'
                      ? 'userSelection'
                      : `userCheckbox-${user.id_user}`
                  "
                  :checked="isUserSelected(user.id_user)"
                  @change="toggleUserSelection(user.id_user)"
                  class="sr-only"
                />
                <div
                  :class="[
                    newConversation.type === 'private' ? 'rounded-full' : 'rounded',
                    'w-5 h-5 border-2 flex items-center justify-center',
                    isUserSelected(user.id_user)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300',
                  ]"
                >
                  <svg
                    v-if="isUserSelected(user.id_user)"
                    class="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      v-if="newConversation.type === 'private'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </label>

              <!-- User info avec clic pour sélectionner -->
              <div
                @click="toggleUserSelection(user.id_user)"
                class="flex-1 flex items-center space-x-3"
              >
                <!-- Avatar -->
                <div
                  class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
                >
                  <span class="text-blue-600 font-semibold">
                    {{ getUserInitials(user) }}
                  </span>
                </div>

                <!-- User details -->
                <div>
                  <p class="font-medium text-gray-900">
                    {{ user.name || user.email }}
                  </p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                  <p v-if="user.role" class="text-xs text-gray-400">
                    {{ user.role }}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Footer -->
        <div
          class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center"
        >
          <div v-if="newConversation.type === 'group'" class="text-sm text-gray-600">
            {{ newConversation.memberIds.length }} utilisateur(s) sélectionné(s)
          </div>
          <div v-else></div>

          <div class="flex space-x-3">
            <button
              @click="closeCreateModal"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              Annuler
            </button>
            <button
              @click="createNewConversation"
              :disabled="!canCreateConversation"
              :class="[
                'px-4 py-2 text-white rounded-md transition font-medium',
                canCreateConversation
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-400 cursor-not-allowed',
              ]"
            >
              Créer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
