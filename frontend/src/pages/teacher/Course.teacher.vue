<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useCourseStore } from "../../stores/course.store";
// import ModalUploadCourse from "./ModalUploadCourse.teacher.vue";
import ModalUploadCourseTeacher from "../../components/teacher/ModalUploadCourse.teacher.vue";

const courseStore = useCourseStore();
const route = useRoute();

const isUploadModalOpen = ref(false);
const isLoading = ref(false);

const currentCourse = computed(() => courseStore.currentCourse);
const files = computed(() => currentCourse.value?.files || []);

const courseId = parseInt(route.params.id);

const loadCourse = async () => {
  isLoading.value = true;
  try {
    await courseStore.fetchCourseById(courseId);
  } catch (err) {
    console.error("Erreur chargement cours:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadCourse);

const handleUploaded = () => loadCourse();

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
</script>

<template>
  <div class="px-6 py-8">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
    >
      <div class="flex">
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
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ currentCourse?.title || "Cours" }}
          </h1>
          <p class="mt-2 text-gray-600">Gestion des fichiers du cours</p>
        </div>
      </div>

      <button
        @click="isUploadModalOpen = true"
        class="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Ajouter un fichier
      </button>
    </div>

    <!-- Informations de la matière -->
    <div class="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations du cours</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <span class="text-sm text-gray-600 block mb-1">Identifiant :</span>
            <p class="font-medium text-gray-900">{{ currentCourse?.id_course }}</p>
          </div>
          <div>
            <span class="text-sm text-gray-600 block mb-1">Titre :</span>
            <p class="font-medium text-gray-900">{{ currentCourse?.title }}</p>
          </div>
          <div>
            <span class="text-sm text-gray-600 block mb-1">Durée :</span>
            <p class="font-medium text-gray-900">
              {{ currentCourse?.duration ? currentCourse.duration + " heures" : "—" }}
            </p>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <span class="text-sm text-gray-600 block mb-1">Description :</span>
            <p class="text-gray-900">{{ currentCourse?.content }}</p>
          </div>
          <div>
            <span class="text-sm text-gray-600 block mb-1">Classe associée :</span>
            <div class="flex flex-wrap gap-2">
              <span
                v-if="currentCourse?.class_name"
                class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                {{ currentCourse.class_name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des fichiers -->
    <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900">Fichiers du cours</h2>
        <span class="text-sm text-white p-2 bg-blue-400 rounded-full">
          {{ files.length }} fichiers
        </span>
      </div>

      <div v-if="files.length" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fichier
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Taille
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ajouté le
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="f in files" :key="f.id_file" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-lg mr-3">📄</span>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ f.file_name }}</p>
                    <p class="text-xs text-gray-500">{{ f.file_type?.toUpperCase() }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ (f.file_size / 1024 / 1024).toFixed(2) }} MB
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(f.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a
                  :href="f.file_path"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                  title="Télécharger"
                >
                  ⬇️
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- État vide -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">📁</div>
        <h3 class="text-lg font-semibold text-gray-600 mb-2">Aucun fichier</h3>
        <p class="text-gray-500">Aucun fichier n'a encore été ajouté à ce cours.</p>
      </div>
    </div>

    <!-- Modal Upload -->
    <ModalUploadCourseTeacher
      :course-id="courseId"
      :is-open="isUploadModalOpen"
      @close="isUploadModalOpen = false"
      @uploaded="handleUploaded"
    />
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.border-dashed:hover {
  border-color: #3b82f6;
  background-color: #f8fafc;
}
</style>
