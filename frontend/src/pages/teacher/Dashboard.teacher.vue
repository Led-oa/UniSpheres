<script setup>
const stats = [
  { label: "Mes Cours", value: 5 },
  { label: "Classes Assignées", value: 3 },
  { label: "Annonces Publiées", value: 8 },
];

const annonces = [
  {
    id: 1,
    title: "Examen final",
    content: "L’examen aura lieu le 20 juin.",
    date: "15 juin",
  },
  { id: 2, title: "Correction TP", content: "Les notes sont publiées.", date: "10 juin" },
];
</script>

<template>
  <div class="space-y-8">
    <!-- Titre -->
    <h1 class="text-2xl font-bold text-gray-800">Tableau de bord Enseignant</h1>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="p-6 rounded-xl shadow bg-white border border-gray-100"
      >
        <p class="text-gray-500 text-sm">{{ stat.label }}</p>
        <p class="text-3xl font-bold text-blue-600 mt-1">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Annonces récentes -->
    <section>
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Dernières annonces</h2>
      <ul class="space-y-4">
        <li
          v-for="a in annonces"
          :key="a.id"
          class="p-4 bg-white rounded-xl shadow border border-gray-100"
        >
          <h3 class="font-medium text-gray-800">{{ a.title }}</h3>
          <p class="text-gray-600 text-sm mt-1">{{ a.content }}</p>
          <p class="text-xs text-gray-400 mt-1">Publié le {{ a.date }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>
