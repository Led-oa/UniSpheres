<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  isOpen: Boolean,
  annonce: Object,
});

const emit = defineEmits(["close"]);

// Computed properties
const modalTitle = computed(() => {
  return props.annonce ? "Détails de l'annonce" : "Annonce";
});

// Fonction pour formater la date
const formatDate = (dateString) => {
  if (!dateString) return "Date inconnue";
  const date = new Date(dateString);
  if (isNaN(date)) return "Date invalide";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Fonction pour calculer le temps écoulé
const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "À l'instant";
  if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`;

  const diffInMonths = Math.floor(diffInDays / 30);
  return `Il y a ${diffInMonths} mois${diffInMonths > 1 ? "" : ""}`;
};

// Configuration pour les types et priorités
const getTypeConfig = (type) => {
  const configs = {
    general: {
      label: "Général",
      class: "bg-blue-50 text-blue-700 border-blue-200",
      icon: "📢",
    },
    cours: {
      label: "Cours",
      class: "bg-purple-50 text-purple-700 border-purple-200",
      icon: "📚",
    },
    evenement: {
      label: "Événement",
      class: "bg-orange-50 text-orange-700 border-orange-200",
      icon: "🎯",
    },
  };
  return (
    configs[type] || {
      label: "Annonce",
      class: "bg-gray-50 text-gray-700 border-gray-200",
      icon: "📋",
    }
  );
};

const getPriorityConfig = (priority) => {
  const configs = {
    high: {
      label: "Priorité haute",
      class: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    },
    medium: {
      label: "Priorité moyenne",
      class: "bg-yellow-50 text-yellow-700 border-yellow-200",
      dot: "bg-yellow-500",
    },
    low: {
      label: "Priorité basse",
      class: "bg-green-50 text-green-700 border-green-200",
      dot: "bg-green-500",
    },
  };
  return (
    configs[priority] || {
      label: "Priorité standard",
      class: "bg-gray-50 text-gray-700 border-gray-200",
      dot: "bg-gray-500",
    }
  );
};

// Fonction pour télécharger un fichier
const downloadFile = (file) => {
  if (!file?.file_path) {
    console.error("Chemin de fichier manquant");
    alert("Erreur: Chemin de fichier manquant");
    return;
  }
  window.open(file.file_path, "_blank");
};

// Fonction pour visualiser un fichier
const viewFile = (file) => {
  if (!file?.file_path) {
    console.error("Chemin de fichier manquant");
    alert("Erreur: Chemin de fichier manquant");
    return;
  }
  window.open(file.file_path, "_blank");
};

// Fonction pour obtenir l'icône du fichier
const getFileIcon = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();

  const icons = {
    pdf: "📄",
    doc: "📝",
    docx: "📝",
    xls: "📊",
    xlsx: "📊",
    txt: "📃",
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    gif: "🖼️",
    zip: "📦",
    rar: "📦",
  };

  return icons[extension] || "📎";
};

const handleClose = () => {
  emit("close");
};

// Fonction utilitaire pour formater la taille des fichiers
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Debug: Afficher les chemins de fichiers
watch(
  () => props.annonce,
  (newAnnonce) => {
    if (newAnnonce?.files) {
      console.log("=== DEBUG: Analyse des chemins de fichiers ===");
      newAnnonce.files.forEach((file, index) => {
        console.log(`Fichier ${index + 1}:`);
        console.log("  - Chemin original:", file.file_path);
        console.log("  - Nom du fichier:", file.file_name);
        console.log("  - URL utilisée:", file.file_path);
      });
      console.log("=============================================");
    }
  },
  { immediate: true }
);
</script>

<template>
  <transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      @click.self="handleClose"
    >
      <!-- Container of the modal -->
      <div
        class="bg-white rounded-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <!-- Header of the modal -->
        <div
          class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-900 to-indigo-800"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <span class="text-white text-sm">📢</span>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-white">
                {{ modalTitle }}
              </h2>
              <p class="text-white/80 text-sm">Informations détaillées</p>
            </div>
          </div>
          <button
            @click="handleClose"
            class="text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Body of the modal -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="annonce" class="p-6 space-y-6">
            <!-- En-tête de l'annonce -->
            <div class="space-y-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h1 class="text-2xl font-bold text-gray-900 leading-tight">
                    {{ annonce.title }}
                  </h1>

                  <!-- Badges type et priorité -->
                  <div class="flex flex-wrap items-center gap-2 mt-3">
                    <span
                      class="px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1"
                      :class="getTypeConfig(annonce.type).class"
                    >
                      <span>{{ getTypeConfig(annonce.type).icon }}</span>
                      {{ getTypeConfig(annonce.type).label }}
                    </span>
                    <span
                      class="px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1"
                      :class="getPriorityConfig(annonce.priority).class"
                    >
                      <span
                        class="w-2 h-2 rounded-full"
                        :class="getPriorityConfig(annonce.priority).dot"
                      ></span>
                      {{ getPriorityConfig(annonce.priority).label }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Métadonnées -->
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div class="flex items-center gap-2">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span
                    >{{ annonce.posted_by_name }} {{ annonce.posted_by_lastname }}</span
                  >
                </div>

                <div class="flex items-center gap-2">
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
                  <span>{{ formatDate(annonce.created_at) }}</span>
                </div>

                <div v-if="annonce.views" class="flex items-center gap-2">
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>{{ annonce.views }} vues</span>
                </div>
              </div>
            </div>

            <!-- Contenu principal -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Contenu de l'annonce -->
              <div class="lg:col-span-2">
                <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3
                    class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
                  >
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
                    Contenu de l'annonce
                  </h3>
                  <div class="prose prose-gray max-w-none">
                    <p
                      class="text-gray-700 whitespace-pre-wrap leading-relaxed text-base"
                    >
                      {{ annonce.content }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Informations complémentaires -->
              <div class="space-y-6">
                <!-- Informations générales -->
                <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3
                    class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
                  >
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
                    Informations
                  </h3>

                  <div class="space-y-4">
                    <div>
                      <p class="text-sm font-medium text-gray-600 mb-1">Auteur</p>
                      <p class="text-gray-900 font-medium">
                        {{ annonce.posted_by_name }} {{ annonce.posted_by_lastname }}
                      </p>
                    </div>

                    <div>
                      <p class="text-sm font-medium text-gray-600 mb-1">
                        Date de publication
                      </p>
                      <p class="text-gray-900">{{ formatDate(annonce.created_at) }}</p>
                    </div>

                    <!-- Public cible -->
                    <div
                      v-if="
                        annonce.class_name || annonce.filiere_name || annonce.year_value
                      "
                    >
                      <p class="text-sm font-medium text-gray-600 mb-2">Public cible</p>
                      <div class="space-y-2">
                        <div
                          v-if="annonce.class_name"
                          class="flex items-center gap-2 text-sm"
                        >
                          <svg
                            class="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <span class="text-gray-700">{{ annonce.class_name }}</span>
                        </div>
                        <div
                          v-if="annonce.filiere_name"
                          class="flex items-center gap-2 text-sm"
                        >
                          <svg
                            class="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 14l9-5-9-5-9 5 9 5z"
                            />
                          </svg>
                          <span class="text-gray-700">{{ annonce.filiere_name }}</span>
                        </div>
                        <div
                          v-if="annonce.year_value"
                          class="flex items-center gap-2 text-sm"
                        >
                          <svg
                            class="w-4 h-4 text-gray-400"
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
                          <span class="text-gray-700">{{ annonce.year_value }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Fichiers joints -->
                <div
                  v-if="annonce.files && annonce.files.length > 0"
                  class="bg-gray-50 rounded-xl p-6 border border-gray-200"
                >
                  <h3
                    class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
                  >
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
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    Fichiers joints
                    <span class="text-sm font-normal text-gray-500"
                      >({{ annonce.files.length }})</span
                    >
                  </h3>
                  <div class="space-y-3">
                    <div
                      v-for="file in annonce.files"
                      :key="file.id_file"
                      class="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all cursor-pointer group"
                      @click="viewFile(file)"
                    >
                      <div
                        class="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors"
                      >
                        <span class="text-lg">{{ getFileIcon(file.file_name) }}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ file.file_name }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{
                            file.file_size
                              ? formatFileSize(file.file_size)
                              : "Taille inconnue"
                          }}
                        </p>
                      </div>
                      <div
                        class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <button
                          @click.stop="viewFile(file)"
                          class="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Voir le fichier"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          @click.stop="downloadFile(file)"
                          class="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Télécharger"
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
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
              <button
                @click="handleClose"
                class="flex items-center gap-2 px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Fermer
              </button>
            </div>
          </div>

          <!-- État vide -->
          <div v-else class="text-center py-12">
            <div class="text-gray-300 text-6xl mb-4">📭</div>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">
              Aucune annonce sélectionnée
            </h3>
            <p class="text-gray-500">Sélectionnez une annonce pour voir ses détails.</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
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

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
