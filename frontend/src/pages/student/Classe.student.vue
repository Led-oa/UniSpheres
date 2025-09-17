<script setup>
const students = ["Alice Dupuis", "Benoît Laurent", "Carla Moreau", "David Rossi"];
</script>
<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">Ma Classe</h1>

    <!-- Détails de la classe -->
    <div class="bg-white shadow rounded-xl p-6 space-y-4">
      <div class="flex items-center space-x-4">
        <span class="text-3xl">🏫</span>
        <div>
          <p class="text-gray-600">Nom de la classe</p>
          <p class="text-lg font-semibold text-gray-800">3A Informatique</p>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="text-3xl">👨‍🏫</span>
        <div>
          <p class="text-gray-600">Professeur Principal</p>
          <p class="text-lg font-semibold text-gray-800">Pr. Jean Dupont</p>
        </div>
      </div>
    </div>

    <!-- Liste des étudiants -->
    <div class="bg-white shadow rounded-xl p-6">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Étudiants</h2>
      <ul class="divide-y divide-gray-200">
        <li
          v-for="student in students"
          :key="student"
          class="py-3 flex items-center space-x-3"
        >
          <span class="text-xl">👤</span>
          <span class="text-gray-800">{{ student }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped></style>
