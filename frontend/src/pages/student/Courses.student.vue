<script setup>
const courses = [
  {
    id: 1,
    name: "Mathématiques Avancées",
    teacher: "Pr. Martin",
    icon: "➗",
    schedule: "Lundi 10h-12h",
  },
  {
    id: 2,
    name: "Développement Web",
    teacher: "Pr. Ndiaye",
    icon: "💻",
    schedule: "Mercredi 14h-16h",
  },
  {
    id: 3,
    name: "Base de Données",
    teacher: "Pr. Silva",
    icon: "🗄️",
    schedule: "Vendredi 8h-10h",
  },
];
</script>
<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">Mes Cours</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="course in courses"
        :key="course.id"
        class="bg-white shadow hover:shadow-md rounded-xl p-5 cursor-pointer transition"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">{{ course.name }}</h2>
          <span class="text-2xl">{{ course.icon }}</span>
        </div>
        <p class="text-gray-600 text-sm">Professeur : {{ course.teacher }}</p>
        <p class="text-gray-500 text-xs mt-2">{{ course.schedule }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
