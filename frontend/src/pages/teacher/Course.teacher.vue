<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useCourseStore } from "../../stores/course.store";
import { useFileStore } from "../../stores/file.store";
import ModalUploadCourseTeacher from "../../components/teacher/ModalUploadCourse.teacher.vue";
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from "@headlessui/vue";

const courseStore = useCourseStore();
const fileStore = useFileStore();
const route = useRoute();

const isUploadModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isLoading = ref(false);
const fileToDelete = ref(null);

const currentCourse = computed(() => courseStore.currentCourse);
const files = computed(() => currentCourse.value?.files || []);

const courseId = parseInt(route.params.id);

// Fonction pour récupérer la taille du fichier via une requête HEAD
const getFileSize = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl, { method: "HEAD" });
    if (response.ok) {
      const contentLength = response.headers.get("content-length");
      return contentLength ? parseInt(contentLength) : 0;
    }
    return 0;
  } catch (error) {
    console.error("Erreur lors de la récupération de la taille du fichier:", error);
    return 0;
  }
};

// État pour stocker les tailles des fichiers
const fileSizes = ref({});

// Charger les tailles des fichiers
const loadFileSizes = async () => {
  if (files.value.length === 0) return;

  for (const file of files.value) {
    if (file.file_path && !fileSizes.value[file.id_file]) {
      const size = await getFileSize(file.file_path);
      fileSizes.value[file.id_file] = size;
    }
  }
};

// Formater la taille en format lisible
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const loadCourse = async () => {
  isLoading.value = true;
  try {
    await courseStore.fetchCourseById(courseId);
    // Charger les tailles après le chargement du cours
    await loadFileSizes();
  } catch (err) {
    console.error("Erreur chargement cours:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadCourse);

const handleUploaded = () => {
  loadCourse();
  // Réinitialiser les tailles pour recharger les nouvelles
  fileSizes.value = {};
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Obtenir l'icône selon le type de fichier
const getFileIcon = (fileName) => {
  const extension = fileName?.split(".").pop()?.toLowerCase() || "";

  const iconMap = {
    pdf: "📄",
    doc: "📝",
    docx: "📝",
    xls: "📊",
    xlsx: "📊",
    ppt: "📽️",
    pptx: "📽️",
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    gif: "🖼️",
    zip: "📦",
    rar: "📦",
    txt: "📃",
    mp4: "🎬",
    mp3: "🎵",
  };

  return iconMap[extension] || "📎";
};

// Gestion de la suppression de fichier
const openDeleteModal = (file) => {
  fileToDelete.value = file;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  fileToDelete.value = null;
};

const confirmDelete = async () => {
  if (!fileToDelete.value) return;

  try {
    // await courseStore.deleteCourseFile(fileToDelete.value.id_file);

    console.log("Suppression du : ", fileToDelete.value.id_file);

    await fileStore.removeFile(fileToDelete.value.id_file);
    // Recharger la liste des fichiers
    await loadCourse();
    closeDeleteModal();
  } catch (error) {
    console.error("Erreur lors de la suppression du fichier:", error);
    closeDeleteModal();
  }
};
</script>

<template>
  <div class="px-6 py-8">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.back()"
          class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        class="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Ajouter un fichier</span>
      </button>
    </div>

    <!-- Informations de la matière -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Informations du cours
      </h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Identifiant</p>
            <p class="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
              {{ currentCourse?.id_course }}
            </p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Titre</p>
            <p class="font-medium text-gray-900">{{ currentCourse?.title }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Durée</p>
            <p class="font-medium text-gray-900">
              {{ currentCourse?.duration ? currentCourse.duration + " heures" : "—" }}
            </p>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Description</p>
            <p class="text-gray-900 leading-relaxed">{{ currentCourse?.content }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Classe associée</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-if="currentCourse?.class_name"
                class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full border border-blue-200"
              >
                {{ currentCourse.class_name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des fichiers -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- En-tête de section -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Fichiers du cours
        </h2>
        <span class="text-sm text-white bg-blue-600 px-3 py-1 rounded-full font-medium">
          {{ files.length }} fichier{{ files.length > 1 ? "s" : "" }}
        </span>
      </div>

      <!-- Contenu -->
      <div class="p-6">
        <!-- Loader -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="flex items-center space-x-3">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
            ></div>
            <span class="text-gray-600">Chargement des fichiers...</span>
          </div>
        </div>

        <!-- État vide -->
        <div v-else-if="files.length === 0" class="text-center py-12">
          <div
            class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucun fichier</h3>
          <p class="text-gray-600 mb-4">
            Aucun fichier n'a encore été ajouté à ce cours.
          </p>
          <button
            @click="isUploadModalOpen = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Ajouter le premier fichier
          </button>
        </div>

        <!-- Liste des fichiers -->
        <div v-else class="space-y-4">
          <div
            v-for="f in files"
            :key="f.id_file"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all group"
          >
            <div class="flex items-center space-x-4 flex-1 min-w-0">
              <div
                class="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200"
              >
                <span class="text-2xl">{{ getFileIcon(f.file_name) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ f.file_name }}
                </p>
                <div class="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <span class="flex items-center space-x-1">
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{{ formatDate(f.created_at) }}</span>
                  </span>
                  <span class="flex items-center space-x-1">
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                    <span>{{ formatFileSize(fileSizes[f.id_file]) }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <a
                :href="f.file_path"
                target="_blank"
                class="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                title="Télécharger le fichier"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Télécharger</span>
              </a>

              <button
                @click="openDeleteModal(f)"
                class="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                title="Supprimer le fichier"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Upload -->
    <ModalUploadCourseTeacher
      :course-id="courseId"
      :is-open="isUploadModalOpen"
      @close="isUploadModalOpen = false"
      @uploaded="handleUploaded"
    />

    <!-- Modal de confirmation de suppression -->
    <Dialog :open="isDeleteModalOpen" @close="closeDeleteModal" class="relative z-50">
      <div
        class="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          class="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 transform"
        >
          <div class="text-center">
            <!-- Icône d'alerte -->
            <div
              class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4"
            >
              <svg
                class="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <DialogTitle class="text-xl font-semibold text-gray-900 mb-2">
              Confirmer la suppression
            </DialogTitle>

            <DialogDescription class="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer le fichier
              <strong class="text-gray-900">"{{ fileToDelete?.file_name }}"</strong> ?
              <br />
              <span class="text-sm text-gray-500">Cette action est irréversible.</span>
            </DialogDescription>

            <div class="flex gap-3 justify-center">
              <button
                @click="closeDeleteModal"
                class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Annuler
              </button>
              <button
                @click="confirmDelete"
                class="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
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

/* Animation pour les nouvelles entrées */
.file-enter-active {
  transition: all 0.3s ease-in-out;
}

.file-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

/* Animation pour le modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
