<script setup>
const classes = [
  { id: 1, name: "Terminale A", students: 30, courses: ["Maths", "Physique"] },
  { id: 2, name: "1ère S", students: 28, courses: ["Physique"] },
  { id: 3, name: "Licence 1", students: 45, courses: ["Informatique"] },
];
</script>

<template>
  <section class="space-y-8">
    <header>
      <h1 class="text-2xl font-bold text-gray-800">Mes Classes</h1>
      <p class="text-gray-500 text-sm mt-1">
        Liste des classes où vous enseignez au moins un cours.
      </p>
    </header>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="cl in classes"
        :key="cl.id"
        class="group p-6 bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 transition"
      >
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-semibold text-purple-700 group-hover:text-purple-800">
            {{ cl.name }}
          </h2>
          <span class="text-sm text-gray-500">{{ cl.students }} élèves</span>
        </div>

        <p class="text-gray-600 text-sm flex-1">
          Cours enseignés : {{ cl.courses.join(", ") }}
        </p>

        <router-link
          :to="{ name: 'NotesClasseEnseignant', params: { idClasse: cl.id } }"
          class="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Voir notes →
        </router-link>
        <router-link
          :to="{ name: 'ListeEtudiantEnseignant', params: { idClasse: cl.id } }"
          class="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Voir étudiants →
        </router-link>
      </article>
    </div>
  </section>
</template>
