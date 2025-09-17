<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">Annonces</h1>

    <div class="grid gap-6 md:grid-cols-2">
      <article
        v-for="a in annonces"
        :key="a.id"
        class="bg-white shadow rounded-xl p-6 hover:shadow-md transition"
      >
        <h2 class="text-lg font-semibold text-gray-800 mb-2">{{ a.titre }}</h2>
        <p class="text-gray-600 mb-4">{{ a.description }}</p>
        <p class="text-sm text-gray-400">Publié le {{ a.date }}</p>
      </article>
    </div>
  </div>
</template>

<script setup>
const annonces = [
  {
    id: 1,
    titre: "Conférence sur l’IA",
    description: "Rejoignez-nous vendredi pour une conférence...",
    date: "12 Sept 2025",
  },
  {
    id: 2,
    titre: "Portes Ouvertes UniSphere",
    description: "Présentation des nouveaux programmes...",
    date: "18 Sept 2025",
  },
];
</script>
