<script setup>
import { ref, computed, watch } from "vue";
import { useNoteStore } from "../../stores/note.store";

const props = defineProps({
  mode: { type: String, default: "add" }, // "add" ou "edit"
  studentList: { type: Array, default: () => [] },
  currentStudent: { type: Object, default: null }, // pour "edit"
  courseId: { type: [String, Number], required: true },
});

const emit = defineEmits(["close", "saved"]);

const noteStore = useNoteStore();

// --- États réactifs ---
const selectedStudentId = ref(props.currentStudent?.id || "");
const noteDS = ref(props.currentStudent?.note_ds ?? null);
const noteExam = ref(props.currentStudent?.note_examen ?? null);
const noteFinal = ref(props.currentStudent?.note_final ?? null);

// --- Watch currentStudent pour mode edit ---
watch(
  () => props.currentStudent,
  (val) => {
    if (props.mode === "edit" && val) {
      selectedStudentId.value = val.id || "";
      noteDS.value = val.note_ds ?? null;
      noteExam.value = val.note_examen ?? null;
      noteFinal.value = val.note_final ?? null;
    }
  },
  { immediate: true }
);

// --- Validation séparée ---
const canSaveAdd = computed(() => {
  const studentSelected = selectedStudentId.value;
  const dsValid = noteDS.value !== null && !isNaN(noteDS.value);
  const examValid = noteExam.value !== null && !isNaN(noteExam.value);
  const finalValid = noteFinal.value !== null && !isNaN(noteFinal.value);

  return studentSelected && (dsValid || examValid || finalValid);
});

const canSaveEdit = computed(() => {
  const dsValid = noteDS.value !== null && !isNaN(noteDS.value);
  const examValid = noteExam.value !== null && !isNaN(noteExam.value);
  const finalValid = noteFinal.value !== null && !isNaN(noteFinal.value);

  return dsValid || examValid || finalValid;
});

const canSave = computed(() => {
  return props.mode === "edit" ? canSaveEdit.value : canSaveAdd.value;
});

// --- Sauvegarde ---
const saveGrade = async () => {
  try {
    const payload = {
      course_id: props.courseId,
      student_id: selectedStudentId.value,
      note_ds: noteDS.value,
      note_examen: noteExam.value,
      note_final: noteFinal.value,
    };

    await noteStore.upSert(payload);
    emit("saved");
    emit("close");
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err);
    alert("Erreur lors de l'enregistrement.");
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg w-full max-w-md mx-auto shadow-lg">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ mode === "edit" ? "Modifier les notes" : "Attribuer des notes" }}
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          &times;
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-4 space-y-4">
        <!-- Add mode : selection étudiant -->
        <div v-if="mode === 'add'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Étudiant</label>
          <select
            v-model="selectedStudentId"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>Sélectionner un étudiant</option>
            <option v-for="s in studentList" :key="s.id" :value="s.id">
              {{ s.matricule }} - {{ s.name }} {{ s.lastname }}
            </option>
          </select>
        </div>

        <!-- Notes DS -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Note Devoir Surveiller</label
          >
          <input
            type="number"
            step="0.1"
            min="0"
            max="20"
            v-model.number="noteDS"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <!-- Notes Examen -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Note Examen</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="20"
            v-model.number="noteExam"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <!-- Note finale -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Note Final</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="20"
            v-model.number="noteFinal"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
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
          @click="saveGrade"
          :disabled="!canSave"
          class="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
        >
          {{ mode === "edit" ? "Modifier" : "Attribuer" }}
        </button>
      </div>
    </div>
  </div>
</template>
