<template>
  <section class="flex flex-col items-center justify-center py-32 px-4 text-center">
    <h1 class="text-5xl font-bold text-purple-600 mb-4">Compte non activé</h1>
    <p class="text-gray-700 text-lg mb-6">
      Votre compte n’a pas encore été activé. Vérifiez votre email pour l’activation.
    </p>
    <router-link
      to="/"
      class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
    >
      Retour à l’accueil
    </router-link>
  </section>
</template>
