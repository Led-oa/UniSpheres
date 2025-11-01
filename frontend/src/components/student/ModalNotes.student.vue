<script setup>
import { ref, watch, onMounted } from "vue";
import { useNoteStore } from "../../stores/note.store";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

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

// --- Formater une note ---
const formatNote = (note) => {
  if (note === null || note === undefined) return "-";
  return Number(note).toFixed(1);
};

// --- Couleur selon la note ---
const getNoteColor = (note) => {
  if (note === null || note === undefined) return "text-gray-400";
  const numNote = Number(note);
  if (numNote >= 16) return "text-green-600 font-semibold";
  if (numNote >= 14) return "text-blue-600";
  if (numNote >= 12) return "text-yellow-600";
  if (numNote >= 10) return "text-orange-600";
  return "text-red-600 font-semibold";
};
</script>

<template>
  <TransitionRoot as="template" :show="true">
    <Dialog as="div" class="relative z-50" @close="onClose && onClose()">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6"
            >
              <!-- En-tête du modal -->
              <div class="flex items-center justify-between mb-6">
                <DialogTitle as="h3" class="text-xl font-bold leading-6 text-gray-900">
                  Notes du cours
                </DialogTitle>
                <button
                  @click="onClose && onClose()"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Contenu du modal -->
              <div class="transition-all duration-300">
                <!-- État de chargement -->
                <div
                  v-if="loading"
                  class="flex flex-col items-center justify-center py-12 transition-all duration-300"
                >
                  <div
                    class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 transition-colors duration-200"
                  ></div>
                  <p class="text-gray-600 font-medium transition-colors duration-200">
                    Chargement des notes...
                  </p>
                </div>

                <!-- Tableau des notes -->
                <div v-else class="overflow-x-auto transition-all duration-300">
                  <table
                    class="min-w-full divide-y divide-gray-200 border border-gray-200 transition-colors duration-200"
                  >
                    <thead class="bg-gray-50 transition-colors duration-200">
                      <tr class="transition-colors duration-200">
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200"
                        >
                          Étudiant
                        </th>
                        <th
                          class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200"
                        >
                          Note DS
                        </th>
                        <th
                          class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200"
                        >
                          Note Examen
                        </th>
                        <th
                          class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200"
                        >
                          Note Finale
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      class="bg-white divide-y divide-gray-200 transition-colors duration-200"
                    >
                      <tr
                        v-for="note in notes"
                        :key="note.student_id"
                        class="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 transition-colors duration-200"
                        >
                          {{ note.student_name }} {{ note.student_lastname }}
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-center transition-colors duration-200"
                          :class="getNoteColor(note.note_ds)"
                        >
                          {{ formatNote(note.note_ds) }}
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-center transition-colors duration-200"
                          :class="getNoteColor(note.note_examen)"
                        >
                          {{ formatNote(note.note_examen) }}
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold transition-colors duration-200"
                          :class="getNoteColor(note.note_final)"
                        >
                          {{ formatNote(note.note_final) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- État vide -->
                <div
                  v-if="!loading && notes.length === 0"
                  class="text-center py-12 text-gray-500 transition-all duration-300"
                >
                  <svg
                    class="w-16 h-16 text-gray-400 mx-auto mb-4 transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p
                    class="text-lg font-medium text-gray-600 mb-2 transition-colors duration-200"
                  >
                    Aucune note disponible
                  </p>
                  <p class="text-sm text-gray-500 transition-colors duration-200">
                    Aucune note n'a été saisie pour ce cours.
                  </p>
                </div>
              </div>

              <!-- Pied du modal -->
              <div class="mt-6 flex justify-end transition-all duration-300">
                <button
                  @click="onClose && onClose()"
                  class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 ease-in-out"
                >
                  Fermer
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Transitions globales */
* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
