<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";

const authStore = useAuthStore();
// const router = useRouter();
const mobileOpen = ref(false);

const menuItems = [
  { name: "TableauDeBordsEnseignant", label: "Dashboard" },
  { name: "AnnoncesEnseignant", label: "Annonces" },
  { name: "ListeCoursEnseignant", label: "Mes Cours" },
  { name: "ListeClasseEnseignant", label: "Mes Classes" },
  { name: "ProfileEnseignant", label: "Profile" },
];

function handleLogout() {
  authStore.logout();
  router.push("/login");
  alert("Déconnexion");
}
</script>
<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Navbar -->
    <header class="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16"
      >
        <!-- Logo -->
        <router-link
          :to="{ name: 'TableauDeBordsEnseignant' }"
          class="flex items-center space-x-2"
        >
          <span class="text-2xl">🎓</span>
          <span class="text-xl font-bold">UniSphere Enseignant</span>
        </router-link>

        <!-- Menu Desktop -->
        <nav class="hidden md:flex space-x-6">
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="{ name: item.name }"
            class="hover:text-gray-100"
            exact-active-class="underline underline-offset-4"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <!-- Bouton mobile -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="md:hidden p-2 rounded hover:bg-white/10 focus:outline-none"
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
      </div>

      <!-- Menu mobile -->
      <div
        v-if="mobileOpen"
        class="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 border-t border-white/20"
      >
        <nav class="flex flex-col p-4 space-y-2">
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="{ name: item.name }"
            class="py-2 px-3 rounded hover:bg-white/10"
            @click="mobileOpen = false"
          >
            {{ item.label }}
          </router-link>
          <button
            @click="handleLogout"
            class="py-2 px-3 text-left rounded hover:bg-red-500/40"
          >
            Déconnexion
          </button>
        </nav>
      </div>
    </header>
    <!-- Contenu -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
      <router-view />
    </main>
  </div>
</template>
