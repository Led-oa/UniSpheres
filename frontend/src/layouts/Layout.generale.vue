<script setup>
import { ref, computed,onMounted } from "vue";
import { useAuthStore } from "../stores/auth.store";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const isOpen = ref(false);

// Vérifier l'état de connexion
const isLoggedIn = computed(() => authStore.isLoggedIn);
const user = computed(() => authStore.user);
const userRole = computed(() => authStore.role);

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

// Fonction de déconnexion
const handleLogout = async () => {
  try {
    await authStore.logout();
    isOpen.value = false;
    router.push({ name: "Accueil" });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
};

// Navigation vers le profil
const goToProfile = () => {
  isOpen.value = false;
  let routeName = "";

  switch (userRole.value) {
    case "administrator":
      routeName = "ProfileAdmin";
      break;
    case "teacher":
      routeName = "ProfileEnseignant";
      break;
    case "student":
      routeName = "ProfileEtudiant";
      break;
    default:
      routeName = "Accueil";
  }

  if (routeName) {
    router.push({ name: routeName });
  }
};

// Navigation vers le dashboard selon le rôle
const goToDashboard = () => {
  isOpen.value = false;
  let routeName = "";

  switch (userRole.value) {
    case "administrator":
      routeName = "TableauDeBordsAdmin";
      break;
    case "teacher":
      routeName = "TableauDeBordsEnseignant";
      break;
    case "student":
      routeName = "TableauDeBordsEtudiant";
      break;
    default:
      routeName = "Accueil";
  }

  if (routeName) {
    router.push({ name: routeName });
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-sans">
    <!-- Navbar -->
    <header class="bg-white shadow-md sticky top-0 z-50">
      <nav
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16"
      >
        <!-- Logo -->
        <router-link
          :to="{ name: 'Accueil' }"
          class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 flex items-center"
        >
          <!-- <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 mr-2 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg> -->
          UniSphere
        </router-link>

        <!-- Menu Desktop -->
        <div class="hidden md:flex space-x-6 items-center">
          <router-link
            :to="{ name: 'Accueil' }"
            class="text-gray-700 hover:text-purple-600 transition-colors font-medium"
          >
            Accueil
          </router-link>
          <router-link
            :to="{ name: 'Apropos' }"
            class="text-gray-700 hover:text-purple-600 transition-colors font-medium"
          >
            À propos
          </router-link>

          <!-- Menu utilisateur connecté -->
          <template v-if="isLoggedIn">
            <button
              @click="goToDashboard"
              class="text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Tableau de bord
            </button>

            <!-- Menu déroulant profil -->
            <div class="relative group">
              <button
                class="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <div
                  class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium"
                >
                  {{ user?.name?.[0]?.toUpperCase() || "U" }}
                </div>
                <span class="font-medium">{{ user?.name || "Utilisateur" }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <!-- Dropdown menu -->
              <div
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
              >
                <button
                  @click="goToProfile"
                  class="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Mon profil
                </button>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Déconnexion
                </button>
              </div>
            </div>
          </template>

          <!-- Menu visiteur non connecté -->
          <template v-else>
            <router-link
              :to="{ name: 'Authentification' }"
              class="text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg hover:opacity-90 transition font-medium"
            >
              Connexion
            </router-link>
            <router-link
              :to="{ name: 'Inscription' }"
              class="text-purple-600 border border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-600 hover:text-white transition font-medium"
            >
              Inscription
            </router-link>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button @click="isOpen = !isOpen" class="text-gray-700 focus:outline-none p-2">
            <svg
              v-if="!isOpen"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </nav>

      <!-- Mobile menu -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="isOpen" class="md:hidden bg-white shadow-lg py-2">
          <router-link
            @click="isOpen = false"
            :to="{ name: 'Accueil' }"
            class="block px-4 py-3 text-gray-700 hover:bg-purple-50 font-medium"
          >
            Accueil
          </router-link>
          <router-link
            @click="isOpen = false"
            :to="{ name: 'Apropos' }"
            class="block px-4 py-3 text-gray-700 hover:bg-purple-50 font-medium"
          >
            À propos
          </router-link>

          <!-- Menu mobile utilisateur connecté -->
          <template v-if="isLoggedIn">
            <button
              @click="goToDashboard"
              class="w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50 font-medium flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Tableau de bord
            </button>
            <button
              @click="goToProfile"
              class="w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50 font-medium flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Mon profil
            </button>
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Déconnexion
            </button>
          </template>

          <!-- Menu mobile visiteur non connecté -->
          <template v-else>
            <router-link
              @click="isOpen = false"
              :to="{ name: 'Authentification' }"
              class="block px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-center mx-2 my-2 font-medium"
            >
              Connexion
            </router-link>
            <router-link
              @click="isOpen = false"
              :to="{ name: 'Inscription' }"
              class="block px-4 py-3 text-purple-600 border border-purple-600 rounded-lg text-center mx-2 my-2 font-medium"
            >
              Inscription
            </router-link>
          </template>
        </div>
      </transition>
    </header>

    <!-- Page content -->
    <main class="">
      <router-view />
    </main>

    <!-- Footer optionnel -->
    <footer class="bg-white border-t border-gray-200 mt-16 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
        <p>© 2025 UniSphere. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Styles pour les transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
