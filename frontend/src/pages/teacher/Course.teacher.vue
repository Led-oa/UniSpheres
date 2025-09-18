<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const course = {
  id: route.params.id || 1,
  title: "Mathématiques Avancées",
  description: "Cours approfondi d’algèbre et analyse.",
  className: "Terminale A",
  teacher: "Mr. Dupuis",
  studentsCount: 30,
};
</script>
<template>
  <div class="space-y-6">
    <button @click="$router.back()" class="p-2 rounded-lg hover:bg-gray-100">
      <svg
        class="w-5 h-5 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
    <h1 class="text-2xl font-bold text-gray-800">Cours : {{ course.title }}</h1>

    <div class="bg-white p-6 rounded-xl shadow border border-gray-100">
      <p class="text-gray-700 mb-4">{{ course.description }}</p>
      <p class="text-gray-600"><strong>Classe :</strong> {{ course.className }}</p>
      <p class="text-gray-600"><strong>Enseignant :</strong> {{ course.teacher }}</p>
      <p class="text-gray-600">
        <strong>Nombre d’étudiants :</strong> {{ course.studentsCount }}
      </p>
    </div>

    <router-link
      :to="{ name: 'NoterCoursEnseignant', params: { id: course.id } }"
      class="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90"
    >
      Gérer les notes
    </router-link>
  </div>
</template>
