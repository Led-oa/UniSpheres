<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../../stores/auth.store";
import { useCourseStore } from "../../stores/course.store";

const authStore = useAuthStore();
const courseStore = useCourseStore();

const courses = ref([]);
const isLoading = ref(false);
const error = ref(null);

const loadCourses = async () => {
  try {
    isLoading.value = true;

    // S'assurer que l'utilisateur est chargé
    if (!authStore.user) {
      await authStore.fetchUserData();
    }

    const classId = authStore.user?.class_id;
    if (!classId) throw new Error("Aucune classe associée à votre compte.");

    // Récupérer les cours de la classe
    const res = await courseStore.fetchCoursesByClass(classId);
    // L’API peut renvoyer { success, data: [...] }
    console.log("Composant fetch course for classe : ", res.data);
    courses.value = res.data || [];
    console.log("Composant fetch course for classe : ", courses.value[0].credits);
  } catch (err) {
    console.error("Erreur lors du chargement des cours :", err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
};

const courseCount = computed(() => courses.value.length);

onMounted(loadCourses);
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <!-- En-tête -->
    <div class="mb-10 text-center">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Mes Cours</h1>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Consultez tous les cours associés à votre classe
      </p>
      <div
        class="w-20 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"
      ></div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
      <div class="relative">
        <div class="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
        <div
          class="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
      <p class="mt-4 text-gray-600 font-medium">Chargement de vos cours...</p>
    </div>

    <!-- Erreur -->
    <div
      v-else-if="error"
      class="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm mb-6 max-w-3xl mx-auto"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg
            class="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-red-800 font-medium text-lg">Erreur de chargement</h3>
          <p class="text-red-700 mt-1">
            {{ error.message || "Impossible de charger les cours." }}
          </p>
          <button
            @click="loadCourses"
            class="mt-3 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>

    <!-- Aucun cours -->
    <div
      v-else-if="!courses.length"
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto text-center"
    >
      <div
        class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <h3 class="text-xl font-medium text-gray-700 mb-2">Aucun cours disponible</h3>
      <p class="text-gray-500 mb-4">
        Aucun cours n'est actuellement associé à votre classe.
      </p>
      <button
        @click="loadCourses"
        class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Actualiser
      </button>
    </div>

    <!-- Liste des cours -->
    <div v-else>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          <span class="text-blue-600">{{ courseCount }}</span> cours disponibles
        </h2>
        <div class="flex items-center space-x-2 text-sm text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Cliquez sur un cours pour accéder au détail</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="course in courses"
          :key="course.id_course || course.id"
          :to="{ name: 'CoursEtudiant', params: { id: course.id_course } }"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:border-blue-100 group"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1 min-w-0">
                <h2
                  class="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate"
                >
                  {{ course.title }}
                </h2>
                <p class="text-sm text-gray-500 mt-1">
                  Code: {{ course.id_course || "N/A" }}
                </p>
              </div>
              <div class="flex-shrink-0 ml-4">
                <div
                  class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl"
                >
                  {{ course.icon || "📘" }}
                </div>
              </div>
            </div>

            <div class="space-y-3 mt-5">
              <div class="flex items-center text-sm text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span class="truncate">
                  {{ course.teacher_name || "—" }} {{ course.teacher_lastname || "—" }}
                </span>
              </div>

              <div class="flex items-center text-sm text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Durée: {{ course.duration || "N/A" }} heures</span>
              </div>
            </div>

            <div
              class="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center"
            >
              <span
                class="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
              >
                {{ course.credits || "N/A" }} crédits
              </span>
              <span
                class="text-blue-600 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform"
              >
                Voir le cours
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
