<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg w-full max-w-md mx-auto shadow-lg">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900">
          <template v-if="mode === 'edit'">Modifier les notes</template>
          <template v-else>Attribuer des notes</template>
        </h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <!-- Body: Add mode -->
      <div v-if="mode === 'add'" class="px-6 py-4 space-y-4">
        <p class="text-sm text-gray-600">
          Sélectionnez un étudiant puis saisissez au moins une note.
        </p>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Étudiant</label>
          <select
            v-model="selectedStudentId"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>-- Sélectionner un étudiant --</option>
            <option v-for="s in studentList" :key="studentKey(s)" :value="studentKey(s)">
              {{ studentDisplay(s) }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Note DS (0-20)</label
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Note Examen (0-20)</label
            >
            <input
              type="number"
              step="0.1"
              min="0"
              max="20"
              v-model.number="noteExam"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Note Finale (0-20)</label
            >
            <input
              type="number"
              step="0.1"
              min="0"
              max="20"
              v-model.number="noteFinal"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p class="text-xs text-gray-500 mt-1">
              La note finale est saisie manuellement.
            </p>
          </div>
        </div>

        <div v-if="validationMessage" class="text-sm text-red-600">
          {{ validationMessage }}
        </div>
      </div>

      <!-- Body: Edit mode -->
      <div v-else class="px-6 py-4 space-y-4">
        <p class="text-sm text-gray-600">
          Modification des notes pour :
          <strong>{{ studentDisplay(currentStudent) }}</strong>
        </p>

        <div class="grid grid-cols-1 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Note DS (0-20)</label
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Note Examen (0-20)</label
            >
            <input
              type="number"
              step="0.1"
              min="0"
              max="20"
              v-model.number="noteExam"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Note Finale (0-20)</label
            >
            <input
              type="number"
              step="0.1"
              min="0"
              max="20"
              v-model.number="noteFinal"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p class="text-xs text-gray-500 mt-1">
              La note finale est saisie manuellement.
            </p>
          </div>
        </div>

        <div v-if="validationMessage" class="text-sm text-red-600">
          {{ validationMessage }}
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
          :disabled="!canSave"
          @click="saveGrade"
          :class="[
            'px-4 py-2 text-sm text-white rounded-md',
            canSave ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed',
          ]"
        >
          {{ mode === "edit" ? "Modifier" : "Attribuer" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * ModalAttributeGrade.teacher.vue
 * Rewritten from scratch with:
 *  - separate add / edit UI
 *  - separate validation rules
 *  - console.log traces everywhere
 */

import { ref, computed, watch } from "vue";
import { useNoteStore } from "../../stores/note.store";

console.log("[Modal] initializing component file");

const props = defineProps({
  mode: { type: String, default: "add" }, // "add" or "edit"
  studentList: { type: Array, default: () => [] },
  currentStudent: { type: Object, default: null }, // used in edit mode
  courseId: { type: [String, Number], required: true },
});

const emit = defineEmits(["close", "saved"]);

console.log("[Modal] props:", JSON.parse(JSON.stringify(props)));

const noteStore = useNoteStore();

// Reactive fields
const selectedStudentId = ref("");
const noteDS = ref(null);
const noteExam = ref(null);
const noteFinal = ref(null);

// When in edit mode we prefill from currentStudent
const currentStudent = props.currentStudent || null;

console.log("[Modal] currentStudent initial:", currentStudent);

// Helper: extract stable student key/id
const studentKey = (s) => {
  // support id_user, id, student_id
  return s?.id_user ?? s?.id ?? s?.student_id ?? "";
};

// Helper: student display string
const studentDisplay = (s) => {
  if (!s) return "";
  const matricule = s?.matricule ?? s?.student_matricule ?? s?.mat ?? "";
  const lastname = s?.lastname ?? s?.lastname ?? s?.nom ?? s?.student_lastname ?? "";
  const name = s?.name ?? s?.firstname ?? s?.prenom ?? s?.student_name ?? "";
  return `${matricule ? matricule + " - " : ""}${lastname} ${name}`.trim();
};

// Initialize fields from props.currentStudent when provided
const initFromCurrent = () => {
  console.log("[Modal] initFromCurrent() called, mode=", props.mode);
  if (props.mode === "edit" && props.currentStudent) {
    const s = props.currentStudent;
    selectedStudentId.value = studentKey(s) || "";
    noteDS.value = s?.note_ds ?? null;
    noteExam.value = s?.note_examen ?? null;
    noteFinal.value = s?.note_final ?? null;
    console.log("[Modal] prefilled edit values:", {
      selectedStudentId: selectedStudentId.value,
      noteDS: noteDS.value,
      noteExam: noteExam.value,
      noteFinal: noteFinal.value,
    });
  } else {
    // clear for add mode
    selectedStudentId.value = "";
    noteDS.value = null;
    noteExam.value = null;
    noteFinal.value = null;
    console.log("[Modal] cleared fields for add mode");
  }
};

// call init once
initFromCurrent();

// watch for prop changes
watch(
  () => props.currentStudent,
  (nv) => {
    console.log("[Modal] props.currentStudent changed:", nv);
    initFromCurrent();
  }
);

watch(
  () => props.mode,
  (nv) => {
    console.log("[Modal] props.mode changed:", nv);
    initFromCurrent();
  }
);

// Validation messages
const validationMessage = ref("");

// Validation rules
const validateAdd = () => {
  console.log("[Modal] validateAdd()", {
    selectedStudentId: selectedStudentId.value,
    noteDS: noteDS.value,
    noteExam: noteExam.value,
    noteFinal: noteFinal.value,
  });

  if (!selectedStudentId.value) {
    validationMessage.value = "Veuillez sélectionner un étudiant.";
    console.log("[Modal] validateAdd -> missing student");
    return false;
  }

  // Require at least one note to be provided (non-null and numeric)
  const hasNote =
    (noteDS.value !== null && noteDS.value !== "") ||
    (noteExam.value !== null && noteExam.value !== "") ||
    (noteFinal.value !== null && noteFinal.value !== "");
  if (!hasNote) {
    validationMessage.value = "Veuillez saisir au moins une note (DS, Examen ou Finale).";
    console.log("[Modal] validateAdd -> missing notes");
    return false;
  }

  // Optionally enforce range checks
  const inRange = (n) =>
    n === null || n === ""
      ? true
      : !(isNaN(Number(n)) || Number(n) < 0 || Number(n) > 20);
  if (!inRange(noteDS.value) || !inRange(noteExam.value) || !inRange(noteFinal.value)) {
    validationMessage.value = "Les notes doivent être des nombres entre 0 et 20.";
    console.log("[Modal] validateAdd -> note out of range");
    return false;
  }

  validationMessage.value = "";
  console.log("[Modal] validateAdd -> ok");
  return true;
};

const validateEdit = () => {
  console.log("[Modal] validateEdit()", {
    noteDS: noteDS.value,
    noteExam: noteExam.value,
    noteFinal: noteFinal.value,
  });

  // In edit mode student is provided via currentStudent; ensure it's there
  if (!props.currentStudent) {
    validationMessage.value = "Étudiant introuvable pour la modification.";
    console.log("[Modal] validateEdit -> missing currentStudent");
    return false;
  }

  const hasNote =
    (noteDS.value !== null && noteDS.value !== "") ||
    (noteExam.value !== null && noteExam.value !== "") ||
    (noteFinal.value !== null && noteFinal.value !== "");
  if (!hasNote) {
    validationMessage.value = "Veuillez saisir au moins une note à modifier.";
    console.log("[Modal] validateEdit -> missing notes");
    return false;
  }

  const inRange = (n) =>
    n === null || n === ""
      ? true
      : !(isNaN(Number(n)) || Number(n) < 0 || Number(n) > 20);
  if (!inRange(noteDS.value) || !inRange(noteExam.value) || !inRange(noteFinal.value)) {
    validationMessage.value = "Les notes doivent être des nombres entre 0 et 20.";
    console.log("[Modal] validateEdit -> note out of range");
    return false;
  }

  validationMessage.value = "";
  console.log("[Modal] validateEdit -> ok");
  return true;
};

// computed canSave that uses separate validation per mode
const canSave = computed(() => {
  console.log("[Modal] computed canSave evaluating, mode=", props.mode);
  const ok = props.mode === "edit" ? validateEdit() : validateAdd();
  console.log("[Modal] computed canSave result:", ok);
  return ok;
});

// Close helper
const close = () => {
  console.log("[Modal] close() emit");
  emit("close");
};

// Save handler
const saveGrade = async () => {
  console.log("[Modal] saveGrade() called, mode=", props.mode);
  try {
    // run validation again to ensure message is set
    const valid = props.mode === "edit" ? validateEdit() : validateAdd();
    if (!valid) {
      console.log(
        "[Modal] saveGrade aborted: validation failed ->",
        validationMessage.value
      );
      return;
    }

    const studentIdToSend =
      props.mode === "edit" ? studentKey(props.currentStudent) : selectedStudentId.value;

    const payload = {
      course_id: props.courseId,
      student_id: studentIdToSend,
      note_ds: noteDS.value === "" ? null : noteDS.value,
      note_examen: noteExam.value === "" ? null : noteExam.value,
      note_final: noteFinal.value === "" ? null : noteFinal.value,
    };

    console.log("[Modal] payload prepared:", payload);

    // Call store upSert
    const res = await noteStore.upSert(payload);
    console.log("[Modal] upSert response:", res);

    emit("saved", res);
    emit("close");
    console.log("[Modal] saved & close emitted");
  } catch (err) {
    console.error("[Modal] saveGrade error:", err);
    validationMessage.value = "Erreur lors de l'enregistrement des notes.";
  }
};
</script>

<style scoped>
/* small scoped styles if needed */
</style>
