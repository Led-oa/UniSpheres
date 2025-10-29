<script setup>
import { ref, computed, onMounted } from "vue";
import { useAnnonceStore } from "../../stores/annonce.store";
import PaginationGenerale from "../../components/generale/Pagination.generale.vue";
import ModalAnnonceOther from "../../components/others/ModalAnnonce.other.vue";
const annonceStore = useAnnonceStore();

// États réactifs pour le modal
const isModalOpen = ref(false);
const selectedAnnonce = ref(null);

// --- Filtres (identique à votre code original) ---
const searchTitle = ref("");
const filterClass = ref("");
const filterFiliere = ref("");
const filterYear = ref("");
const filterType = ref("");
const filterPriority = ref("");

const loading = ref(false);
const annonces = ref([]);

// --- Chargement (identique à votre code original) ---
const loadAnnonce = async (page = 1) => {
  loading.value = true;
  try {
    await annonceStore.fetchAllAnnonces(page, 9);

    console.log("Annonce data : ", annonceStore.annonces.annonces);

    annonces.value = annonceStore.annonces.annonces;
    console.log("Pagination :", annonceStore.pagination);
  } catch (err) {
    console.error("Erreur chargement des annonces :", err);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page) => {
  loadAnnonce(page);
};

onMounted(() => {
  loadAnnonce(1);
});

// --- Filtrage (LOGIQUE ORIGINALE PRESERVÉE) ---
const filteredAnnonces = computed(() =>
  annonces.value.filter((a) => {
    const matchTitle =
      !searchTitle.value ||
      a.title?.toLowerCase().includes(searchTitle.value.toLowerCase());
    const matchClass =
      !filterClass.value ||
      (a.class_name ?? "").toLowerCase().includes(filterClass.value.toLowerCase());
    const matchFiliere =
      !filterFiliere.value ||
      (a.filiere_name ?? "").toLowerCase().includes(filterFiliere.value.toLowerCase());
    const matchYear =
      !filterYear.value ||
      (a.year_value ?? "").toLowerCase().includes(filterYear.value.toLowerCase());
    const matchType = !filterType.value || a.type === filterType.value;
    const matchPriority = !filterPriority.value || a.priority === filterPriority.value;
    return (
      matchTitle && matchClass && matchFiliere && matchYear && matchType && matchPriority
    );
  })
);

// Fonctions pour le modal (nouvelles)
const handleDetails = (annonce) => {
  selectedAnnonce.value = annonce;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedAnnonce.value = null;
};

// Fonctions de formatage (nouvelles)
const formatDate = (dateString) => {
  if (!dateString) return "Date inconnue";
  const date = new Date(dateString);
  if (isNaN(date)) return "Date invalide";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "À l'instant";
  if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`;
};

const getAnnonceStyle = (annonce) => {
  if (annonce.priority === "high") {
    return {
      borderColor: "border-yellow-500",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
      icon: "",
      badge: "Important",
    };
  }

  if (annonce.type === "cours") {
    return {
      borderColor: "border-blue-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      icon: "",
      badge: "Cours",
    };
  }

  return {
    borderColor: "border-green-500",
    bgColor: "bg-green-100",
    textColor: "text-green-600",
    icon: "",
    badge: "Événement",
  };
};
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Annonces Administratives</h1>
      <p class="text-xl text-gray-600">Restez informé des dernières actualités</p>
      <div
        class="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4"
      ></div>
    </div>

    <!-- 🔍 Barre de recherche améliorée (ORIGINALE) -->
    <div class="bg-white shadow-md p-6 rounded-2xl border border-gray-100">
      <div
        class="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0"
      >
        <div class="relative flex-1">
          <input
            v-model="searchTitle"
            type="text"
            placeholder="🔍 Rechercher une annonce..."
            class="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
          <span class="absolute left-3 top-3 text-gray-400">
            <i class="fas fa-search"></i>
          </span>
        </div>

        <select
          v-model="filterType"
          class="border rounded-lg p-3 focus:ring-2 focus:ring-purple-400"
        >
          <option value="">Tous types</option>
          <option value="general">Général</option>
          <option value="cours">Cours</option>
          <option value="evenement">Événement</option>
        </select>

        <select
          v-model="filterPriority"
          class="border rounded-lg p-3 focus:ring-2 focus:ring-purple-400"
        >
          <option value="">Toutes priorités</option>
          <option value="low">Basse</option>
          <option value="medium">Moyenne</option>
          <option value="high">Haute</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <input
          v-model="filterClass"
          type="text"
          placeholder="Classe (ex: Info L1)"
          class="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400"
        />
        <input
          v-model="filterFiliere"
          type="text"
          placeholder="Filière (ex: Informatique)"
          class="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400"
        />
        <input
          v-model="filterYear"
          type="text"
          placeholder="Niveau (ex: Licence 1)"
          class="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400"
        />
      </div>
    </div>

    <!-- 📰 Liste des annonces (LOGIQUE ORIGINALE PRESERVÉE) -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
      ></div>
      <p class="text-gray-600 mt-4">Chargement des annonces...</p>
    </div>

    <div
      v-else-if="filteredAnnonces.length === 0 && annonces.length === 0"
      class="text-center py-12"
    >
      <div class="text-gray-400 text-6xl mb-4">📭</div>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">Aucune annonce disponible</h3>
    </div>

    <div v-else-if="filteredAnnonces.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">🔍</div>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">
        Aucune annonce ne correspond aux filtres
      </h3>
    </div>

    <!-- AFFICHAGE AMÉLIORÉ (nouveau style) -->
    <div v-else class="space-y-6">
      <div
        v-for="a in filteredAnnonces"
        :key="a.id_annonce"
        class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-auto"
        :class="getAnnonceStyle(a).borderColor + ' border-l-4'"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="getAnnonceStyle(a).bgColor"
              >
                <span :class="getAnnonceStyle(a).textColor">
                  {{ getAnnonceStyle(a).icon }}
                </span>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-800">
                  {{ a.title }}
                </h3>
                <p class="text-gray-500">
                  Publié par {{ a.posted_by_name }} {{ a.posted_by_lastname }} •
                  {{ timeAgo(a.created_at) }}
                </p>
              </div>
            </div>
          </div>

          <p class="text-gray-700 mb-4 break-words line-clamp-3">
            {{ a.content }}
          </p>

          <!-- Fichiers -->
          <div v-if="a.files && a.files.length" class="flex items-center gap-4 mb-4">
            <span
              v-for="file in a.files"
              :key="file.id_file"
              class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200"
            >
              📎 {{ file.file_name }}
            </span>
          </div>

          <!-- Informations supplémentaires -->
          <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div class="flex items-center gap-4">
              <span>📅 {{ formatDate(a.created_at) }}</span>
              <span v-if="a.class_name">🏫 {{ a.class_name }}</span>
              <span v-if="a.filiere_name">📚 {{ a.filiere_name }}</span>
            </div>
          </div>

          <!-- Type & Priorité -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                class="px-2 py-1 rounded-lg text-xs font-medium"
                :class="[getAnnonceStyle(a).bgColor, getAnnonceStyle(a).textColor]"
              >
                {{ getAnnonceStyle(a).badge }}
              </span>
              <span
                :class="{
                  'bg-red-100 text-red-600': a.priority === 'high',
                  'bg-yellow-100 text-yellow-600': a.priority === 'medium',
                  'bg-green-100 text-green-600': a.priority === 'low',
                }"
                class="px-2 py-1 rounded-lg text-xs"
              >
                {{ a.priority }}
              </span>
            </div>
            <button
              @click="handleDetails(a)"
              class="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              Lire plus
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <PaginationGenerale
      v-if="annonceStore.pagination.totalPages > 0"
      :current-page="annonceStore.pagination.currentPage"
      :total-pages="annonceStore.pagination.totalPages"
      :total-items="annonceStore.pagination.totalItems"
      :items-per-page="annonceStore.pagination.itemsPerPage"
      @page-change="handlePageChange"
      class="mt-8"
    />

    <!-- Modal de détails -->
    <ModalAnnonceOther
      :is-open="isModalOpen"
      :annonce="selectedAnnonce"
      @close="closeModal"
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

.line-clamp-3 {
  display: -webkit-box;
  /* -webkit-line-clamp: 3; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
