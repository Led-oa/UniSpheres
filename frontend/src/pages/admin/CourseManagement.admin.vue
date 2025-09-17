<script setup>
const courses = [
  {
    id: 1,
    title: "Mathématiques Avancées",
    teacher: "M. Dupont",
    className: "Terminale A",
  },
  {
    id: 2,
    title: "Physique",
    teacher: "Mme Leroy",
    className: "1ère S",
  },
];
</script>

<template>
  <section class="space-y-8">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des cours</h1>
      <button
        class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:opacity-90"
      >
        + Nouveau cours
      </button>
    </header>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="c in courses"
        :key="c.id"
        class="p-6 bg-white rounded-xl shadow border border-gray-100 flex flex-col"
      >
        <h2 class="text-lg font-semibold text-blue-700">{{ c.title }}</h2>
        <p class="text-gray-600 mt-1 flex-1">Classe : {{ c.className }}</p>
        <p class="text-sm text-gray-500">Enseignant : {{ c.teacher }}</p>
        <div class="mt-4 flex justify-end space-x-2 text-sm">
          <button class="text-blue-600 hover:underline">Modifier</button>
          <button class="text-red-500 hover:underline">Supprimer</button>
        </div>
      </article>
    </div>
  </section>
</template>
