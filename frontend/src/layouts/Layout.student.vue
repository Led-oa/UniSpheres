<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";

const isSidebarOpen = ref(false);
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Récupérer les informations de l'utilisateur
const user = computed(() => authStore.user);
const userName = computed(
  () => user.value?.email || user.value?.username || "Utilisateur"
);

const userInitial = computed(() => userName.value.charAt(0).toUpperCase());

const loadUser = async () => {
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUserData();
    } catch (error) {
      console.error("Failed to fetch user data");
    }
  }
};

onMounted(() => {
  loadUser();
});

const menuItems = [
  {
    name: "TableauDeBordsEtudiant",
    label: "Tableau de bord",
    icon: "📊",
  },
  {
    name: "AnnoncesEtudiant",
    label: "Annonces",
    icon: "📢",
  },
  {
    name: "ClasseEtudiant",
    label: "Ma classe",
    icon: "👨‍🎓",
  },
  {
    name: "ListeCoursEtudiant",
    label: "Mes cours",
    icon: "📚",
  },
  {
    name: "ListeDiscussionsEtudiant",
    label: "Messagerie",
    icon: "💬",
  },
  {
    name: "ProfileEtudiant",
    label: "Mon profil",
    icon: "👤",
  },
];

function handleLogout() {
  authStore.logout();
  router.push({ name: "Accueil" });
}

// Fermer le sidebar en mode mobile quand on change de route
const navigateTo = (routeName) => {
  isSidebarOpen.value = false;
  router.push({ name: routeName });
};
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
      class="sidebar fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-600 to-indigo-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-xl"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-between p-6 border-b border-indigo-500">
          <router-link
            :to="{ name: 'TableauDeBordsEtudiant' }"
            class="flex items-center space-x-3 group"
            @click="navigateTo('DashboardStudent')"
          >
            <div
              class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors"
            >
              <span class="text-xl text-white">🎓</span>
            </div>
            <span class="text-xl font-bold text-white">UniSphere</span>
          </router-link>

          <!-- Close button for mobile -->
          <button
            @click="isSidebarOpen = false"
            class="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
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

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="{ name: item.name }"
            exact-active-class="bg-white/10 shadow-lg border-l-4 border-white"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:bg-white/10 hover:border-l-4 hover:border-white/50 group"
            @click="navigateTo(item.name)"
          >
            <span class="text-xl transition-transform group-hover:scale-110">{{
              item.icon
            }}</span>
            <span class="flex-1">{{ item.label }}</span>
            <div
              v-if="route.name === item.name"
              class="w-2 h-2 bg-white rounded-full animate-pulse"
            ></div>
          </router-link>
        </nav>

        <!-- User profile section -->
        <div
          class="p-6 border-t border-indigo-500 mt-auto bg-gradient-to-t from-indigo-700 to-indigo-600/50"
        >
          <div class="flex items-center space-x-3 mb-4">
            <div
              class="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-md"
            >
              <span class="text-white text-lg font-bold">{{ userInitial }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm font-medium truncate">{{ userName }}</p>
              <p class="text-blue-200 text-xs">Étudiant</p>
            </div>
          </div>

          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center space-x-2 text-white hover:text-white transition-colors text-sm p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
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
            class="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
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

          <router-link
            :to="{ name: 'TableauDeBordsEtudiant' }"
            class="flex items-center space-x-2"
            @click="navigateTo('TableauDeBordsEtudiant')"
          >
            <div
              class="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center"
            >
              <span class="text-white text-sm">🎓</span>
            </div>
            <span class="font-bold text-gray-800">UniSphere</span>
          </router-link>

          <div class="flex items-center space-x-3">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-medium text-gray-800 truncate max-w-[120px]">
                {{ userName }}
              </p>
              <p class="text-xs text-gray-500">Étudiant</p>
            </div>
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm"
            >
              <span class="text-white font-medium">{{ userInitial }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Desktop Header -->
      <header
        class="hidden lg:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30"
      >
        <div class="flex items-center justify-between p-4 px-8">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-semibold text-gray-800 capitalize">
              {{ $route.meta.title || $route.name }}
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button
              class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            <!-- User profile -->
            <div class="flex items-center space-x-3">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-800">{{ userName }}</p>
                <p class="text-xs text-gray-500">Étudiant</p>
              </div>
              <div
                class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm"
              >
                <span class="text-white font-medium">{{ userInitial }}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-4 lg:p-6 overflow-auto bg-gray-50">
        <div class="max-w-7xl mx-auto">
          <router-view />
        </div>
      </main>

      <!-- Footer -->
      <footer
        class="bg-white border-t border-gray-200 py-4 px-6 lg:px-8 text-center text-sm text-gray-500"
      >
        <p>© 2025 UniSphere - Plateforme éducative. Tous droits réservés.</p>
      </footer>
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

/* Animation pour les liens actifs */
.router-link-active {
  position: relative;
}

/* Responsive adjustments */
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
}
</style>
