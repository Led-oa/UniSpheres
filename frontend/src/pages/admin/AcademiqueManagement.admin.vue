<script setup>
import { ref, onMounted, computed } from "vue";
import { useClasseStore } from "../../stores/academique/classe.store";
import { useFiliereStore } from "../../stores/academique/filiere.store";
import { useParcoursStore } from "../../stores/academique/parcours.store";
import { useYearStore } from "../../stores/academique/year.store";
import ModalClasseAdmin from "../../components/admin/ModalClasse.admin.vue";
import ModalYearAdmin from "../../components/admin/ModalYear.admin.vue";
import ModalFiliereAdmin from "../../components/admin/ModalFiliere.admin.vue";
import ModalParcoursAdmin from "../../components/admin/ModalParcours.admin.vue";
import { RouterLink } from "vue-router";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

const activeTab = ref("classes");
const tabs = [
  { key: "classes", label: "Classes", icon: "building-library" },
  { key: "filieres", label: "Filières", icon: "book-open" },
  { key: "parcours", label: "Parcours", icon: "academic-cap" },
  { key: "niveaux", label: "Niveaux", icon: "chart-bar" },
];

// Mapping des icônes Heroicons
const iconMap = {
  "building-library":
    "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z",
  "book-open":
    "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  "academic-cap":
    "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5",
  "chart-bar":
    "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
};

// Gestion des modals
const isModalYearOpen = ref(false);
const isModalFiliereOpen = ref(false);
const isModalParcoursOpen = ref(false);
const isModalClasseOpen = ref(false);
const selectedClasse = ref(null);
const selectedYear = ref(null);
const selectedFiliere = ref(null);
const selectedParcours = ref(null);

// Modal de confirmation de suppression (Headless UI)
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const deleteConfirmationText = ref("");

// Stores
const classeStore = useClasseStore();
const filiereStore = useFiliereStore();
const parcoursStore = useParcoursStore();
const yearStore = useYearStore();

const loading = ref(true);

// Statistiques calculées
const stats = computed(() => ({
  classes: classeStore.classes.length,
  filieres: filiereStore.filieres.length,
  parcours: parcoursStore.parcours.length,
  niveaux: yearStore.years.length,
}));

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      classeStore.fetchClasses(),
      filiereStore.fetchFilieres(),
      parcoursStore.fetchParcours(),
      yearStore.fetchYears(),
    ]);
  } finally {
    loading.value = false;
  }
});

const classes = computed(() => classeStore.classes);
const filieres = computed(() => filiereStore.filieres);
const parcours = computed(() => parcoursStore.parcours);
const years = computed(() => yearStore.years);

function handleAdd() {
  switch (activeTab.value) {
    case "niveaux":
      selectedYear.value = null;
      isModalYearOpen.value = true;
      break;
    case "filieres":
      selectedFiliere.value = null;
      isModalFiliereOpen.value = true;
      break;
    case "parcours":
      selectedParcours.value = null;
      isModalParcoursOpen.value = true;
      break;
    case "classes":
      selectedClasse.value = null;
      isModalClasseOpen.value = true;
  }
}

function handleEditClasse(classe) {
  selectedClasse.value = classe;
  isModalClasseOpen.value = true;
}

function handleEdit(item) {
  switch (activeTab.value) {
    case "niveaux":
      selectedYear.value = item;
      isModalYearOpen.value = true;
      break;
    case "filieres":
      selectedFiliere.value = item;
      isModalFiliereOpen.value = true;
      break;
    case "parcours":
      selectedParcours.value = item;
      isModalParcoursOpen.value = true;
      break;
  }
}

function handleDelete(item) {
  itemToDelete.value = item;

  let text;
  switch (activeTab.value) {
    case "niveaux":
      text = `Voulez-vous vraiment supprimer le niveau : "${item.year_value}" ?`;
      break;
    case "filieres":
      text = `Voulez-vous vraiment supprimer la filière : "${item.name}" ?`;
      break;
    case "parcours":
      text = `Voulez-vous vraiment supprimer le parcours : "${item.name}" ?`;
      break;
    case "classes":
      text = `Voulez-vous vraiment supprimer la classe : "${item.name}" ?`;
      break;
  }

  deleteConfirmationText.value = text;
  isDeleteModalOpen.value = true;
}

// Confirmer la suppression
async function confirmDelete() {
  if (!itemToDelete.value) return;

  try {
    switch (activeTab.value) {
      case "niveaux":
        await yearStore.deleteYear(itemToDelete.value.id_year);
        await yearStore.fetchYears();
        break;
      case "filieres":
        await filiereStore.deleteFiliere(itemToDelete.value.id_filiere);
        await filiereStore.fetchFilieres();
        break;
      case "parcours":
        await parcoursStore.deleteParcours(itemToDelete.value.id_parcours);
        await parcoursStore.fetchParcours();
        break;
      case "classes":
        await classeStore.deleteClass(itemToDelete.value.id_class);
        await classeStore.fetchClasses();
        break;
    }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
  } finally {
    closeDeleteModal();
  }
}

// Annuler la suppression
function cancelDelete() {
  closeDeleteModal();
}

// Fermer le modal de suppression
function closeDeleteModal() {
  isDeleteModalOpen.value = false;
  itemToDelete.value = null;
  deleteConfirmationText.value = "";
}

// Pour rafraîchir les listes après enregistrement
function handleSaved(tab) {
  switch (tab) {
    case "niveaux":
      yearStore.fetchYears();
      break;
    case "filieres":
      filiereStore.fetchFilieres();
      break;
    case "parcours":
      parcoursStore.fetchParcours();
      break;
  }
}

function handleClasseSaved() {
  classeStore.fetchClasses();
}
</script>

<template>
  <section class="space-y-8 transition-all duration-300">
    <!-- En-tête -->
    <header
      class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all duration-300"
    >
      <div class="space-y-2 transition-all duration-300">
        <h1 class="text-3xl font-bold text-gray-900 transition-colors duration-200">
          Gestion des Classes
        </h1>
        <p class="text-gray-600 max-w-2xl transition-colors duration-200">
          Gérez les classes, filières, parcours et niveaux de votre établissement.
        </p>
      </div>
      <button
        @click="handleAdd"
        class="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out font-semibold group hover:scale-105"
      >
        <svg
          class="w-5 h-5 group-hover:scale-110 transition-all duration-200 ease-in-out"
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
        <span class="transition-colors duration-200">
          <span v-if="activeTab === 'classes'">Nouvelle classe</span>
          <span v-else-if="activeTab === 'filieres'">Nouvelle filière</span>
          <span v-else-if="activeTab === 'parcours'">Nouveau parcours</span>
          <span v-else-if="activeTab === 'niveaux'">Nouveau niveau</span>
        </span>
      </button>
    </header>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-300">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="bg-white rounded-2xl shadow-sm border-2 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-md p-6 hover:scale-105"
        :class="
          activeTab === tab.key
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-100 hover:border-gray-200'
        "
      >
        <div class="flex items-center justify-between transition-colors duration-200">
          <div class="transition-colors duration-200">
            <p class="text-sm font-medium text-gray-600 transition-colors duration-200">
              {{ tab.label }}
            </p>
            <p
              class="text-2xl font-bold text-gray-900 mt-1 transition-colors duration-200"
            >
              {{ stats[tab.key] }}
            </p>
          </div>
          <div class="text-2xl transition-colors duration-200">
            <svg
              class="w-8 h-8 text-gray-600 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="iconMap[tab.icon]"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Onglets améliorés -->
    <div
      class="flex space-x-1 p-1 bg-gray-100 rounded-2xl w-fit transition-all duration-300"
    >
      <button
        v-for="t in tabs"
        :key="t.key"
        @click="activeTab = t.key"
        class="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out hover:scale-105"
        :class="
          activeTab === t.key
            ? 'bg-white text-blue-700 shadow-sm'
            : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
        "
      >
        <svg
          class="w-5 h-5 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="iconMap[t.icon]"
          />
        </svg>
        <span class="transition-colors duration-200">{{ t.label }}</span>
      </button>
    </div>

    <!-- Contenu principal -->
    <div class="mt-6 transition-all duration-300">
      <!-- Loading -->
      <div
        v-if="loading"
        class="flex justify-center items-center py-12 transition-all duration-300"
      >
        <div class="flex items-center space-x-3 transition-colors duration-200">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 transition-colors duration-200"
          ></div>
          <span class="text-gray-600 transition-colors duration-200"
            >Chargement des données...</span
          >
        </div>
      </div>

      <!-- === CLASSES === -->
      <div v-else-if="activeTab === 'classes'">
        <div
          v-if="classes.length"
          class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 transition-all duration-300"
        >
          <div
            v-for="c in classes"
            :key="c.id_class"
            class="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden group hover:scale-105"
          >
            <div class="p-6 border-b border-gray-100 transition-colors duration-200">
              <div
                class="flex items-start justify-between mb-3 transition-colors duration-200"
              >
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 transition-all duration-200 ease-in-out hover:bg-blue-200"
                >
                  Classe
                </span>
              </div>

              <h3
                class="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200"
              >
                {{ c.name }}
              </h3>

              <div
                class="mt-4 space-y-2 text-sm text-gray-600 transition-colors duration-200"
              >
                <div class="flex items-center space-x-2 transition-colors duration-200">
                  <svg
                    class="w-4 h-4 text-gray-400 transition-colors duration-200"
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
                  <span class="transition-colors duration-200">{{
                    c.filiere_name || "—"
                  }}</span>
                </div>
                <div class="flex items-center space-x-2 transition-colors duration-200">
                  <svg
                    class="w-4 h-4 text-gray-400 transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span class="transition-colors duration-200">{{
                    c.parcours_name || "—"
                  }}</span>
                </div>
                <div class="flex items-center space-x-2 transition-colors duration-200">
                  <svg
                    class="w-4 h-4 text-gray-400 transition-colors duration-200"
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
                  <span class="transition-colors duration-200">{{
                    c.year_value || "—"
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div
              class="p-4 flex justify-between items-center transition-colors duration-200"
            >
              <RouterLink
                v-if="c && c.id_class"
                :to="{
                  name: 'InformationClassesAdmin',
                  params: { idClasse: c.id_class },
                }"
                class="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 text-sm font-medium"
              >
                <svg
                  class="w-4 h-4 transition-colors duration-200"
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
                <span class="transition-colors duration-200">Détails</span>
              </RouterLink>

              <div class="flex items-center space-x-2 transition-colors duration-200">
                <button
                  @click="handleEditClasse(c)"
                  class="flex items-center space-x-1 px-3 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 text-sm font-medium"
                >
                  <svg
                    class="w-4 h-4 transition-colors duration-200"
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
                  <span class="transition-colors duration-200">Modifier</span>
                </button>

                <button
                  @click="handleDelete(c)"
                  class="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 text-sm font-medium"
                >
                  <svg
                    class="w-4 h-4 transition-colors duration-200"
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
                  <span class="transition-colors duration-200">Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- État vide classes -->
        <div
          v-else
          class="text-center py-12 bg-white rounded-2xl border border-gray-200 transition-all duration-300"
        >
          <svg
            class="w-16 h-16 text-gray-400 mx-auto mb-4 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="iconMap['building-library']"
            />
          </svg>
          <h3
            class="text-lg font-semibold text-gray-900 mb-2 transition-colors duration-200"
          >
            Aucune classe disponible
          </h3>
          <p class="text-gray-600 mb-4 transition-colors duration-200">
            Commencez par créer votre première classe.
          </p>
          <button
            @click="handleAdd"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-in-out hover:scale-105 font-medium"
          >
            Créer une classe
          </button>
        </div>
      </div>

      <!-- === FILIÈRES, PARCOURS, NIVEAUX === -->
      <template v-else>
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300"
        >
          <div class="overflow-x-auto transition-all duration-300">
            <table
              class="min-w-full divide-y divide-gray-200 transition-colors duration-200"
            >
              <thead class="bg-gray-50 transition-colors duration-200">
                <tr class="transition-colors duration-200">
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider transition-colors duration-200"
                  >
                    ID
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider transition-colors duration-200"
                  >
                    {{ activeTab === "niveaux" ? "Valeur" : "Nom" }}
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider transition-colors duration-200"
                  >
                    Date de création
                  </th>
                  <th
                    class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider transition-colors duration-200"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white divide-y divide-gray-200 transition-colors duration-200"
              >
                <tr
                  v-for="item in activeTab === 'filieres'
                    ? filieres
                    : activeTab === 'parcours'
                    ? parcours
                    : years"
                  :key="item.id_filiere || item.id_parcours || item.id_year"
                  class="hover:bg-gray-50 transition-all duration-200 ease-in-out"
                >
                  <td class="px-6 py-4 whitespace-nowrap transition-colors duration-200">
                    <span
                      class="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded transition-all duration-200 ease-in-out hover:bg-gray-200"
                    >
                      {{ item.id_filiere || item.id_parcours || item.id_year }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap transition-colors duration-200">
                    <div
                      class="flex items-center space-x-3 transition-colors duration-200"
                    >
                      <div
                        class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-blue-200"
                      >
                        <span
                          class="text-sm font-medium text-blue-700 transition-colors duration-200"
                        >
                          {{ (item.name || item.year_value).charAt(0) }}
                        </span>
                      </div>
                      <span
                        class="text-sm font-medium text-gray-900 transition-colors duration-200"
                      >
                        {{ item.name || item.year_value }}
                      </span>
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 transition-colors duration-200"
                  >
                    {{
                      item.created_at
                        ? new Date(item.created_at).toLocaleDateString("fr-FR")
                        : "—"
                    }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium transition-colors duration-200"
                  >
                    <div
                      class="flex justify-end space-x-2 transition-colors duration-200"
                    >
                      <button
                        @click="handleEdit(item)"
                        class="flex items-center space-x-1 px-3 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 text-sm font-medium"
                      >
                        <svg
                          class="w-4 h-4 transition-colors duration-200"
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
                        <span class="transition-colors duration-200">Modifier</span>
                      </button>
                      <button
                        @click="handleDelete(item)"
                        class="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 text-sm font-medium"
                      >
                        <svg
                          class="w-4 h-4 transition-colors duration-200"
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
                        <span class="transition-colors duration-200">Supprimer</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- État vide pour les tableaux -->
        <div
          v-if="
            (activeTab === 'filieres' && !filieres.length) ||
            (activeTab === 'parcours' && !parcours.length) ||
            (activeTab === 'niveaux' && !years.length)
          "
          class="text-center py-12 bg-white rounded-2xl border border-gray-200 transition-all duration-300"
        >
          <svg
            class="w-16 h-16 text-gray-400 mx-auto mb-4 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="
                iconMap[
                  activeTab === 'filieres'
                    ? 'book-open'
                    : activeTab === 'parcours'
                    ? 'academic-cap'
                    : 'chart-bar'
                ]
              "
            />
          </svg>
          <h3
            class="text-lg font-semibold text-gray-900 mb-2 transition-colors duration-200"
          >
            Aucun
            {{
              activeTab === "filieres"
                ? "filière"
                : activeTab === "parcours"
                ? "parcours"
                : "niveau"
            }}
            disponible
          </h3>
          <p class="text-gray-600 mb-4 transition-colors duration-200">
            Commencez par créer votre premier
            {{
              activeTab === "filieres"
                ? "filière"
                : activeTab === "parcours"
                ? "parcours"
                : "niveau"
            }}.
          </p>
          <button
            @click="handleAdd"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-in-out hover:scale-105 font-medium"
          >
            Créer
          </button>
        </div>
      </template>
    </div>

    <!-- === MODALS === -->
    <ModalYearAdmin
      :isOpen="isModalYearOpen"
      :year="selectedYear"
      @close="isModalYearOpen = false"
      @saved="handleSaved('niveaux')"
    />
    <ModalFiliereAdmin
      :isOpen="isModalFiliereOpen"
      :filiere="selectedFiliere"
      @close="isModalFiliereOpen = false"
      @saved="handleSaved('filieres')"
    />
    <ModalParcoursAdmin
      :isOpen="isModalParcoursOpen"
      :parcours="selectedParcours"
      @close="isModalParcoursOpen = false"
      @saved="handleSaved('parcours')"
    />
    <ModalClasseAdmin
      :isOpen="isModalClasseOpen"
      :classe="selectedClasse"
      @close="isModalClasseOpen = false"
      @saved="handleClasseSaved"
    />

    <!-- Modal de confirmation de suppression (Headless UI) -->
    <TransitionRoot as="template" :show="isDeleteModalOpen">
      <Dialog as="div" class="relative z-50" @close="cancelDelete">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
          />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6"
              >
                <div class="text-center transition-all duration-300">
                  <!-- Icône d'alerte -->
                  <div
                    class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4 transition-colors duration-200"
                  >
                    <svg
                      class="h-8 w-8 text-red-600 transition-colors duration-200"
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

                  <DialogTitle
                    as="h3"
                    class="text-xl font-semibold leading-6 text-gray-900 mb-2 transition-colors duration-200"
                  >
                    Confirmer la suppression
                  </DialogTitle>
                  <p class="text-gray-600 mb-6 transition-colors duration-200">
                    {{ deleteConfirmationText }}
                    <br />
                    <span class="text-sm text-gray-500 transition-colors duration-200">
                      Cette action est irréversible.
                    </span>
                  </p>

                  <div class="flex gap-3 justify-center transition-all duration-300">
                    <button
                      @click="cancelDelete"
                      class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 ease-in-out font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 hover:scale-105"
                    >
                      Annuler
                    </button>
                    <button
                      @click="confirmDelete"
                      class="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 ease-in-out font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:scale-105"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </section>
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

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
  transition: all 0.3s ease-in-out;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
  transition: all 0.3s ease-in-out;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Transitions globales */
* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
