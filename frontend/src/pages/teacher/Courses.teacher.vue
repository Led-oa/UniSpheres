<script setup>
const courses = [
  {
    id: 1,
    title: "Mathématiques Avancées",
    description: "Algèbre et analyse approfondie.",
    className: "Terminale A",
  },
  {
    id: 2,
    title: "Physique",
    description: "Mécanique et électricité appliquées.",
    className: "1ère S",
  },
  {
    id: 3,
    title: "Informatique",
    description: "Introduction au développement web.",
    className: "Licence 1",
  },
];
</script>

<template>
  <section class="space-y-8">
    <header>
      <h1 class="text-2xl font-bold text-gray-800">Mes Cours</h1>
      <p class="text-gray-500 text-sm mt-1">Cours dont vous êtes titulaire.</p>
    </header>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="course in courses"
        :key="course.id"
        class="group p-6 bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 transition flex flex-col"
      >
        <h2 class="text-lg font-semibold text-blue-700 group-hover:text-blue-800">
          {{ course.title }}
        </h2>
        <p class="text-gray-600 mt-2 flex-1 text-sm">{{ course.description }}</p>

        <div class="mt-4 flex justify-between items-center text-sm text-gray-500">
          <span>Classe : {{ course.className }}</span>
          <router-link
            :to="{ name: 'CoursEnseignant', params: { id: course.id } }"
            class="text-blue-600 hover:text-blue-700 hover:underline font-medium"
          >
            Détails →
          </router-link>
          <router-link
            :to="{ name: 'NoterCoursEnseignant', params: { id: course.id } }"
            class="text-blue-600 hover:text-blue-700 hover:underline font-medium"
          >
            Attribuer notes →
          </router-link>
        </div>
      </article>
    </div>
  </section>
</template>
