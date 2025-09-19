<script setup>
import { ref, reactive, watch } from "vue";
import { useAnnonceStore } from "../../stores/annonce.store";

const props = defineProps({
  mode: { type: String, required: true }, // "add" | "edit" | "info"
  show: { type: Boolean, required: true },
  annonce: { type: Object, default: null },
});
const emit = defineEmits(["close", "saved", "updated"]);
const store = useAnnonceStore();

const form = reactive({
  title: "",
  content: "",
  type: "general",
  priority: "medium",
  deadline: "",
  target_class_id: "",
  target_filiere_id: "",
  target_year_id: "",
  is_visible: true,
});

const newFiles = ref([]);
const removeFileIds = ref([]);

// Pré-remplissage en mode edit/info
watch(
  () => props.annonce,
  (a) => {
    if (a && (props.mode === "edit" || props.mode === "info")) {
      Object.assign(form, {
        title: a.title,
        content: a.content,
        type: a.type,
        priority: a.priority,
        deadline: a.deadline ? a.deadline.slice(0, 10) : "",
        target_class_id: a.target_class_id || "",
        target_filiere_id: a.target_filiere_id || "",
        target_year_id: a.target_year_id || "",
        is_visible: Boolean(a.is_visible),
      });
    }
  },
  { immediate: true }
);

const handleFiles = (e) => (newFiles.value = Array.from(e.target.files));
const removeExistingFile = (id) =>
  !removeFileIds.value.includes(id) && removeFileIds.value.push(id);

const saveAnnonce = async () => {
  try {
    if (props.mode === "add") {
      await store.createAnnonce(form, newFiles.value);
      emit("saved");
    } else if (props.mode === "edit" && props.annonce) {
      await store.updateAnnonce(
        props.annonce.id_annonce,
        form,
        newFiles.value,
        removeFileIds.value
      );
      emit("updated");
    }
    emit("close");
  } catch (err) {
    alert("Erreur : " + err.message);
  }
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        class="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]"
      >
        <!-- HEADER -->
        <header class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800">
            <span v-if="mode === 'add'">Nouvelle annonce</span>
            <span v-else-if="mode === 'edit'">Modifier l'annonce</span>
            <span v-else>Détails de l'annonce</span>
          </h2>
          <button
            @click="emit('close')"
            class="text-gray-500 hover:text-gray-800 text-xl font-bold"
          >
            ×
          </button>
        </header>

        <!-- MODE INFO -->
        <template v-if="mode === 'info' && annonce">
          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-purple-700">{{ annonce.title }}</h3>
            <p class="text-gray-700 whitespace-pre-wrap">{{ annonce.content }}</p>

            <div class="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Publié par :</strong> {{ annonce.posted_by_name }}
                {{ annonce.posted_by_lastname }}
              </p>
              <p><strong>Classe :</strong> {{ annonce.class_name }}</p>
              <p><strong>Filière :</strong> {{ annonce.filiere_name }}</p>
              <p><strong>Niveau :</strong> {{ annonce.year_value }}</p>
              <p><strong>Type :</strong> {{ annonce.type }}</p>
              <p><strong>Priorité :</strong> {{ annonce.priority }}</p>
              <p>
                <strong>Date limite :</strong>
                {{
                  annonce.deadline ? new Date(annonce.deadline).toLocaleDateString() : "—"
                }}
              </p>
            </div>

            <div v-if="annonce.files?.length" class="space-y-2">
              <h4 class="font-semibold">Fichiers :</h4>
              <ul class="space-y-1">
                <li v-for="f in annonce.files" :key="f.id_file">
                  <a
                    :href="`/${f.file_path}`"
                    target="_blank"
                    class="text-blue-600 underline"
                  >
                    {{ f.file_name }}
                  </a>
                  <img
                    v-if="/\.(png|jpe?g|gif)$/i.test(f.file_name)"
                    :src="`/${f.file_path}`"
                    class="mt-2 max-h-48 rounded border"
                  />
                </li>
              </ul>
            </div>
          </div>
        </template>

        <!-- MODE ADD / EDIT -->
        <template v-else>
          <form @submit.prevent="saveAnnonce" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block font-medium">Titre</label>
                <input
                  v-model="form.title"
                  required
                  class="w-full border rounded-md px-3 py-2 mt-1 text-sm"
                />
              </div>
              <div>
                <label class="block font-medium">Type</label>
                <select
                  v-model="form.type"
                  class="w-full border rounded-md px-3 py-2 mt-1 text-sm"
                >
                  <option value="general">Général</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label class="block font-medium">Priorité</label>
                <select
                  v-model="form.priority"
                  class="w-full border rounded-md px-3 py-2 mt-1 text-sm"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
              <div>
                <label class="block font-medium">Date limite</label>
                <input
                  type="date"
                  v-model="form.deadline"
                  class="w-full border rounded-md px-3 py-2 mt-1 text-sm"
                />
              </div>
            </div>

            <div>
              <label class="block font-medium">Contenu</label>
              <textarea
                v-model="form.content"
                rows="4"
                class="w-full border rounded-md px-3 py-2 mt-1 text-sm"
              ></textarea>
            </div>

            <div>
              <label class="block font-medium">Fichiers</label>
              <input type="file" multiple @change="handleFiles" class="mt-1 text-sm" />
              <ul
                v-if="newFiles.length"
                class="mt-2 text-sm text-gray-600 list-disc list-inside"
              >
                <li v-for="f in newFiles" :key="f.name">{{ f.name }}</li>
              </ul>
            </div>

            <div v-if="mode === 'edit' && annonce?.files?.length">
              <h4 class="font-medium">Fichiers existants</h4>
              <ul class="space-y-1 text-sm">
                <li
                  v-for="f in annonce.files"
                  :key="f.id_file"
                  class="flex items-center justify-between"
                >
                  <a
                    :href="`/${f.file_path}`"
                    target="_blank"
                    class="text-blue-600 underline"
                  >
                    {{ f.file_name }}
                  </a>
                  <button
                    type="button"
                    class="text-red-500 hover:underline text-xs"
                    @click="removeExistingFile(f.id_file)"
                  >
                    Supprimer
                  </button>
                </li>
              </ul>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="emit('close')"
                class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                v-if="mode === 'add'"
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Créer
              </button>
              <button
                v-else-if="mode === 'edit'"
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Mettre à jour
              </button>
            </div>
          </form>
        </template>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
