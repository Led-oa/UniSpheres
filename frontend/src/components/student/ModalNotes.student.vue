<script setup>
import { ref, watch, onMounted } from "vue";
import { useNoteStore } from "../../stores/note.store";

// --- Props ---
const props = defineProps({
  courseId: {
    type: Number,
    required: true,
  },
  onClose: Function, // pour fermer le modal depuis le parent
});

// --- Store & données ---
const noteStore = useNoteStore();
const notes = ref([]);
const loading = ref(false);

// --- Charger les notes d'un cours donné ---
const loadNotes = async () => {
  if (!props.courseId) return;
  loading.value = true;
  try {
    const res = await noteStore.fetchByCourse(props.courseId);
    console.log("[ModalNotes] fetchByCourse:", res);
    notes.value = res?.data || [];
  } catch (err) {
    console.error("[ModalNotes] Erreur fetchByCourse:", err);
    notes.value = [];
  } finally {
    loading.value = false;
  }
};

// --- Recharger si courseId change ---
watch(
  () => props.courseId,
  () => {
    loadNotes();
  }
);

// --- Au montage ---
onMounted(() => {
  loadNotes();
});
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-xl w-full max-w-3xl shadow-lg relative">
      <button
        @click="onClose && onClose()"
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>

      <h3 class="text-xl font-bold text-gray-800 mb-4">Notes du cours</h3>

      <div v-if="loading" class="text-gray-500">Chargement...</div>

      <table v-else class="w-full table-auto border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2">Étudiant</th>
            <th class="border px-4 py-2">Note DS</th>
            <th class="border px-4 py-2">Note Examen</th>
            <th class="border px-4 py-2">Note Finale</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="note in notes" :key="note.student_id" class="text-center">
            <td class="border px-4 py-2 text-left">{{ note.student_name }}</td>
            <td class="border px-4 py-2">{{ note.note_ds ?? "-" }}</td>
            <td class="border px-4 py-2">{{ note.note_examen ?? "-" }}</td>
            <td class="border px-4 py-2 font-semibold">{{ note.note_final ?? "-" }}</td>
          </tr>
          <tr v-if="notes.length === 0">
            <td colspan="4" class="border px-4 py-2 text-gray-500">
              Aucune note disponible
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
