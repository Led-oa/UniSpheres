<script setup>
const stats = [
  { label: "Utilisateurs", value: 342, icon: "👥", color: "from-blue-500 to-purple-500" },
  { label: "Cours", value: 78, icon: "📚", color: "from-purple-500 to-pink-500" },
  { label: "Classes", value: 25, icon: "🏫", color: "from-green-500 to-teal-500" },
  { label: "Annonces", value: 12, icon: "📢", color: "from-orange-500 to-red-500" },
];
</script>

<template>
  <section class="space-y-8">
    <header>
      <h1 class="text-2xl font-bold text-gray-800">Tableau de bord</h1>
      <p class="text-gray-500 text-sm mt-1">
        Vue d’ensemble des données administratives.
      </p>
    </header>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="item in stats"
        :key="item.label"
        class="p-6 rounded-xl shadow bg-gradient-to-br text-white"
        :class="item.color"
      >
        <div class="text-3xl">{{ item.icon }}</div>
        <p class="mt-2 text-2xl font-bold">{{ item.value }}</p>
        <p class="text-sm">{{ item.label }}</p>
      </div>
    </div>
  </section>
</template>
