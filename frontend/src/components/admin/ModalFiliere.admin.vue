<script setup>
import { ref, watch } from "vue";
import { useFiliereStore } from "../../stores/academique/filiere.store";

const props = defineProps({
  isOpen: Boolean,
  filiere: Object, // pour l'édition
});

const emit = defineEmits(["close", "saved"]);

const filiereStore = useFiliereStore();
const formData = ref({ name: "" });
const isLoading = ref(false);
const error = ref("");

watch(
  () => props.filiere,
  (newFiliere) => {
    if (newFiliere) {
      formData.value = { name: newFiliere.name };
    } else {
      resetForm();
    }
  }
);

const resetForm = () => {
  formData.value = { name: "" };
  error.value = "";
};

const handleSubmit = async () => {
  if (!formData.value.name.trim()) {
    error.value = "Le nom de la filière est requis";
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    if (props.filiere) {
      await filiereStore.updateFiliere(props.filiere.id_filiere, formData.value);
    } else {
      await filiereStore.createFiliere(formData.value);
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
            {{ filiere ? "Modifier la filière" : "Créer une nouvelle filière" }}
          </h2>
        </div>

        <!-- Body -->
        <div class="px-6 py-4">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nom de la filière
              </label>
              <input
                v-model="formData.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: Informatique"
              />
            </div>

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
            {{ isLoading ? "Enregistrement..." : filiere ? "Modifier" : "Créer" }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
