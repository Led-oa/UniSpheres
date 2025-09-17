<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";

const isSidebarOpen = ref(false);
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const menuItems = [
  { name: "TableauDeBordsEtudiant", label: "Tableau de bord", icon: "🏠" },
  { name: "AnnoncesEtudiant", label: "Annonces", icon: "👩‍🎓" },
  { name: "ClasseEtudiant", label: "Ma classe", icon: "👩‍🎓" },
  { name: "ListeCoursEtudiant", label: "Mes cours", icon: "📚" },
  { name: "ListeDiscussionsEtudiant", label: "Messagerie", icon: "📚" },
  { name: "ProfileEtudiant", label: "Profile", icon: "🧑‍🎓" },
];

function handleLogout() {
  authStore.logout();
  router.push("/login");
  alert("Déconnexion");
}
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar Mobile Overlay -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Sidebar Fixe -->
    <aside
      class="sidebar fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-600 to-purple-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-between p-6 border-b border-blue-500">
          <router-link to="/" class="flex items-center space-x-3">
            <span class="text-3xl">🎓</span>
            <span class="text-xl font-bold text-white">UniSphere</span>
          </router-link>

          <!-- Close button for mobile -->
          <button
            @click="isSidebarOpen = false"
            class="lg:hidden p-1 text-white hover:bg-blue-500 rounded-lg transition-colors"
          >
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

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="{ name: item.name }"
            exact-active-class="bg-black/50 shadow-lg"
            class="flex items-center space-x-3 px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:bg-black/25"
            @click="isSidebarOpen = false"
          >
            <span class="text-xl">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
            <span
              v-if="route.name === item.name"
              class="ml-auto w-2 h-2 bg-white rounded-full"
            ></span>
          </router-link>
        </nav>

        <!-- User profile section -->
        <div class="p-6 border-t border-blue-500 mt-auto">
          <div class="flex items-center space-x-3 mb-4">
            <div
              class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <span class="text-white text-sm">👤</span>
            </div>
            <div>
              <p class="text-white text-sm font-medium">Utilisateur</p>
              <p class="text-blue-200 text-xs">Connecté</p>
            </div>
          </div>

          <button
            @click="handleLogout"
            class="w-full flex items-center space-x-2 text-white hover:text-white transition-colors text-sm p-2 rounded-lg hover:bg-red-400/50"
          >
            <span>🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col lg:ml-64 min-h-screen transition-all duration-300">
      <!-- Mobile Header -->
      <header
        class="bg-white shadow-sm border-b border-gray-200 lg:hidden sticky top-0 z-30"
      >
        <div class="flex items-center justify-between p-4">
          <button
            @click="isSidebarOpen = true"
            class="menu-button p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <router-link to="/" class="flex items-center space-x-2">
            <span class="text-2xl">🎓</span>
            <span class="font-bold text-gray-800">UniSphere</span>
          </router-link>

          <div
            class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <span class="text-gray-600">👤</span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-4 lg:p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
<style scoped>
.sidebar {
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
}

/* Scrollbar personnalisée pour la sidebar */
.sidebar nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.sidebar nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.sidebar nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

@media (max-width: 1023px) {
  .sidebar {
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }
}

@media (min-width: 1024px) {
  .sidebar {
    position: fixed;
    transform: translateX(0) !important;
  }

  .main-content {
    margin-left: 256px; /* 64 * 4 */
  }
}
</style>
