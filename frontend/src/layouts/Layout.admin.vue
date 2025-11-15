<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth.store";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const mobileOpen = ref(false);

// Récupérer les informations de l'utilisateur
const user = computed(() => authStore.user);
const userName = computed(
  () => user.value?.name || user.value?.email || "Administrateur"
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
    name: "TableauDeBordsAdmin",
    label: "Tableau de bord",
    icon: "chart-bar",
    description: "Vue d'ensemble du système",
  },
  {
    name: "GestionUtilisateursAdmin",
    label: "Utilisateurs",
    icon: "users",
    description: "Gérer les comptes utilisateurs",
  },
  {
    name: "GestionAnnoncesAdmin",
    label: "Annonces",
    icon: "megaphone",
    description: "Gérer les communications",
  },
  {
    name: "GestionCoursAdmin",
    label: "Cours",
    icon: "book-open",
    description: "Gestion des matières",
  },
  {
    name: "GestionAcademiquesAdmin",
    label: "Classes",
    icon: "building-library",
    description: "Administration académique",
  },
  {
    name: "ProfileAdmin",
    label: "Mon profil",
    icon: "user",
    description: "Paramètres personnels",
  },
];

// Mapping des icônes Heroicons
const iconMap = {
  "chart-bar":
    "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  users:
    "M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z",
  megaphone:
    "M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 00-1.06 1.06 5.5 5.5 0 010 7.78.75.75 0 001.06 1.06 7 7 0 000-9.9z",
  "book-open":
    "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  "building-library":
    "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z",
  user:
    "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
};

function handleLogout() {
  authStore.logout();
  router.push("/");
}

const navigateTo = (routeName) => {
  mobileOpen.value = false;
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
  <div class="flex flex-col min-h-screen bg-gray-50 transition-all duration-300">
    <!-- Navbar -->
    <header
      class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-40 transition-all duration-300"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div
          class="flex justify-between items-center h-16 transition-colors duration-200"
        >
          <!-- Logo et nom -->
          <router-link
            :to="{ name: 'TableauDeBordsAdmin' }"
            class="flex items-center space-x-3 group transition-all duration-300"
          >
            <div class="hidden md:block transition-colors duration-200">
              <span class="text-xl font-bold transition-colors duration-200"
                >UniSphere</span
              >
              <span class="block text-sm text-blue-100 transition-colors duration-200"
                >Espace Administrateur</span
              >
            </div>
          </router-link>

          <!-- Menu Desktop -->
          <nav
            class="hidden md:flex items-center space-x-1 transition-colors duration-200"
          >
            <router-link
              v-for="item in menuItems"
              :key="item.name"
              :to="{ name: item.name }"
              class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out relative group hover:scale-105"
              :class="
                route.name === item.name
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              "
            >
              {{ item.label }}
            </router-link>
          </nav>

          <!-- User menu desktop -->
          <div
            class="hidden md:flex items-center space-x-4 transition-colors duration-200"
          >
            <!-- User profile -->
            <div class="flex items-center space-x-3 transition-colors duration-200">
              <div class="text-right transition-colors duration-200">
                <p class="text-sm font-medium text-white transition-colors duration-200">
                  {{ userName }}
                </p>
                <p class="text-xs text-blue-200 transition-colors duration-200">
                  Administrateur
                </p>
              </div>
              <div
                class="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ease-in-out hover:scale-105"
              >
                <span class="text-white font-medium transition-colors duration-200">{{
                  userInitial
                }}</span>
              </div>
            </div>

            <!-- Logout button -->
            <button
              @click="handleLogout"
              class="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200 ease-in-out hover:scale-110"
              title="Déconnexion"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>

          <!-- Bouton mobile -->
          <button
            @click="mobileOpen = !mobileOpen"
            class="md:hidden p-2 rounded-lg hover:bg-white/10 focus:outline-none transition-all duration-200 ease-in-out hover:scale-110"
          >
            <svg
              class="w-6 h-6 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              :class="mobileOpen ? 'hidden' : 'block'"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              class="w-6 h-6 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              :class="mobileOpen ? 'block' : 'hidden'"
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
      </div>

      <!-- Menu mobile -->
      <transition
        enter-active-class="transition-all duration-300 ease-in-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in-out"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div
          v-if="mobileOpen"
          class="md:hidden bg-gradient-to-b from-blue-700 to-indigo-800 border-t border-white/10 shadow-xl transition-all duration-300"
        >
          <nav class="flex flex-col p-4 space-y-1 transition-all duration-300">
            <router-link
              v-for="item in menuItems"
              :key="item.name"
              :to="{ name: item.name }"
              class="flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:bg-white/10 hover:scale-105"
              :class="
                route.name === item.name
                  ? 'bg-white/20 text-white'
                  : 'text-blue-100 hover:text-white'
              "
              @click="navigateTo(item.name)"
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
                  :d="iconMap[item.icon]"
                />
              </svg>
              <div class="transition-colors duration-200">
                <p class="font-medium transition-colors duration-200">{{ item.label }}</p>
                <p class="text-xs text-blue-200 transition-colors duration-200">
                  {{ item.description }}
                </p>
              </div>
            </router-link>

            <div
              class="border-t border-white/20 pt-3 mt-3 transition-colors duration-200"
            >
              <div
                class="flex items-center space-x-3 px-4 py-3 transition-colors duration-200"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105"
                >
                  <span class="text-white font-medium transition-colors duration-200">{{
                    userInitial
                  }}</span>
                </div>
                <div class="transition-colors duration-200">
                  <p
                    class="text-sm font-medium text-white transition-colors duration-200"
                  >
                    {{ userName }}
                  </p>
                  <p class="text-xs text-blue-200 transition-colors duration-200">
                    Administrateur
                  </p>
                </div>
              </div>

              <button
                @click="handleLogout"
                class="w-full flex items-center space-x-3 py-3 px-4 text-blue-100 hover:text-white rounded-lg hover:bg-red-500/20 transition-all duration-200 ease-in-out hover:scale-105"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span class="transition-colors duration-200">Déconnexion</span>
              </button>
            </div>
          </nav>
        </div>
      </transition>
    </header>

    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-200 transition-all duration-300">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300"
      >
        <nav class="flex space-x-2 text-sm text-gray-600 transition-colors duration-200">
          <router-link
            :to="{ name: 'TableauDeBordsAdmin' }"
            class="hover:text-blue-600 transition-all duration-200 ease-in-out hover:scale-105"
          >
            Accueil
          </router-link>
          <span class="text-gray-400 transition-colors duration-200">/</span>
          <span
            class="text-gray-800 font-medium capitalize transition-colors duration-200"
          >
            {{ getRouteDisplayName($route) }}
          </span>
        </nav>
      </div>
    </div>

    <!-- Contenu principal -->
    <main
      class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300"
    >
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 ease-in-out hover:shadow-lg"
      >
        <router-view />
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="bg-white border-t border-gray-200 mt-auto py-6 transition-all duration-300"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm transition-colors duration-200"
      >
        <p class="transition-colors duration-200">
          © 2025 UniSphere - Plateforme éducative. Administration système
        </p>
        <p class="transition-colors duration-200">Créer par Ledoa Gaël</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.router-link-active {
  position: relative;
}

/* Animation pour le menu mobile */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease-in-out;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Transitions globales */
* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
