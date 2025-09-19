<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg w-full max-w-lg mx-auto overflow-hidden shadow-lg">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900">Importer les notes</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          &times;
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-4 space-y-4">
        <!-- Upload input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Sélectionner un fichier (.csv / .xlsx)</label
          >
          <input
            type="file"
            accept=".csv,.xlsx"
            @change="handleFileChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <!-- Aperçu du fichier -->
        <div v-if="previewData.length > 0">
          <h3 class="text-sm font-semibold text-gray-800 mb-2">Aperçu des données</h3>
          <div class="overflow-x-auto max-h-60 border border-gray-200 rounded-md p-2">
            <table class="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 py-1 text-left">Matricule</th>
                  <th class="px-3 py-1 text-left">Nom</th>
                  <th class="px-3 py-1 text-left">Prénom</th>
                  <th class="px-3 py-1 text-left">DS</th>
                  <th class="px-3 py-1 text-left">Examen</th>
                  <th class="px-3 py-1 text-left">Final</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in previewData" :key="index">
                  <td class="px-3 py-1">{{ row.matricule }}</td>
                  <td class="px-3 py-1">{{ row.nom }}</td>
                  <td class="px-3 py-1">{{ row.prenom }}</td>
                  <td class="px-3 py-1">{{ row.note_ds }}</td>
                  <td class="px-3 py-1">{{ row.note_examen }}</td>
                  <td class="px-3 py-1">{{ row.note_final }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3"
      >
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Annuler
        </button>
        <button
          @click="importGrades"
          :disabled="previewData.length === 0"
          class="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-300"
        >
          Importer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import * as XLSX from "xlsx"; // Pour parser Excel et CSV
import { useNoteStore } from "../../stores/note.store";

const noteStore = useNoteStore();

const previewData = ref([]);
const selectedFile = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  selectedFile.value = file;

  const reader = new FileReader();

  reader.onload = (e) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: null });
    // json doit avoir les colonnes : matricule, nom, prenom, note_ds, note_examen, note_final
    previewData.value = json;
  };

  if (file.name.endsWith(".csv")) {
    reader.readAsText(file);
  } else {
    reader.readAsBinaryString(file);
  }
};

const importGrades = async () => {
  try {
    await noteStore.bulkUpsert(selectedFile.value);
    previewData.value = [];
    selectedFile.value = null;
    alert("Import réussi !");
    // Fermer le modal
    $emit("close");
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'import.");
  }
};
</script>

<style scoped>
/* Modal animation */
</style>
