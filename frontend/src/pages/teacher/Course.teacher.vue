<template>
  <div class="space-y-6">
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
      :to="{ name: 'GradesCourse.teacher', params: { id: course.id } }"
      class="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90"
    >
      Gérer les notes
    </router-link>
  </div>
</template>

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
