<script setup>
import { ref, watch } from "vue";
import { useFileStore } from "../../stores/file.store";

const props = defineProps({
  courseId: { type: Number, required: true },
  isOpen: { type: Boolean, required: true },
});

const emit = defineEmits(["close", "uploaded"]);

const fileStore = useFileStore();
const selectedFile = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) selectedFile.value = file;
};

const uploadFile = async () => {
  if (!selectedFile.value) return;

  const formData = new FormData();
  formData.append("file", selectedFile.value);
  formData.append("owner_type", "course");
  formData.append("owner_id", props.courseId);

  try {
    await fileStore.uploadFile(formData, "course");
    emit("uploaded"); // Prévenir le parent de recharger le cours
    selectedFile.value = null;
    emit("close"); // Fermer le modal
  } catch (err) {
    console.error("Erreur lors de l'upload :", err);
    alert("Erreur lors de l'upload du fichier : " + err.message);
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-lg w-full max-w-md mx-auto p-6 space-y-4">
      <h2 class="text-lg font-semibold text-gray-900">Ajouter un fichier</h2>

      <div
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
      >
        <input type="file" class="hidden" id="file-upload" @change="handleFileChange" />
        <label for="file-upload">
          <p class="text-sm text-gray-600 mb-2">
            Cliquez pour sélectionner un fichier ou glissez-déposez
          </p>
          <p class="text-xs text-gray-500">PDF, DOCX, PPTX, XLSX (Max. 10MB)</p>
        </label>
      </div>

      <div
        v-if="selectedFile"
        class="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
      >
        <div class="flex items-center">
          <span class="text-lg mr-2">📄</span>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
            <p class="text-xs text-gray-500">
              {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB
            </p>
          </div>
        </div>
        <button @click="selectedFile = null" class="text-gray-400 hover:text-gray-600">
          ✖️
        </button>
      </div>

      <div class="flex justify-end space-x-3 mt-4">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Annuler
        </button>
        <button
          @click="uploadFile"
          :disabled="!selectedFile || fileStore.loading"
          :class="[
            'px-4 py-2 text-sm text-white rounded-md',
            selectedFile && !fileStore.loading
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-400 cursor-not-allowed',
          ]"
        >
          <span v-if="fileStore.loading">Téléchargement...</span>
          <span v-else>Ajouter</span>
        </button>
      </div>
    </div>
  </div>
</template>
