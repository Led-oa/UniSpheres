<!-- components/teacher/ModalUploadGrades.teacher.vue -->
<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg w-full max-w-2xl mx-auto shadow-lg">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900">
          Importer les notes (CSV ou Excel)
        </h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <!-- Body -->
      <div class="px-6 py-4 space-y-4">
        <p class="text-sm text-gray-600">
          Sélectionnez un fichier .csv ou .xlsx contenant les colonnes :
          <strong>course</strong>, <strong>matricule</strong>, <strong>note_ds</strong>,
          <strong>note_examen</strong>, <strong>note_final</strong>.
        </p>

        <!-- File input -->
        <input
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          @change="onFileChange"
          class="w-full border border-gray-300 px-3 py-2 rounded-md"
        />

        <!-- Preview -->
        <div v-if="previewData.length" class="overflow-x-auto border rounded-md max-h-64">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th v-for="(h, i) in previewHeaders" :key="i" class="px-2 py-1 text-left">
                  {{ h }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, r) in previewData" :key="r" class="border-t">
                <td v-for="(h, i) in previewHeaders" :key="i" class="px-2 py-1">
                  {{ row[h] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="errorMessage" class="text-sm text-red-600 mt-2">
          {{ errorMessage }}
        </div>
      </div>

      <!-- Footer -->
      <div
        class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3"
      >
        <button
          @click="close"
          class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Annuler
        </button>

        <button
          :disabled="!canImport"
          @click="importGrades"
          :class="[
            'px-4 py-2 text-sm text-white rounded-md',
            canImport
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 cursor-not-allowed',
          ]"
        >
          Importer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * ModalUploadGrades.teacher.vue
 * Fresh rewrite with heavy console logging
 * - Select CSV/XLSX file
 * - Preview content
 * - Send parsed data to bulkUpsert
 */

import { ref, computed } from "vue";
import { useNoteStore } from "../../stores/note.store";
// import { parseNotesFile } from "../../utils/gradeFile.util";
import { parseNotesFile } from "../../utils/parseNoteFile";

console.log("[UploadModal] component created");

const props = defineProps({
  courseId: { type: [String, Number], required: true },
});
const emit = defineEmits(["close", "saved"]);

const noteStore = useNoteStore();

// Local state
const selectedFile = ref(null);
const previewData = ref([]);
const previewHeaders = ref([]);
const errorMessage = ref("");

const close = () => {
  console.log("[UploadModal] close()");
  emit("close");
};

/**
 * When file input changes
 */
const onFileChange = async (e) => {
  console.log("[UploadModal] onFileChange fired");
  const file = e.target.files[0];
  selectedFile.value = file;
  errorMessage.value = "";
  previewData.value = [];
  previewHeaders.value = [];

  if (!file) {
    console.log("[UploadModal] no file selected");
    return;
  }

  console.log("[UploadModal] file selected:", file.name, file.type, file.size);

  try {
    // parseNotesFile returns {notesData: [], headers: []}
    const { notesData, headers } = await parseNotesFile(file);
    console.log("[UploadModal] parseNotesFile success", notesData);

    previewData.value = notesData.slice(0, 20); // show first 20 rows as preview
    previewHeaders.value = headers;
  } catch (err) {
    console.error("[UploadModal] parse error:", err);
    errorMessage.value = "Impossible de lire le fichier : " + err.message;
  }
};

const canImport = computed(() => {
  const ok = previewData.value.length > 0 && !errorMessage.value;
  console.log("[UploadModal] computed canImport =", ok);
  return ok;
});

/**
 * Send data to API
 */
const importGrades = async () => {
  console.log("[UploadModal] importGrades called");
  if (!canImport.value) {
    console.log("[UploadModal] importGrades aborted: canImport is false");
    return;
  }

  try {
    const payload = {
      notes: previewData.value.map((n) => ({
        course_id: props.courseId,
        student_id: n.student_id,
        note_ds: n.note_ds,
        note_examen: n.note_examen,
        note_final: n.note_final,
      })),
    };

    console.log("[UploadModal] payload to bulkUpsert:", payload);

    const res = await noteStore.bulkUpsert(payload);
    console.log("[UploadModal] bulkUpsert result:", res);

    emit("saved", res);
    emit("close");
    console.log("[UploadModal] emit saved + close");
  } catch (err) {
    console.error("[UploadModal] importGrades error:", err);
    errorMessage.value = "Erreur lors de l'importation : " + err.message;
  }
};
</script>
