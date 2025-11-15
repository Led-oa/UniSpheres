<script setup>
import { onMounted, ref, computed } from "vue";
import { useAnnonceStore } from "../../stores/annonce.store";
import { useAuthStore } from "../../stores/auth.store";

import ModalAnnonceAdmin from "../../components/admin/ModalAnnonce.admin.vue";
import PaginationGenerale from "../../components/generale/Pagination.generale.vue";

const annonceStore = useAnnonceStore();
const authStore = useAuthStore();

const loading = ref(false);
const annonces = ref([]);

// --- Modal ---
const showModal = ref(false);
const modalMode = ref("add"); // "add" | "edit" | "info"
const selectedAnnonce = ref(null);

// --- Modal de suppression ---
const showDeleteModal = ref(false);
const annonceToDelete = ref(null);

const currentUser = computed(() => authStore.user);

// --- Filtres ---
const searchTitle = ref("");
const filterClass = ref("");
const filterFiliere = ref("");
const filterYear = ref("");
const filterType = ref("");
const filterPriority = ref("");

// --- Chargement ---
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

// --- Filtrage ---
const filteredAnnonces = computed(() =>
  annonces.value.filter((a) => {
    const matchTitle =
      !searchTitle.value ||
      a.title.toLowerCase().includes(searchTitle.value.toLowerCase());

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

const handleSaved = () => {
  loadAnnonce();
  closeModal();
};

const handleUpdated = (updatedAnnonce) => {
  const index = annonces.value.findIndex(
    (a) => a.id_annonce === updatedAnnonce.id_annonce
  );
  if (index !== -1) {
    annonces.value = [
      ...annonces.value.slice(0, index),
      updatedAnnonce,
      ...annonces.value.slice(index + 1),
    ];
  }
  closeModal();
};

const closeModal = () => {
  showModal.value = false;
  selectedAnnonce.value = null;
  setTimeout(() => {
    modalMode.value = "add";
  }, 300);
};

// --- Actions Modal ---
const openAddModal = () => {
  modalMode.value = "add";
  selectedAnnonce.value = null;
  showModal.value = true;
};

const openInfoModal = (annonce) => {
  modalMode.value = "info";
  selectedAnnonce.value = annonce;
  showModal.value = true;
};

const openEditModal = (annonce) => {
  modalMode.value = "edit";
  selectedAnnonce.value = annonce;
  showModal.value = true;
};

// --- Suppression ---
const handleDelete = (annonce) => {
  annonceToDelete.value = annonce;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!annonceToDelete.value) return;

  try {
    await annonceStore.deleteAnnonce(annonceToDelete.value.id_annonce);
    await loadAnnonce(1);
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
  } finally {
    closeDeleteModal();
  }
};

const cancelDelete = () => {
  closeDeleteModal();
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  annonceToDelete.value = null;
};

// --- Helpers pour le design ---
const getPriorityColor = (priority) => {
  const colors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[priority] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getTypeColor = (type) => {
  const colors = {
    general: "bg-blue-100 text-blue-800 border-blue-200",
    cours: "bg-purple-100 text-purple-800 border-purple-200",
    evenement: "bg-orange-100 text-orange-800 border-orange-200",
  };
  return colors[type] || "bg-gray-100 text-gray-800 border-gray-200";
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
</script>

<template>
  <section class="space-y-8">
    <!-- En-tête -->
    <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-gray-900">Gestion des annonces</h1>
        <p class="text-gray-600 max-w-2xl">
          Créez, modifiez et gérez les annonces destinées aux étudiants et enseignants.
        </p>
      </div>
      <button
        @click="openAddModal"
        class="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold group"
      >
        <svg
          class="w-5 h-5 group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Nouvelle annonce</span>
      </button>
    </header>

    <!-- Filtres améliorés -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <!-- Recherche par titre -->
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

        <!-- Filtre classe -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Classe</label>
          <input
            v-model="filterClass"
            type="text"
            placeholder="Ex: Info L1"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <!-- Filtre filière -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Filière</label>
          <input
            v-model="filterFiliere"
            type="text"
            placeholder="Ex: Informatique"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <!-- Filtre niveau -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Niveau</label>
          <input
            v-model="filterYear"
            type="text"
            placeholder="Ex: Licence 1"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <!-- Filtre type -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Type</label>
          <select
            v-model="filterType"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Tous types</option>
            <option value="general">Général</option>
            <option value="cours">Cours</option>
            <option value="evenement">Événement</option>
          </select>
        </div>

        <!-- Filtre priorité -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Priorité</label>
          <select
            v-model="filterPriority"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Toutes priorités</option>
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div
        class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-700">Total annonces</p>
            <p class="text-2xl font-bold text-blue-900">{{ annonces.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <svg
              class="w-6 h-6 text-white"
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

      <div
        class="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-700">Annonces générales</p>
            <p class="text-2xl font-bold text-purple-900">
              {{ annonces.filter((a) => a.type === "general").length }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-white"
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
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-orange-700">Événements</p>
            <p class="text-2xl font-bold text-orange-900">
              {{ annonces.filter((a) => a.type === "evenement").length }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-white"
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

      <div
        class="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-red-700">Priorité haute</p>
            <p class="text-2xl font-bold text-red-900">
              {{ annonces.filter((a) => a.priority === "high").length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
            <svg
              class="w-6 h-6 text-white"
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
    </div>

    <!-- Liste des annonces -->
    <div class="space-y-4">
      <!-- Loader -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="text-gray-600">Chargement des annonces...</span>
        </div>
      </div>

      <!-- Grille des annonces -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="a in filteredAnnonces"
          :key="a.id_annonce"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group"
        >
          <!-- En-tête de la carte -->
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center space-x-2">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full text-xs font-medium border',
                    getTypeColor(a.type),
                  ]"
                >
                  {{ a.type?.charAt(0).toUpperCase() + a.type?.slice(1) }}
                </span>
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full text-xs font-medium border',
                    getPriorityColor(a.priority),
                  ]"
                >
                  {{ a.priority }}
                </span>
              </div>
              <div class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                {{ formatDate(a.created_at) }}
              </div>
            </div>

            <h3
              class="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2"
            >
              {{ a.title }}
            </h3>

            <p class="text-gray-600 text-sm mt-2 line-clamp-2">
              {{ a.content }}
            </p>
          </div>

          <!-- Informations supplémentaires -->
          <div class="p-4 bg-gray-50">
            <div class="grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div class="flex items-center space-x-1">
                <svg
                  class="w-3 h-3 text-gray-400"
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
                <span class="truncate">{{ a.class_name || "Toutes classes" }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <svg
                  class="w-3 h-3 text-gray-400"
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
                <span class="truncate">{{ a.filiere_name || "Toutes filières" }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <svg
                  class="w-3 h-3 text-gray-400"
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
                <span>{{ a.year_value || "Tous niveaux" }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <svg
                  class="w-3 h-3 text-gray-400"
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
                <span class="truncate">{{ a.posted_by_name }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="p-4 flex justify-between items-center">
            <button
              @click="openInfoModal(a)"
              class="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <span>Détails</span>
            </button>

            <div class="flex items-center space-x-2">
              <button
                @click="openEditModal(a)"
                class="flex items-center space-x-1 px-3 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>Modifier</span>
              </button>

              <button
                @click="handleDelete(a)"
                class="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
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

      <!-- État vide -->
      <div
        v-if="!loading && filteredAnnonces.length === 0"
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
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucune annonce trouvée</h3>
        <p class="text-gray-600 max-w-md mx-auto">
          {{
            searchTitle ||
            filterClass ||
            filterFiliere ||
            filterYear ||
            filterType ||
            filterPriority
              ? "Aucune annonce ne correspond à vos critères de recherche."
              : "Commencez par créer votre première annonce."
          }}
        </p>
        <button
          v-if="
            !searchTitle &&
            !filterClass &&
            !filterFiliere &&
            !filterYear &&
            !filterType &&
            !filterPriority
          "
          @click="openAddModal"
          class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Créer une annonce
        </button>
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
    />

    <!-- MODAL Annonce -->
    <ModalAnnonceAdmin
      :show="showModal"
      :mode="modalMode"
      :annonce="selectedAnnonce"
      :postedBy="currentUser.id_user"
      @close="closeModal"
      @saved="handleSaved"
      @updated="handleUpdated"
    />

    <!-- Modal de confirmation de suppression -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200"
      @click.self="cancelDelete"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-200 scale-100"
      >
        <div class="p-6 text-center">
          <!-- Icône d'alerte -->
          <div
            class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4"
          >
            <svg
              class="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Confirmer la suppression
          </h3>
          <p class="text-gray-600 mb-6">
            Voulez-vous vraiment supprimer l'annonce :
            <strong class="text-gray-900">"{{ annonceToDelete?.title }}"</strong> ?
          </p>

          <div class="flex gap-3 justify-center">
            <button
              @click="cancelDelete"
              class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Annuler
            </button>
            <button
              @click="confirmDelete"
              class="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  overflow: hidden;
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
