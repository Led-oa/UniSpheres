<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";

import logoUniSphere from "../assets/logoUniSphere.png";

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
    icon: "chart-bar",
  },
  {
    name: "AnnoncesEtudiant",
    label: "Annonces",
    icon: "megaphone",
  },
  {
    name: "ClasseEtudiant",
    label: "Ma classe",
    icon: "academic-cap",
  },
  {
    name: "ListeCoursEtudiant",
    label: "Mes cours",
    icon: "book-open",
  },
  {
    name: "DiscussionStudent",
    label: "Messagerie",
    icon: "chat-bubble-left-right",
  },
  {
    name: "ProfileEtudiant",
    label: "Mon profil",
    icon: "user",
  },
];

// Mapping des icônes Heroicons
const iconMap = {
  "chart-bar":
    "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  megaphone:
    "M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 00-1.06 1.06 5.5 5.5 0 010 7.78.75.75 0 001.06 1.06 7 7 0 000-9.9z",
  "academic-cap":
    "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5",
  "book-open":
    "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  "chat-bubble-left-right":
    "M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z",
  user:
    "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
};

function handleLogout() {
  authStore.logout();
  router.push({ name: "Accueil" });
}

// Fermer le sidebar en mode mobile quand on change de route
const navigateTo = (routeName) => {
  isSidebarOpen.value = false;
  router.push({ name: routeName });
};

const getRouteDisplayName = (route) => {
  if (route.meta?.title) {
    return route.meta.title;
  }
  const routeRecord = router.getRoutes().find((r) => r.name === route.name);
  if (routeRecord?.alias) {
    return Array.isArray(routeRecord.alias) ? routeRecord.alias[0] : routeRecord.alias;
  }
  return route.name;
};
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 transition-all duration-300">
    <!-- Sidebar Mobile Overlay -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-all duration-300 ease-in-out"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Sidebar Fixe -->
    <aside
      class="sidebar fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-600 to-purple-700 transform transition-all duration-300 ease-in-out lg:translate-x-0 shadow-xl"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex flex-col h-full transition-all duration-300">
        <!-- Logo -->
        <div
          class="flex items-center justify-between p-6 border-b border-indigo-500 transition-colors duration-200"
        >
          <router-link
            :to="{ name: 'TableauDeBordsEtudiant' }"
            class="flex items-center text-center space-x-3 group transition-all duration-300"
            @click="navigateTo('TableauDeBordsEtudiant')"
          >
            <!-- <img
              :src="logoUniSphere"
              alt="UniSphere Logo"
              class="h-10 w-auto transition-all duration-300 ease-in-out group-hover:scale-105"
            /> -->
            <span
              class="text-xl font-bold text-white transition-colors duration-200"
              >UniSphere</span
            >
          </router-link>

          <!-- Close button for mobile -->
          <button
            @click="isSidebarOpen = false"
            class="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200 ease-in-out"
          >
            <svg
              class="w-5 h-5 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
        <nav
          class="flex-1 px-3 py-6 space-y-1 overflow-y-auto transition-all duration-300"
        >
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="{ name: item.name }"
            exact-active-class="bg-white/10 shadow-lg border-l-4 border-white"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl text-white font-medium transition-all duration-200 ease-in-out hover:bg-white/10 hover:border-l-4 hover:border-white/50 group hover:scale-105"
            @click="navigateTo(item.name)"
          >
            <svg
              class="w-5 h-5 transition-all duration-200 ease-in-out group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="iconMap[item.icon]"
              />
            </svg>
            <span class="flex-1 transition-colors duration-200">{{ item.label }}</span>
            <div
              v-if="route.name === item.name"
              class="w-2 h-2 bg-white rounded-full animate-pulse transition-colors duration-200"
            ></div>
          </router-link>
        </nav>

        <!-- User profile section -->
        <div
          class="p-6 border-t border-indigo-500 mt-auto bg-gradient-to-t from-indigo-700 to-indigo-600/50 transition-all duration-300"
        >
          <div class="flex items-center space-x-3 mb-4 transition-colors duration-200">
            <div
              class="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ease-in-out hover:scale-105"
            >
              <span class="text-white text-lg font-bold transition-colors duration-200">{{
                userInitial
              }}</span>
            </div>
            <div class="flex-1 min-w-0 transition-colors duration-200">
              <p
                class="text-white text-sm font-medium truncate transition-colors duration-200"
              >
                {{ userName }}
              </p>
              <p class="text-blue-200 text-xs transition-colors duration-200">Étudiant</p>
            </div>
          </div>

          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center space-x-2 text-white hover:text-white transition-all duration-200 ease-in-out text-sm p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 hover:scale-105"
          >
            <svg
              class="w-4 h-4 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span class="transition-colors duration-200">Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div
      class="flex-1 flex flex-col lg:ml-64 min-h-screen transition-all duration-300 ease-in-out"
    >
      <!-- Mobile Header -->
      <header
        class="bg-white shadow-sm border-b border-gray-200 lg:hidden sticky top-0 z-30 transition-all duration-300"
      >
        <div class="flex items-center justify-between p-4 transition-colors duration-200">
          <button
            @click="isSidebarOpen = true"
            class="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200 ease-in-out"
          >
            <svg
              class="w-6 h-6 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
            class="flex items-center space-x-2 transition-all duration-300"
            @click="navigateTo('TableauDeBordsEtudiant')"
          >
            <div
              class="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105"
            >
              <svg
                class="w-4 h-4 text-white transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 14v6l9-5-9-5-9 5 9 5z"
                />
              </svg>
            </div>
            <span class="font-bold text-gray-800 transition-colors duration-200"
              >UniSphere</span
            >
          </router-link>

          <div class="flex items-center space-x-3 transition-colors duration-200">
            <div class="text-right hidden sm:block transition-colors duration-200">
              <p
                class="text-sm font-medium text-gray-800 truncate max-w-[120px] transition-colors duration-200"
              >
                {{ userName }}
              </p>
              <p class="text-xs text-gray-500 transition-colors duration-200">Étudiant</p>
            </div>
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ease-in-out hover:scale-105"
            >
              <span class="text-white font-medium transition-colors duration-200">{{
                userInitial
              }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Desktop Header -->
      <header
        class="hidden lg:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 transition-all duration-300"
      >
        <div
          class="flex items-center justify-between p-4 px-8 transition-colors duration-200"
        >
          <div class="flex items-center space-x-4 transition-colors duration-200">
            <h1
              class="text-xl font-semibold text-gray-800 capitalize transition-colors duration-200"
            >
              {{ getRouteDisplayName($route) }}
            </h1>
          </div>

          <div class="flex items-center space-x-4 transition-colors duration-200">
            <!-- Notifications -->
            <button
              class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-200 ease-in-out hover:scale-110"
            >
              <svg
                class="w-5 h-5 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            <!-- User profile -->
            <div class="flex items-center space-x-3 transition-colors duration-200">
              <div class="text-right transition-colors duration-200">
                <p
                  class="text-sm font-medium text-gray-800 transition-colors duration-200"
                >
                  {{ userName }}
                </p>
                <p class="text-xs text-gray-500 transition-colors duration-200">
                  Étudiant
                </p>
              </div>
              <div
                class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ease-in-out hover:scale-105"
              >
                <span class="text-white font-medium transition-colors duration-200">{{
                  userInitial
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main
        class="flex-1 p-4 lg:p-6 overflow-auto bg-gray-50 transition-all duration-300"
      >
        <div class="max-w-7xl mx-auto transition-all duration-300">
          <router-view />
        </div>
      </main>

      <!-- Footer -->
      <footer
        class="bg-white border-t border-gray-200 py-4 px-6 lg:px-8 text-center text-sm text-gray-500 transition-all duration-300"
      >
        <p class="transition-colors duration-200">
          © 2025 UniSphere - Plateforme éducative. Tous droits réservés.
        </p>
        <p class="transition-colors duration-200">Créer par Ledoa Gaël</p>
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
  transition: all 0.3s ease-in-out;
}

.sidebar nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
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

/* Transitions globales */
* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
