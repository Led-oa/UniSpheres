<script setup>
import { ref, onMounted, watch } from "vue";
import { useClasseStore } from "../../stores/academique/classe.store";
import { useFiliereStore } from "../../stores/academique/filiere.store";
import { useParcoursStore } from "../../stores/academique/parcours.store";
import { useYearStore } from "../../stores/academique/year.store";

const props = defineProps({
  isOpen: Boolean,
  classe: Object, // Si editing, sinon null
});

const emit = defineEmits(["close", "saved"]);

const classeStore = useClasseStore();
const filiereStore = useFiliereStore();
const parcoursStore = useParcoursStore();
const yearStore = useYearStore();

// Formulaire
const formData = ref({
  name: "",
  filiere_id: "",
  parcours_id: "",
  year_id: "",
});

const isLoading = ref(false);
const error = ref("");

// Charger filières, parcours et années
onMounted(async () => {
  await Promise.all([
    filiereStore.fetchFilieres(),
    parcoursStore.fetchParcours(),
    yearStore.fetchYears(),
  ]);
});

const resetForm = () => {
  formData.value = {
    name: "",
    filiere_id: "",
    parcours_id: "",
    year_id: "",
  };
  error.value = "";
};

// Quand on ouvre le modal pour édition
watch(
  () => props.classe,
  (newClasse) => {
    if (newClasse) {
      formData.value = {
        name: newClasse.class_name || newClasse.name || "",
        filiere_id: newClasse.filiere_id || newClasse.id_filiere || "",
        parcours_id: newClasse.parcours_id || newClasse.id_parcours || "",
        year_id: newClasse.year_id || newClasse.id_year || "",
      };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    if (props.classe) {
      // Édition
      await classeStore.updateClass(props.classe.id_class, formData.value);
    } else {
      // Création
      await classeStore.createClass(formData.value);
    }

    emit("saved");
    emit("close");
    resetForm();
  } catch (err) {
    error.value = err.message || "Erreur lors de l'enregistrement";
  } finally {
    isLoading.value = false;
  }
};

const handleClose = () => {
  resetForm();
  emit("close");
};
</script>

<template>
  <transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg w-full max-w-md mx-auto">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ classe ? "Modifier la classe" : "Créer une nouvelle classe" }}
          </h2>
        </div>

        <!-- Body -->
        <div class="px-6 py-4">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Nom -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Nom de la classe</label
              >
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Licence 1 Informatique"
              />
            </div>

            <!-- Filière -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Filière</label>
              <select
                v-model="formData.filiere_id"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une filière</option>
                <option
                  v-for="filiere in filiereStore.filieres"
                  :key="filiere.id_filiere"
                  :value="filiere.id_filiere"
                >
                  {{ filiere.name }}
                </option>
              </select>
            </div>

            <!-- Parcours -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Parcours</label>
              <select
                v-model="formData.parcours_id"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un parcours</option>
                <option
                  v-for="parcours in parcoursStore.parcours"
                  :key="parcours.id_parcours"
                  :value="parcours.id_parcours"
                >
                  {{ parcours.name }}
                </option>
              </select>
            </div>

            <!-- Année -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Année académique</label
              >
              <select
                v-model="formData.year_id"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une année</option>
                <option
                  v-for="year in yearStore.years"
                  :key="year.id_year"
                  :value="year.id_year"
                >
                  {{ year.year_value }}
                </option>
              </select>
            </div>

            <!-- Error message -->
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div
          class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3"
        >
          <button
            type="button"
            @click="handleClose"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            @click="handleSubmit"
            :disabled="isLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {{ isLoading ? "Enregistrement..." : classe ? "Modifier" : "Créer" }}
          </button>
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
