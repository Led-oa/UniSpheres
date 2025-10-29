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

// Déterminer la couleur et l'icône en fonction du type d'annonce
const getAnnonceStyle = (annonce) => {
  if (annonce.priority === "high") {
    return {
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-200",
      icon: "⚠️",
      badge: "Important",
    };
  }

  if (annonce.type === "cours") {
    return {
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
      icon: "📚",
      badge: "Cours",
    };
  }

  return {
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-200",
    icon: "🎉",
    badge: "Événement",
  };
};

// Fonction pour télécharger un fichier (utilise directement l'URL du backend)
const downloadFile = (file) => {
  if (!file?.file_path) {
    console.error("Chemin de fichier manquant");
    alert("Erreur: Chemin de fichier manquant");
    return;
  }
  console.log("Téléchargement du fichier:", file.file_path);
  window.open(file.file_path, "_blank");
};

// Fonction pour visualiser un fichier (ouvrir dans un nouvel onglet)
const viewFile = (file) => {
  if (!file?.file_path) {
    console.error("Chemin de fichier manquant");
    alert("Erreur: Chemin de fichier manquant");
    return;
  }

  console.log("Ouverture du fichier:", file.file_path);
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
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="handleClose"
    >
      <!-- Container of the modal -->
      <div
        class="bg-white rounded-lg w-full max-w-4xl mx-auto max-h-[90vh] overflow-hidden flex flex-col shadow-xl"
      >
        <!-- Header of the modal -->
        <div
          class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl text-white">📢</span>
            <h2 class="text-lg font-semibold text-white">
              {{ modalTitle }}
            </h2>
          </div>
          <button
            @click="handleClose"
            class="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white hover:bg-opacity-10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <!-- Title of the annonce -->
            <div class="space-y-3">
              <h1 class="text-2xl font-bold text-gray-900">{{ annonce.title }}</h1>
              <div class="flex items-center gap-4 text-sm text-gray-600">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="[
                    getAnnonceStyle(annonce).bgColor,
                    getAnnonceStyle(annonce).textColor,
                  ]"
                >
                  {{ getAnnonceStyle(annonce).badge }}
                </span>
                <span>📅 {{ formatDate(annonce.created_at) }}</span>
                <span v-if="annonce.views">👁️ {{ annonce.views }} vues</span>
              </div>
            </div>

            <!-- Container -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Content of the annonce -->
              <div class="lg:col-span-2">
                <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    Contenu de l'annonce
                  </h3>
                  <p class="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {{ annonce.content }}
                  </p>
                </div>
              </div>

              <!-- Other information of the annonce -->
              <div class="space-y-4">
                <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">Informations</h3>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-600 mb-1"
                        >Auteur</label
                      >
                      <p class="text-gray-900 font-medium">
                        {{ annonce.posted_by_name }} {{ annonce.posted_by_lastname }}
                      </p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-600 mb-1"
                        >Publié le</label
                      >
                      <p class="text-gray-900">{{ formatDate(annonce.created_at) }}</p>
                    </div>

                    <div
                      v-if="
                        annonce.target_class_id ||
                        annonce.target_filiere_id ||
                        annonce.target_year_id
                      "
                    >
                      <label class="block text-sm font-medium text-gray-600 mb-1"
                        >Public cible</label
                      >
                      <p class="text-gray-900">
                        <span v-if="annonce.class_name"
                          >Classe: {{ annonce.class_name }}</span
                        >
                        <span v-if="annonce.filiere_name">
                          | Filière: {{ annonce.filiere_name }}</span
                        >
                        <span v-if="annonce.year_value">
                          | Niveau: {{ annonce.year_value }}</span
                        >
                        <span
                          v-if="
                            !annonce.class_name &&
                            !annonce.filiere_name &&
                            !annonce.year_value
                          "
                        >
                          Tous les publics
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Fichiers joints -->
                <div
                  v-if="annonce.files && annonce.files.length > 0"
                  class="bg-gray-50 p-6 rounded-lg border border-gray-200"
                >
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    Fichiers joints
                  </h3>
                  <div class="space-y-2">
                    <div
                      v-for="file in annonce.files"
                      :key="file.id_file"
                      class="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <span class="text-xl">{{ getFileIcon(file.file_name) }}</span>
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
                      <div class="flex gap-2">
                        <button
                          @click="viewFile(file)"
                          class="text-blue-600 hover:text-blue-800 text-sm"
                          title="Voir le fichier"
                        >
                          👁️
                        </button>
                        <button
                          @click="downloadFile(file)"
                          class="text-green-600 hover:text-green-800 text-sm"
                          title="Télécharger"
                        >
                          📥
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action of the modal -->
            <div class="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
              <!-- Boutons pour tous les fichiers -->
              <button
                v-if="annonce.files && annonce.files.length > 0"
                @click="viewFile(annonce.files[0])"
                class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
              >
                <span>👁️</span>
                Voir le fichier
              </button>

              <button
                v-if="annonce.files && annonce.files.length > 0"
                @click="downloadFile(annonce.files[0])"
                class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm hover:shadow-md"
              >
                <span>📥</span>
                Télécharger
              </button>

              <!-- Bouton fermer modal -->
              <button
                @click="handleClose"
                class="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-sm hover:shadow-md ml-auto"
              >
                <span>✕</span>
                Fermer
              </button>
            </div>
          </div>

          <!-- État vide -->
          <div v-else class="text-center py-12">
            <div class="text-gray-400 text-6xl mb-4">📭</div>
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
</style>
