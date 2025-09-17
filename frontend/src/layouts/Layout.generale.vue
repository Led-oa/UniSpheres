<script setup>
import { ref } from "vue";
const isOpen = ref(false);
</script>
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 font-sans">
    <!-- Navbar -->
    <header class="bg-white shadow-md sticky top-0 z-50">
      <nav
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16"
      >
        <!-- Logo -->
        <router-link
          :to="{ name: 'Accueil' }"
          class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
        >
          UniSphere
        </router-link>

        <!-- Menu -->
        <div class="hidden md:flex space-x-6 items-center">
          <router-link
            :to="{ name: 'Accueil' }"
            class="text-gray-700 hover:text-purple-600"
          >
            Accueil
          </router-link>
          <router-link
            :to="{ name: 'Apropos' }"
            class="text-gray-700 hover:text-purple-600"
          >
            À propos
          </router-link>
          <router-link
            :to="{ name: 'Authentification' }"
            class="text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Connexion
          </router-link>
          <router-link
            :to="{ name: 'Inscription' }"
            class="text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Inscription
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button @click="isOpen = !isOpen" class="text-gray-700 focus:outline-none">
            <svg
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
          </button>
        </div>
      </nav>

      <!-- Mobile menu -->
      <transition name="fade">
        <div v-if="isOpen" class="md:hidden bg-white shadow-lg">
          <router-link
            @click="isOpen = false"
            :to="{ name: 'Accueil' }"
            class="block px-4 py-2 text-gray-700 hover:bg-purple-50"
          >
            Accueil
          </router-link>
          <router-link
            @click="isOpen = false"
            :to="{ name: 'Apropos' }"
            class="block px-4 py-2 text-gray-700 hover:bg-purple-50"
          >
            À propos
          </router-link>
          <router-link
            @click="isOpen = false"
            :to="{ name: 'Authentification' }"
            class="block px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-center my-2"
          >
            Connexion
          </router-link>
          <router-link
            @click="isOpen = false"
            :to="{ name: 'Inscription' }"
            class="block px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-center my-2"
          >
            Inscription
          </router-link>
        </div>
      </transition>
    </header>

    <!-- Page content -->
    <main class="mt-8">
      <router-view />
    </main>
  </div>
</template>

<style>
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
