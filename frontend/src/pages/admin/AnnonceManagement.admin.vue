<script setup>
const annonces = [
  { id: 1, title: "Rentrée académique", date: "2025-09-01" },
  { id: 2, title: "Maintenance du système", date: "2025-10-15" },
];
</script>

<template>
  <section class="space-y-8">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des annonces</h1>
      <button
        class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:opacity-90"
      >
        + Nouvelle annonce
      </button>
    </header>

    <ul class="space-y-4">
      <li
        v-for="a in annonces"
        :key="a.id"
        class="p-6 bg-white rounded-xl shadow border border-gray-100 flex items-center justify-between"
      >
        <div>
          <h2 class="font-semibold text-purple-700">{{ a.title }}</h2>
          <p class="text-gray-500 text-sm">Publié le {{ a.date }}</p>
        </div>
        <div class="space-x-2 text-sm">
          <button class="text-blue-600 hover:underline">Modifier</button>
          <button class="text-red-500 hover:underline">Supprimer</button>
        </div>
      </li>
    </ul>
  </section>
</template>
