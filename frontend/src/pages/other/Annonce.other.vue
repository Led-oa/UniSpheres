<script setup>
import { ref, computed, onMounted } from "vue";
import { useAnnonceStore } from "../../stores/annonce.store";
import PaginationGenerale from "../../components/generale/Pagination.generale.vue";
import ModalAnnonceOther from "../../components/others/ModalAnnonce.other.vue";

const annonceStore = useAnnonceStore();

// États réactifs pour le modal
const isModalOpen = ref(false);
const selectedAnnonce = ref(null);

// Filtres
const searchTitle = ref("");
const filterClass = ref("");
const filterFiliere = ref("");
const filterYear = ref("");
const filterType = ref("");
const filterPriority = ref("");

const loading = ref(false);
const annonces = ref([]);

// Chargement
const loadAnnonce = async (page = 1) => {
  loading.value = true;
  try {
    await annonceStore.fetchAllAnnonces(page, 9);
    annonces.value = annonceStore.annonces.annonces;
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

// Filtrage
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

// Fonctions pour le modal
const handleDetails = (annonce) => {
  selectedAnnonce.value = annonce;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedAnnonce.value = null;
};

// Fonctions de formatage
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

const getTypeConfig = (type) => {
  const configs = {
    general: { label: "Général", class: "bg-blue-50 text-blue-700 border-blue-200" },
    cours: { label: "Cours", class: "bg-purple-50 text-purple-700 border-purple-200" },
    evenement: {
      label: "Événement",
      class: "bg-orange-50 text-orange-700 border-orange-200",
    },
  };
  return (
    configs[type] || {
      label: "Annonce",
      class: "bg-gray-50 text-gray-700 border-gray-200",
    }
  );
};
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- En-tête -->
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Annonces Administratives</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Restez informé des dernières actualités et annonces importantes de l'établissement
      </p>
      <div class="w-20 h-1 bg-gray-300 mx-auto mt-6 rounded-full"></div>
    </div>

    <!-- Filtres améliorés -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <!-- Recherche -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Recherche</label>
          <div class="relative">
            <svg
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="searchTitle"
              type="text"
              placeholder="Titre de l'annonce..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <!-- Type -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Type</label>
          <select
            v-model="filterType"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Tous les types</option>
            <option value="general">Général</option>
            <option value="cours">Cours</option>
            <option value="evenement">Événement</option>
          </select>
        </div>

        <!-- Priorité -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Priorité</label>
          <select
            v-model="filterPriority"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Toutes les priorités</option>
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Classe</label>
          <input
            v-model="filterClass"
            type="text"
            placeholder="Ex: Info L1"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Filière</label>
          <input
            v-model="filterFiliere"
            type="text"
            placeholder="Ex: Informatique"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Niveau</label>
          <input
            v-model="filterYear"
            type="text"
            placeholder="Ex: Licence 1"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total annonces</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ annonces.length }}</p>
          </div>
          <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Annonces importantes</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {{ annonces.filter((a) => a.priority === "high").length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <svg
              class="w-6 h-6 text-gray-600"
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
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Cours</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {{ annonces.filter((a) => a.type === "cours").length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Événements</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {{ annonces.filter((a) => a.type === "evenement").length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="flex items-center space-x-3">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="text-gray-600">Chargement des annonces...</span>
      </div>
    </div>

    <!-- États vides -->
    <div
      v-else-if="filteredAnnonces.length === 0 && annonces.length === 0"
      class="text-center py-12 bg-white rounded-2xl border border-gray-200"
    >
      <svg
        class="w-16 h-16 text-gray-300 mx-auto mb-4"
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
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucune annonce disponible</h3>
      <p class="text-gray-600">Les annonces apparaîtront ici une fois publiées.</p>
    </div>

    <div
      v-else-if="filteredAnnonces.length === 0"
      class="text-center py-12 bg-white rounded-2xl border border-gray-200"
    >
      <svg
        class="w-16 h-16 text-gray-300 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucun résultat</h3>
      <p class="text-gray-600">
        Aucune annonce ne correspond à vos critères de recherche.
      </p>
    </div>

    <!-- Liste des annonces -->
    <div v-else class="space-y-6">
      <div
        v-for="a in filteredAnnonces"
        :key="a.id_annonce"
        class="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group"
      >
        <div class="p-6">
          <!-- En-tête -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="getPriorityConfig(a.priority).dot"
                  ></span>
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-medium border"
                    :class="getTypeConfig(a.type).class"
                  >
                    {{ getTypeConfig(a.type).label }}
                  </span>
                </div>
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-medium border"
                  :class="getPriorityConfig(a.priority).class"
                >
                  {{ getPriorityConfig(a.priority).label }}
                </span>
              </div>

              <h3
                class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight"
              >
                {{ a.title }}
              </h3>
            </div>
          </div>

          <!-- Contenu -->
          <p class="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
            {{ a.content }}
          </p>

          <!-- Métadonnées -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>{{ a.posted_by_name }} {{ a.posted_by_lastname }}</span>
            </div>

            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{{ timeAgo(a.created_at) }}</span>
            </div>

            <div v-if="a.class_name" class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>{{ a.class_name }}</span>
            </div>

            <div v-if="a.filiere_name" class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
              </svg>
              <span>{{ a.filiere_name }}</span>
            </div>
          </div>

          <!-- Fichiers et actions -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <div v-if="a.files && a.files.length" class="flex items-center gap-2">
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
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              <span class="text-sm text-gray-600">{{ a.files.length }} fichier(s)</span>
            </div>
            <div v-else></div>

            <button
              @click="handleDetails(a)"
              class="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              <span>Voir les détails</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
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
.line-clamp-3 {
  display: -webkit-box;
  /* -webkit-line-clamp: 3; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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
