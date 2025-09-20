<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useAnnonceStore } from "../../stores/annonce.store";
import { useClasseStore } from "../../stores/academique/classe.store";
import { useFiliereStore } from "../../stores/academique/filiere.store";
import { useYearStore } from "../../stores/academique/year.store";

const props = defineProps({
  mode: { type: String, required: true }, // "add" | "edit" | "info"
  show: { type: Boolean, required: true },
  annonce: { type: Object, default: null },
  postedBy: { type: Number, required: true },
});
const emit = defineEmits(["close", "saved", "updated"]);

const store = useAnnonceStore();
const classeStore = useClasseStore();
const filiereStore = useFiliereStore();
const yearStore = useYearStore();

// --- Formulaire ---
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

// --- Listes dynamiques ---
const classes = ref([]);
const filieres = ref([]);
const years = ref([]);

// --- Reset form function ---
const resetForm = () => {
  Object.assign(form, {
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
  newFiles.value = [];
  removeFileIds.value = [];
};

// --- Charger les listes depuis les stores ---
const loadLists = async () => {
  await classeStore.fetchClasses();
  await filiereStore.fetchFilieres();
  await yearStore.fetchYears();

  classes.value = classeStore.classes;
  filieres.value = filiereStore.filieres;
  years.value = yearStore.years;
};

// --- Pré-remplissage en mode edit/info ---
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

// --- Watch for modal close to reset form ---
watch(
  () => props.show,
  (isVisible) => {
    if (!isVisible) {
      // Reset form when modal closes
      resetForm();
    }
  }
);

// --- Gestion fichiers ---
const handleFiles = (e) => (newFiles.value = Array.from(e.target.files));
const removeExistingFile = (id) =>
  !removeFileIds.value.includes(id) && removeFileIds.value.push(id);

// --- Sauvegarde ---
const saveAnnonce = async () => {
  try {
    if (props.mode === "add") {
      const payload = { ...form, posted_by: props.postedBy };
      const newAnnonce = await store.createAnnonce(payload, newFiles.value);
      emit("saved", newAnnonce);
    } else if (props.mode === "edit" && props.annonce) {
      const updated = await store.updateAnnonce(
        props.annonce.id_annonce,
        form,
        newFiles.value,
        removeFileIds.value
      );
      emit("updated", updated);
    }
    resetForm();
    emit("close");
  } catch (err) {
    alert("Erreur : " + err.message);
  }
};

// --- On mounted ---
onMounted(() => {
  loadLists();
});
</script>

<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        class="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]"
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
              <p><strong>Visible :</strong> {{ annonce.is_visible ? "Oui" : "Non" }}</p>
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
            <div class="grid md:grid-cols-3 gap-4">
              <!-- Titre -->
              <div>
                <label class="block font-medium">Titre</label>
                <input
                  v-model="form.title"
                  required
                  class="w-full border rounded-md px-3 py-2 mt-1 text-sm"
                />
              </div>

              <!-- Type -->
              <div>
                <label class="block font-medium">Type</label>
                <select
                  v-model="form.type"
                  class="w-full border rounded-md px-3 py-2 mt-1 text-sm"
                >
                  <option value="general">Général</option>
                  <option value="cours">Cours</option>
                  <option value="evenement">Evenement</option>
                </select>
              </div>

              <!-- Priorité -->
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

              <!-- Classe -->
              <div>
                <label class="block font-medium">Classe</label>
                <select
                  v-model="form.target_class_id"
                  class="w-full border rounded-md px-3 py-2 mt-1 text-sm"
                >
                  <option value="">-- Choisir une classe --</option>
                  <option v-for="c in classes" :key="c.id_class" :value="c.id_class">
                    {{ c.name }}
                  </option>
                </select>
              </div>

              <!-- Filière -->
              <div>
                <label class="block font-medium">Filière</label>
                <select
                  v-model="form.target_filiere_id"
                  class="w-full border rounded-md px-3 py-2 mt-1 text-sm"
                >
                  <option value="">-- Choisir une filière --</option>
                  <option v-for="f in filieres" :key="f.id_filiere" :value="f.id_filiere">
                    {{ f.name }}
                  </option>
                </select>
              </div>

              <!-- Année / Niveau -->
              <div>
                <label class="block font-medium"> Niveau</label>
                <select
                  v-model="form.target_year_id"
                  class="w-full border rounded-md px-3 py-2 mt-1 text-sm"
                >
                  <option value="">-- Choisir un niveau --</option>
                  <option v-for="y in years" :key="y.id_year" :value="y.id_year">
                    {{ y.year_value }}
                  </option>
                </select>
              </div>

              <!-- Date limite -->
              <div>
                <label class="block font-medium">Date limite</label>
                <input
                  type="date"
                  v-model="form.deadline"
                  class="w-full border rounded-md px-3 py-2 mt-1 text-sm"
                />
              </div>
            </div>

            <!-- Contenu -->
            <div>
              <label class="block font-medium">Contenu</label>
              <textarea
                v-model="form.content"
                rows="4"
                class="w-full border rounded-md px-3 py-2 mt-1 text-sm"
              ></textarea>
            </div>

            <!-- Visible - FIXED CHECKBOX BINDING -->
            <div class="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="is_visible"
                :true-value="true"
                :false-value="false"
                v-model="form.is_visible"
              />
              <label for="is_visible" class="text-sm font-medium">
                Visible publiquement
              </label>
            </div>

            <!-- Fichiers -->
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

            <!-- Fichiers existants (edit) -->
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
                    >{{ f.file_name }}</a
                  >
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

            <!-- Boutons -->
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
                :disabled="store.isLoading"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <span v-if="store.isLoading">Création...</span>
                <span v-else>Créer</span>
              </button>
              <button
                v-else-if="mode === 'edit'"
                type="submit"
                :disabled="store.isLoading"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <span v-if="store.isLoading">Mise à jour...</span>
                <span v-else>Mettre à jour</span>
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
