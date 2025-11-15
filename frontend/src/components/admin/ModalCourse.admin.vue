<script setup>
import { ref, watch, computed } from "vue";
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from "@headlessui/vue";

const props = defineProps({
  show: { type: Boolean, required: true },
  type: { type: String, default: "add" }, // add | edit | info
  course: { type: Object, default: () => ({}) },
  classes: { type: Array, default: () => [] },
  teachers: { type: Array, default: () => [] },
});

const emit = defineEmits(["close", "created", "updated"]);

const localCourse = ref({ ...props.course });

// Synchroniser quand la prop change
watch(
  () => props.course,
  (newVal) => {
    localCourse.value = { ...newVal };
  }
);

const modalTitle = computed(() => {
  const titles = {
    add: "Créer un nouveau cours",
    edit: "Modifier le cours",
    info: "Détails du cours",
  };
  return titles[props.type] || "";
});

const modalDescription = computed(() => {
  const descriptions = {
    add: "Remplissez les informations pour créer un nouveau cours",
    edit: "Modifiez les informations du cours existant",
    info: "Consultez les détails complets du cours",
  };
  return descriptions[props.type] || "";
});

// Fonctions actions
const handleAdd = () => {
  emit("created", localCourse.value);
  emit("close");
};

const handleEdit = () => {
  emit("updated", localCourse.value);
  emit("close");
};

// Helpers
const getClassName = (id) => {
  const cl = props.classes.find((c) => c.id_class === id);
  return cl ? cl.name : "-";
};

const getTeacherName = (id) => {
  const t = props.teachers.find((t) => t.id_user === id);
  return t ? `${t.name} ${t.lastname}` : "-";
};
</script>

<template>
  <Dialog :open="show" @close="$emit('close')" class="relative z-50">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity" />

    <!-- Modal container -->
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel
        class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <DialogTitle class="text-xl font-semibold text-gray-900">
              {{ modalTitle }}
            </DialogTitle>
            <DialogDescription class="mt-1 text-sm text-gray-600">
              {{ modalDescription }}
            </DialogDescription>
          </div>
          <button
            @click="$emit('close')"
            class="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <!-- Formulaire création/édition -->
          <form
            v-if="type === 'add' || type === 'edit'"
            @submit.prevent="type === 'add' ? handleAdd() : handleEdit()"
            class="space-y-6"
          >
            <!-- Titre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Titre <span class="text-red-500">*</span>
              </label>
              <input
                v-model="localCourse.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Entrez le titre du cours"
              />
            </div>

            <!-- Classe et Enseignant -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Classe
                </label>
                <select
                  v-model="localCourse.class_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Sélectionnez une classe</option>
                  <option v-for="cl in classes" :key="cl.id_class" :value="cl.id_class">
                    {{ cl.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Enseignant
                </label>
                <select
                  v-model="localCourse.teach_by"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Sélectionnez un enseignant</option>
                  <option v-for="t in teachers" :key="t.id_user" :value="t.id_user">
                    {{ t.name }} {{ t.lastname }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Contenu -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Contenu
              </label>
              <textarea
                v-model="localCourse.content"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Décrivez le contenu du cours..."
              ></textarea>
            </div>

            <!-- Durée -->
            <div class="w-48">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Durée (heures)
              </label>
              <input
                v-model="localCourse.duration"
                type="number"
                min="0"
                step="0.5"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <!-- Crédits -->
            <div class="w-48">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Crédits
              </label>
              <input
                v-model="localCourse.credits"
                type="number"
                min="0"
                step="0.5"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </form>

          <!-- Informations du cours -->
          <div v-else-if="type === 'info'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <h3 class="text-sm font-medium text-gray-500">Titre</h3>
                <p class="text-gray-900">{{ localCourse.title || "-" }}</p>
              </div>

              <div class="space-y-1">
                <h3 class="text-sm font-medium text-gray-500">Classe</h3>
                <p class="text-gray-900">{{ getClassName(localCourse.class_id) }}</p>
              </div>

              <div class="space-y-1">
                <h3 class="text-sm font-medium text-gray-500">Enseignant</h3>
                <p class="text-gray-900">{{ getTeacherName(localCourse.teach_by) }}</p>
              </div>

              <div class="space-y-1">
                <h3 class="text-sm font-medium text-gray-500">Durée</h3>
                <p class="text-gray-900">{{ localCourse.duration || 0 }} heures</p>
              </div>

              <div class="space-y-1">
                <h3 class="text-sm font-medium text-gray-500">Crédits</h3>
                <p class="text-gray-900">{{ localCourse.credits || 0 }}</p>
              </div>
            </div>

            <!-- Contenu -->
            <div class="space-y-1">
              <h3 class="text-sm font-medium text-gray-500">Contenu</h3>
              <p class="text-gray-900 whitespace-pre-wrap">
                {{ localCourse.content || "Aucun contenu" }}
              </p>
            </div>

            <!-- Fichiers -->
            <div v-if="localCourse.files && localCourse.files.length" class="space-y-3">
              <h3 class="text-sm font-medium text-gray-500">Fichiers attachés</h3>
              <div class="space-y-2">
                <a
                  v-for="f in localCourse.files"
                  :key="f.id_file"
                  :href="f.file_path"
                  target="_blank"
                  class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <svg
                    class="w-5 h-5 text-gray-400 mr-3 group-hover:text-blue-500 transition-colors"
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
                  <span class="text-gray-700 group-hover:text-blue-600 transition-colors">
                    {{ f.file_name }}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="flex justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl"
        >
          <button
            v-if="type === 'info'"
            @click="$emit('close')"
            class="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Fermer
          </button>

          <template v-else>
            <button
              type="button"
              @click="$emit('close')"
              class="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              @click="type === 'add' ? handleAdd() : handleEdit()"
              class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {{ type === "add" ? "Créer" : "Enregistrer" }}
            </button>
          </template>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
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

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
