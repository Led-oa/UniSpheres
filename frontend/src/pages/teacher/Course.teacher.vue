<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCourseStore } from "../../stores/course.store";

const route = useRoute();
const courseStore = useCourseStore();

const courseId = route.params.id;
const course = ref(null);
const loading = ref(false);

// Charger le cours par son id
const loadCourse = async () => {
  loading.value = true;
  try {
    const data = await courseStore.fetchCourseById(courseId);
    // On suppose que fetchCourseById renvoie un tableau avec 1 élément
    console.log("Response course composant : ", data.data);

    course.value = data.data || null;
  } catch (err) {
    console.error("Erreur chargement cours :", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCourse();
});
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

    <div v-if="loading" class="text-gray-500">Chargement du cours...</div>

    <div v-else-if="course">
      <h1 class="text-2xl font-bold text-gray-800">Cours : {{ course.title }}</h1>

      <div class="bg-white p-6 rounded-xl shadow border border-gray-100 space-y-2">
        <p class="text-gray-700 mb-2">{{ course.content }}</p>
        <p class="text-gray-600"><strong>Classe :</strong> {{ course.class_name }}</p>
        <p class="text-gray-600">
          <strong>Enseignant :</strong> {{ course.teacher_name }}
          {{ course.teacher_lastname }}
        </p>
        <p class="text-gray-600">
          <strong>Filière :</strong> {{ course.filiere_name }},
          <strong>Parcours :</strong> {{ course.parcours_name }}
        </p>
        <p class="text-gray-600"><strong>Année :</strong> {{ course.year_value }}</p>
      </div>

      <!-- Fichiers associés -->
      <div
        v-if="course.file_name"
        class="bg-white p-6 rounded-xl shadow border border-gray-100 mt-4"
      >
        <h2 class="font-semibold text-gray-700 mb-2">Fichiers associés :</h2>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li v-for="f in course.files || [course]" :key="f.id_file">
            <a :href="f.file_path" target="_blank" class="text-blue-600 hover:underline">
              {{ f.file_name }}
            </a>
          </li>
        </ul>
      </div>

      <router-link
        :to="{ name: 'NoterCoursEnseignant', params: { id: course.id_course } }"
        class="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90"
      >
        Gérer les notes
      </router-link>
    </div>

    <div v-else class="text-red-500">Cours introuvable.</div>
  </div>
</template>
