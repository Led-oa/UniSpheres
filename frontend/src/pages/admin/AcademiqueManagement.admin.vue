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

const activeTab = ref("classes");
const tabs = [
  { key: "classes", label: "Classes" },
  { key: "filieres", label: "Filières" },
  { key: "parcours", label: "Parcours" },
  { key: "niveaux", label: "Niveaux" },
];

// Gestion des modals
const isModalYearOpen = ref(false);
const isModalFiliereOpen = ref(false);
const isModalParcoursOpen = ref(false);
const isModalClasseOpen = ref(false);
const selectedClasse = ref(null);
const selectedYear = ref(null);
const selectedFiliere = ref(null);
const selectedParcours = ref(null);

// Stores
const classeStore = useClasseStore();
const filiereStore = useFiliereStore();
const parcoursStore = useParcoursStore();
const yearStore = useYearStore();

const loading = ref(true);

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
  selectedClasse.value = classe; // Édition
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
  <section class="space-y-8">
    <h1 class="text-2xl font-bold text-gray-800">Gestion Académique</h1>
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-3"
    >
      <div class="flex space-x-4">
        <button
          v-for="t in tabs"
          :key="t.key"
          @click="activeTab = t.key"
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="
            activeTab === t.key
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          "
        >
          {{ t.label }}
        </button>
      </div>

      <button
        class="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
        @click="handleAdd"
      >
        <span v-if="activeTab === 'classes'">+ Créer une classe</span>
        <span v-else-if="activeTab === 'filieres'">+ Ajouter une filière</span>
        <span v-else-if="activeTab === 'parcours'">+ Ajouter un parcours</span>
        <span v-else-if="activeTab === 'niveaux'">+ Ajouter un niveau</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-gray-500 py-12">Chargement…</div>

    <!-- Contenu -->
    <div v-else class="mt-6">
      <!-- === CLASSES === -->
      <div v-if="activeTab === 'classes'">
        <div v-if="classes.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="c in classes"
            :key="c.id_class"
            class="bg-white rounded-xl shadow p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <h3 class="text-lg font-semibold text-gray-800">{{ c.name }}</h3>
              <p class="text-gray-500 mt-1">Filière : {{ c.filiere_name || "—" }}</p>
              <p class="text-gray-500">Parcours : {{ c.parcours_name || "—" }}</p>
              <p class="text-gray-500">Niveau : {{ c.year_value || "—" }}</p>
            </div>
            <div class="mt-4 flex gap-2">
              <button
                @click="handleEditClasse(c)"
                class="flex-1 bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700"
              >
                Modifier
              </button>
              <RouterLink
                :to="{
                  name: 'InformationClassesAdmin',
                  params: { idClasse: c.id_class },
                }"
                class="flex-1 bg-gray-500 text-center text-white py-1.5 rounded hover:bg-gray-600"
              >
                Détails
              </RouterLink>
              <button
                class="flex-1 bg-red-600 text-white py-1.5 rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500 text-center">Aucune classe disponible.</p>
      </div>

      <!-- === TABLES GÉNÉRIQUES === -->
      <template v-else>
        <div
          class="bg-white rounded-xl shadow p-6 overflow-x-auto"
          v-if="
            (activeTab === 'filieres' && filieres.length) ||
            (activeTab === 'parcours' && parcours.length) ||
            (activeTab === 'niveaux' && years.length)
          "
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Nom
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="item in activeTab === 'filieres'
                  ? filieres
                  : activeTab === 'parcours'
                  ? parcours
                  : years"
                :key="item.id_filiere || item.id_parcours || item.id_year"
              >
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ item.id_filiere || item.id_parcours || item.id_year }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ item.name || item.year_value }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 space-x-2">
                  <button
                    @click="handleEdit(item)"
                    class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Modifier
                  </button>
                  <button
                    class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Détails
                  </button>
                  <button
                    class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else class="text-gray-500 text-center">
          Aucun enregistrement pour l’onglet sélectionné.
        </p>
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
  </section>
</template>
