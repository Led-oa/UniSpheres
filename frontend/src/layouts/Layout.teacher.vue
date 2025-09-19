<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth.store";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const mobileOpen = ref(false);

// Récupérer les informations de l'utilisateur
const user = computed(() => authStore.user);
const userName = computed(() => user.value?.name || user.value?.username || "Enseignant");
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
    name: "TableauDeBordsEnseignant",
    label: "Tableau de bord",
    icon: "📊",
    description: "Vue d'ensemble de vos activités",
  },
  {
    name: "AnnoncesEnseignant",
    label: "Annonces",
    icon: "📢",
    description: "Gérer vos communications",
  },
  {
    name: "ListeDiscussionsEnseignant",
    label: "Messagerie",
    icon: "💬",
    description: "Communiquer avec les étudiants",
  },
  {
    name: "ListeCoursEnseignant",
    label: "Mes cours",
    icon: "📚",
    description: "Gérer vos matières",
  },
  {
    name: "ListeClasseEnseignant",
    label: "Mes classes",
    icon: "👨‍🏫",
    description: "Vos groupes d'étudiants",
  },
  {
    name: "ProfileEnseignant",
    label: "Mon profil",
    icon: "👤",
    description: "Paramètres personnels",
  },
];

function handleLogout() {
  authStore.logout();
  router.push("/login");
}

// Navigation avec fermeture du menu mobile
const navigateTo = (routeName) => {
  mobileOpen.value = false;
  router.push({ name: routeName });
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Navbar -->
    <header
      class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-40"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo et nom -->
          <router-link
            :to="{ name: 'TableauDeBordsEnseignant' }"
            class="flex items-center space-x-3 group"
          >
            <div
              class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors"
            >
              <span class="text-xl">🎓</span>
            </div>
            <div class="hidden md:block">
              <span class="text-xl font-bold">UniSphere</span>
              <span class="block text-sm text-blue-100">Espace Enseignant</span>
            </div>
          </router-link>

          <!-- Menu Desktop -->
          <nav class="hidden md:flex items-center space-x-1">
            <router-link
              v-for="item in menuItems"
              :key="item.name"
              :to="{ name: item.name }"
              class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group"
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
          <div class="hidden md:flex items-center space-x-4">
            <!-- Notifications -->
            <button
              class="relative p-2 text-blue-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- User profile -->
            <div class="flex items-center space-x-3">
              <div class="text-right">
                <p class="text-sm font-medium text-white">{{ userName }}</p>
                <p class="text-xs text-blue-200">Enseignant</p>
              </div>
              <div
                class="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm"
              >
                <span class="text-white font-medium">{{ userInitial }}</span>
              </div>
            </div>

            <!-- Logout button -->
            <button
              @click="handleLogout"
              class="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Déconnexion"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            class="md:hidden p-2 rounded-lg hover:bg-white/10 focus:outline-none transition-colors"
          >
            <svg
              class="w-6 h-6"
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
              class="w-6 h-6"
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
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div
          v-if="mobileOpen"
          class="md:hidden bg-gradient-to-b from-blue-700 to-indigo-800 border-t border-white/10 shadow-xl"
        >
          <nav class="flex flex-col p-4 space-y-1">
            <router-link
              v-for="item in menuItems"
              :key="item.name"
              :to="{ name: item.name }"
              class="flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors"
              :class="
                route.name === item.name
                  ? 'bg-white/20 text-white'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              "
              @click="navigateTo(item.name)"
            >
              <span class="text-xl">{{ item.icon }}</span>
              <div>
                <p class="font-medium">{{ item.label }}</p>
                <p class="text-xs text-blue-200">{{ item.description }}</p>
              </div>
            </router-link>

            <div class="border-t border-white/20 pt-3 mt-3">
              <div class="flex items-center space-x-3 px-4 py-3">
                <div
                  class="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center"
                >
                  <span class="text-white font-medium">{{ userInitial }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-white">{{ userName }}</p>
                  <p class="text-xs text-blue-200">Enseignant</p>
                </div>
              </div>

              <button
                @click="handleLogout"
                class="w-full flex items-center space-x-3 py-3 px-4 text-blue-100 hover:text-white rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <svg
                  class="w-5 h-5"
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
                <span>Déconnexion</span>
              </button>
            </div>
          </nav>
        </div>
      </transition>
    </header>

    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav class="flex space-x-2 text-sm text-gray-600">
          <router-link
            :to="{ name: 'TableauDeBordsEnseignant' }"
            class="hover:text-blue-600 transition-colors"
          >
            Accueil
          </router-link>
          <span class="text-gray-400">/</span>
          <span class="text-gray-800 font-medium capitalize">
            {{
              $route.meta.title ||
              $route.name?.replace("Enseignant", "") ||
              "Page actuelle"
            }}
          </span>
        </nav>
      </div>
    </div>

    <!-- Contenu principal -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <router-view />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto py-6">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm"
      >
        <p>© 2025 UniSphere - Plateforme éducative. Espace Enseignant</p>
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
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
