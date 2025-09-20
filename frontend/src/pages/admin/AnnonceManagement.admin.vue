<script setup>
import { onMounted, ref, computed } from "vue";
import { useAnnonceStore } from "../../stores/annonce.store";
import { useAuthStore } from "../../stores/auth.store";
import ModalAnnonceAdmin from "../../components/admin/ModalAnnonce.admin.vue";

const annonceStore = useAnnonceStore();
const authStore = useAuthStore();

const loading = ref(false);
const annonces = ref([]);

// --- Modal ---
const showModal = ref(false);
const modalMode = ref("add"); // "add" | "edit" | "info"
const selectedAnnonce = ref(null); // annonce en cours (edit/info)

const currentUser = computed(() => authStore.user);

// --- Filtres ---
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

const handleSaved = () => {
  loadAnnonce(); // Refresh the list for new items
  closeModal();
};

const handleUpdated = (updatedAnnonce) => {
  // Update the local state without refetching everything
  const index = annonces.value.findIndex(
    (a) => a.id_annonce === updatedAnnonce.id_annonce
  );
  if (index !== -1) {
    // Create a new array to maintain reactivity
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
  // Add a small delay to allow modal animation to complete
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
const handleDelete = async (id) => {
  if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;
  try {
    await annonceStore.deleteAnnonce(id);
    await loadAnnonce();
    alert("Annonce supprimée avec succès !");
  } catch (err) {
    alert("Erreur lors de la suppression : " + err.message);
  }
};
</script>

<template>
  <section class="space-y-8">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des annonces</h1>
      <button
        class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:opacity-90"
        @click="openAddModal"
      >
        + Nouvelle annonce
      </button>
    </header>

    <!-- Filtres -->
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

    <!-- MODAL -->
    <ModalAnnonceAdmin
      :show="showModal"
      :mode="modalMode"
      :annonce="selectedAnnonce"
      :postedBy="currentUser.id_user"
      @close="closeModal"
      @saved="handleSaved"
      @updated="handleUpdated"
    />
  </section>
</template>
