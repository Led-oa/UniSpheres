<script setup>
import { onMounted, ref, computed } from "vue";

import { useAnnonceStore } from "../../stores/annonce.store";
const annonceStore = useAnnonceStore();

const loading = ref(false);
const annonces = ref([]);

const searchTitle = ref("");
const filterClass = ref("");
const filterFiliere = ref("");
const filterYear = ref("");
const filterType = ref("");
const filterPriority = ref("");

// --- Chargement ---
const loadAnnonce = async () => {
  loading.value = true;
  try {
    await annonceStore.fetchAllAnnonces();
    annonces.value = annonceStore.annonces;
  } catch (err) {
    console.error("Erreur chargement des annonces :", err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadAnnonce);

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
</script>
<template>
  <div class="space-y-6">
    <div class="grid md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow">
      <input
        v-model="searchTitle"
        type="text"
        placeholder="Rechercher par titre"
        class="border p-2 rounded"
      />
      <input
        v-model="filterClass"
        type="text"
        placeholder="Classe (ex: Info L1)"
        class="border p-2 rounded"
      />
      <input
        v-model="filterFiliere"
        type="text"
        placeholder="Filière (ex: Informatique)"
        class="border p-2 rounded"
      />
      <input
        v-model="filterYear"
        type="text"
        placeholder="Niveau (ex: Licence 1)"
        class="border p-2 rounded"
      />
      <select v-model="filterType" class="border p-2 rounded">
        <option value="">Tous types</option>
        <option value="general">Général</option>
        <option value="cours">Cours</option>
        <option value="evenement">Événement</option>
      </select>
      <select v-model="filterPriority" class="border p-2 rounded">
        <option value="">Toutes priorités</option>
        <option value="low">Basse</option>
        <option value="medium">Moyenne</option>
        <option value="high">Haute</option>
      </select>
    </div>

    <!-- Liste -->
    <div v-if="loading" class="text-gray-500">Chargement des annonces...</div>
    <ul v-else class="space-y-4">
      <li
        v-for="a in filteredAnnonces"
        :key="a.id_annonce"
        class="p-6 bg-white rounded-xl shadow border border-gray-100 flex justify-between"
      >
        <div>
          <h2 class="font-semibold text-purple-700">{{ a.title }}</h2>
          <p class="text-gray-500 text-sm">
            Publié le {{ new Date(a.created_at).toLocaleDateString() }}
          </p>
          <p class="text-gray-600 text-xs">
            Classe: {{ a.class_name }} | Filière: {{ a.filiere_name }} | Année:
            {{ a.year_value }} | Type: {{ a.type }} | Priorité: {{ a.priority }}
          </p>
        </div>
        <div class="space-x-2 text-sm">
          <button class="text-yellow-600 hover:underline" @click="openInfoModal(a)">
            Détails
          </button>
          <button class="text-blue-600 hover:underline" @click="openEditModal(a)">
            Modifier
          </button>
          <button
            class="text-red-500 hover:underline"
            @click="handleDelete(a.id_annonce)"
          >
            Supprimer
          </button>
        </div>
      </li>
    </ul>

    <div v-if="!loading && filteredAnnonces.length === 0" class="text-gray-500">
      Aucune annonce correspondant aux filtres.
    </div>
  </div>
</template>
