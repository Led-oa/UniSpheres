<!-- src/pages/student/Course.student.vue -->
<script setup>
import { onMounted, computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useCourseStore } from "../../stores/course.store";

import ModalNotesStudent from "../../components/student/ModalNotes.student.vue";

// --- Stores & route ---
const route = useRoute();
const courseStore = useCourseStore();
const isLoading = ref(true);

// --- Récupération du cours en fonction de l'ID dans l'URL ---
const courseId = route.params.id;

onMounted(async () => {
  try {
    // Appelle la méthode du store pour charger le cours
    await courseStore.fetchCourseById(courseId);
  } catch (error) {
    console.error("Erreur lors du chargement du cours:", error);
  } finally {
    isLoading.value = false;
  }
});

// Raccourcis réactifs
const course = computed(() => courseStore.currentCourse);
const files = computed(() => courseStore.currentCourse.files || []);

// --- Modal Notes ---
const showModalNotes = ref(false);
function openModalNotes() {
  showModalNotes.value = true;
}
function closeModalNotes() {
  showModalNotes.value = false;
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Indicateur de chargement -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
      <div class="relative">
        <div class="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
        <div
          class="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
      <p class="mt-4 text-gray-600 font-medium">Chargement du cours...</p>
    </div>

    <!-- Contenu principal -->
    <div v-else-if="course" class="space-y-8">
      <!-- 1. En-tête du cours -->
      <section
        class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg overflow-hidden text-white"
      >
        <div class="p-8">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h1 class="text-3xl font-bold mb-4">{{ course.title }}</h1>
              <p class="text-blue-100 opacity-90 max-w-2xl">
                {{ course.content || "Aucune description disponible" }}
              </p>
            </div>
            <div
              class="hidden md:flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-lg text-2xl ml-6"
            >
              {{ course.icon || "📚" }}
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Informations détaillées -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Professeur -->
        <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div class="flex items-center mb-4">
            <div
              class="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-purple-600"
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
            </div>
            <h3 class="ml-3 text-sm font-medium text-gray-900">Enseignant</h3>
          </div>
          <p class="text-lg font-semibold text-gray-800">
            {{ course.teacher_lastname || "Non spécifié" }}
            {{ course.teacher_name || "Non spécifié" }}
          </p>
        </div>

        <!-- Horaire -->
        <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div class="flex items-center mb-4">
            <div
              class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-blue-600"
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
            </div>
            <h3 class="ml-3 text-sm font-medium text-gray-900">Horaires</h3>
          </div>
          <p class="text-lg font-semibold text-gray-800">
            {{ course.duration || "Non spécifié" }} heures
          </p>
        </div>

        <!-- Code du cours -->
        <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div class="flex items-center mb-4">
            <div
              class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h3 class="ml-3 text-sm font-medium text-gray-900">Credits</h3>
          </div>
          <p class="text-lg font-semibold text-gray-800">
            {{ course.credits || "N/A" }}
          </p>
        </div>
      </div>

      <!-- 3. Fichiers associés -->
      <section
        v-if="files.length"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div class="px-6 py-5 border-b border-gray-100">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Fichiers du cours
            <span class="ml-2 text-sm font-normal text-gray-500"
              >({{ files.length }})</span
            >
          </h2>
        </div>
        <div class="p-6">
          <ul class="space-y-4">
            <li
              v-for="file in files"
              :key="file.id_file"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-800">{{ file.file_name }}</p>
                  <p class="text-sm text-gray-500">
                    Ajouté le
                    {{
                      new Date(file.created_at).toLocaleDateString() || "Date inconnue"
                    }}
                  </p>
                </div>
              </div>
              <a
                :href="file.file_path"
                class="flex items-center px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                download
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Télécharger
              </a>
            </li>
          </ul>
        </div>
      </section>

      <!-- Message si aucun fichier -->
      <section
        v-else
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-700 mb-2">Aucun fichier disponible</h3>
        <p class="text-gray-500">
          Aucun fichier n'a été partagé pour ce cours pour le moment.
        </p>
      </section>

      <!-- 4. Bouton modal (future implémentation) -->
      <section class="flex justify-end">
        <button
          @click="openModalNotes"
          class="inline-flex items-center px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m7 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Voir notes des étudiants
        </button>
      </section>
    </div>

    <!-- Message si cours non trouvé -->
    <div
      v-else
      class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
    >
      <div
        class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-red-500"
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
      <h3 class="text-xl font-medium text-gray-800 mb-2">Cours non trouvé</h3>
      <p class="text-gray-600">
        Le cours que vous recherchez n'existe pas ou n'est plus disponible.
      </p>
    </div>
    <!-- Modal Notes -->
    <ModalNotesStudent
      v-if="showModalNotes"
      :courseId="course.id_course"
      :onClose="closeModalNotes"
    />
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
