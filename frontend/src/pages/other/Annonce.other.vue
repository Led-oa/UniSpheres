<script setup>
import { ref, computed, onMounted } from "vue";
import { useAnnonceStore } from "../../stores/annonce.store";

import PaginationGenerale from "../../components/generale/Pagination.generale.vue";

const annonceStore = useAnnonceStore();

const loading = ref(false);
const annonces = ref([]);

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
// --- Filtrage ---
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

// --- Actions simulées ---
const openInfoModal = (a) => alert("Détails de : " + a.title);
</script>

<template>
  <div class="space-y-8">
    <!-- 🔍 Barre de recherche améliorée -->
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

    <!-- 📰 Liste des annonces -->
    <div v-if="loading" class="text-gray-500 text-center py-10">
      Chargement des annonces...
    </div>

    <div
      v-else-if="filteredAnnonces.length === 0 && annonces.length === 0"
      class="text-gray-500 text-center py-10"
    >
      Aucune annonce disponible.
    </div>

    <div
      v-else-if="filteredAnnonces.length === 0"
      class="text-gray-500 text-center py-10"
    >
      Aucune annonce ne correspond aux filtres.
    </div>

    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="a in filteredAnnonces"
        :key="a.id_annonce"
        class="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300"
      >
        <!-- Corps de la carte -->
        <div class="p-5 space-y-2">
          <h2 class="font-semibold text-lg text-purple-700 line-clamp-2">
            {{ a.title }}
          </h2>
          <p class="text-gray-500 text-sm">
            Publié le {{ new Date(a.created_at).toLocaleDateString() }}
          </p>
          <p class="text-gray-600 text-xs">
            Classe: {{ a.class_name || "Toute les classes" }} <br />
            Filière: {{ a.filiere_name || "Toute les filières" }} <br />
            Niveau: {{ a.year_value || "Tout les niveaux" }}
          </p>

          <!-- Fichiers -->
          <div v-if="a.files && a.files.length" class="mt-2 flex justify-between">
            <div class="flex items-center space-x-2 text-sm text-blue-600">
              <i class="fas fa-file-alt"></i>
              <span>{{ a.files.length }} fichier(s) disponible(s)</span>
            </div>
            <button
              @click="() => alert('Téléchargement des fichiers...')"
              class="mt-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200"
            >
              Télécharger
            </button>
          </div>

          <!-- Type & Priorité -->
          <div class="flex items-center justify-between mt-3 text-xs">
            <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg">
              {{ a.type }}
            </span>
            <span
              :class="{
                'bg-red-100 text-red-600': a.priority === 'high',
                'bg-yellow-100 text-yellow-600': a.priority === 'medium',
                'bg-green-100 text-green-600': a.priority === 'low',
              }"
              class="px-2 py-1 rounded-lg"
            >
              {{ a.priority }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="border-t border-gray-100 p-3 flex justify-between text-sm">
          <button class="text-purple-600 hover:underline" @click="openInfoModal(a)">
            Détails
          </button>
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
    />
  </div>
</template>
