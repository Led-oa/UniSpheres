<script setup>
import { ref, watch, computed } from "vue";
import { useYearStore } from "../../stores/academique/year.store";

const props = defineProps({
  isOpen: Boolean,
  year: Object,
  filiereType: String, // "Licence", "Master" ou "Doctorat"
});

const emit = defineEmits(["close", "saved"]);

const yearStore = useYearStore();
const formData = ref({
  title: "",
  year_value: "",
});
const isLoading = ref(false);
const error = ref("");

// Options de type d'année
const yearOptions = [
  { value: "licence", label: "Licence", min: 1, max: 3 },
  { value: "master", label: "Master", min: 1, max: 2 },
  { value: "doctorat", label: "Doctorat", min: 1, max: 3 },
];

// Calcul des numéros disponibles selon le type sélectionné
const yearNumbers = computed(() => {
  const selectedOption = yearOptions.find((opt) => opt.value === formData.value.title);
  if (!selectedOption) return [];
  const numbers = [];
  for (let i = selectedOption.min; i <= selectedOption.max; i++) numbers.push(i);
  return numbers;
});

// Initialisation lors de l'édition
watch(
  () => props.year,
  (newYear) => {
    if (newYear) {
      const yearValue = newYear.value || "";
      const match = yearValue.match(/^(\D+)(\d+)$/);
      if (match) {
        formData.value = {
          title: match[1].toLowerCase().trim(),
          year_value: parseInt(match[2]),
        };
      } else {
        formData.value = {
          title: props.filiereType,
          year_value: yearValue,
        };
      }
    } else {
      resetForm();
    }
  }
);

const resetForm = () => {
  formData.value = {
    title: props.filiereType ? props.filiereType.toLowerCase() : "",
    year_value: "",
  };
  error.value = "";
};

const handleSubmit = async () => {
  if (!formData.value.title || !formData.value.year_value) {
    error.value = "Veuillez sélectionner un type et une année";
    return;
  }
  isLoading.value = true;
  error.value = "";

  try {
    const yearData = {
      year_value: `${
        formData.value.title.charAt(0).toUpperCase() + formData.value.title.slice(1)
      } ${formData.value.year_value}`,
    };

    if (props.year) {
      await yearStore.updateYear(props.year.id_year, yearData);
    } else {
      console.log("YearData : ", yearData);
      await yearStore.createYear(yearData);
    }

    emit("saved");
    emit("close");
    resetForm();
  } catch (err) {
    error.value = err.message || "Une erreur est survenue";
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
            {{ year ? "Modifier le niveau" : "Créer un nouveau niveau" }}
          </h2>
        </div>

        <!-- Body -->
        <div class="px-6 py-4">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Type d'année
              </label>
              <select
                v-model="formData.title"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Sélectionner un type</option>
                <option
                  v-for="option in yearOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- Numéro d'année -->
            <div v-if="formData.title">
              <label class="block text-sm font-medium text-gray-700 mb-1"> Année </label>
              <select
                v-model="formData.year_value"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Sélectionner l'année</option>
                <option v-for="num in yearNumbers" :key="num" :value="num">
                  Année {{ num }}
                </option>
              </select>
            </div>

            <!-- Aperçu -->
            <div
              v-if="formData.title && formData.year_value"
              class="bg-blue-50 border border-blue-200 rounded-md p-3"
            >
              <p class="text-sm text-blue-600">
                Aperçu :
                <strong
                  >{{ formData.title.charAt(0).toUpperCase() + formData.title.slice(1) }}
                  {{ formData.year_value }}</strong
                >
              </p>
            </div>

            <!-- Message d'erreur -->
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
            class="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {{ isLoading ? "Enregistrement..." : year ? "Modifier" : "Créer" }}
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
