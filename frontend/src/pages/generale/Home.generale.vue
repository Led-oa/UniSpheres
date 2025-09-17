<template>
  <section class="text-center py-20 px-4 sm:px-6 lg:px-8">
    <h1
      class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
    >
      Bienvenue sur UniSphere
    </h1>
    <p class="mt-4 text-gray-700 max-w-xl mx-auto">
      Connectez étudiants, enseignants et administrateurs dans une seule plateforme
      d’apprentissage moderne.
    </p>

    <div class="mt-8 flex justify-center gap-4 flex-wrap">
      <router-link
        to="/register"
        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
      >
        S’inscrire
      </router-link>
      <router-link
        to="/login"
        class="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
      >
        Se connecter
      </router-link>
    </div>
  </section>
</template>
