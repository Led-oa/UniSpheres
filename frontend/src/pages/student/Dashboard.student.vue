<script setup></script>
<template>
  <div class="space-y-6">
    <!-- Titre -->
    <h1 class="text-2xl font-bold text-gray-800">Tableau de bord</h1>

    <!-- Cartes de stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white shadow rounded-xl p-6 flex items-center space-x-4">
        <span class="text-3xl">📚</span>
        <div>
          <p class="text-gray-500 text-sm">Cours</p>
          <p class="text-xl font-semibold text-gray-800">6</p>
        </div>
      </div>

      <div class="bg-white shadow rounded-xl p-6 flex items-center space-x-4">
        <span class="text-3xl">👩‍🎓</span>
        <div>
          <p class="text-gray-500 text-sm">Classe</p>
          <p class="text-xl font-semibold text-gray-800">3A Informatique</p>
        </div>
      </div>

      <div class="bg-white shadow rounded-xl p-6 flex items-center space-x-4">
        <span class="text-3xl">📝</span>
        <div>
          <p class="text-gray-500 text-sm">Notes Moyennes</p>
          <p class="text-xl font-semibold text-gray-800">14.5 / 20</p>
        </div>
      </div>
    </div>

    <!-- Annonces -->
    <div class="bg-white shadow rounded-xl p-6">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Dernières annonces</h2>
      <ul class="divide-y divide-gray-200">
        <li class="py-3">
          <p class="text-gray-800 font-medium">Contrôle de mathématique vendredi</p>
          <p class="text-gray-500 text-sm">Publié par Prof. Martin</p>
        </li>
        <li class="py-3">
          <p class="text-gray-800 font-medium">Projet de groupe en développement web</p>
          <p class="text-gray-500 text-sm">Publié par Prof. Ndiaye</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
