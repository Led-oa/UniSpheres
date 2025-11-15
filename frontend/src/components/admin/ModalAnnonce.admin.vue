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
  target_class_ids: [],
  target_filiere_ids: [],
  target_year_ids: [],
  is_visible: true,
});

// États pour les checkboxes "Tous"
const selectAllClasses = ref(false);
const selectAllFilieres = ref(false);
const selectAllYears = ref(false);

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
    target_class_ids: [],
    target_filiere_ids: [],
    target_year_ids: [],
    is_visible: true,
  });
  selectAllClasses.value = false;
  selectAllFilieres.value = false;
  selectAllYears.value = false;
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

// --- Gestion des checkboxes "Tous" ---
watch(selectAllClasses, (newValue) => {
  if (newValue) {
    form.target_class_ids = classes.value.map((c) => c.id_class);
  } else {
    form.target_class_ids = [];
  }
});

watch(selectAllFilieres, (newValue) => {
  if (newValue) {
    form.target_filiere_ids = filieres.value.map((f) => f.id_filiere);
  } else {
    form.target_filiere_ids = [];
  }
});

watch(selectAllYears, (newValue) => {
  if (newValue) {
    form.target_year_ids = years.value.map((y) => y.id_year);
  } else {
    form.target_year_ids = [];
  }
});

// --- Watch les tableaux de sélection pour mettre à jour les checkboxes "Tous" ---
watch(
  () => form.target_class_ids,
  (newIds) => {
    selectAllClasses.value =
      newIds.length === classes.value.length && classes.value.length > 0;
  }
);

watch(
  () => form.target_filiere_ids,
  (newIds) => {
    selectAllFilieres.value =
      newIds.length === filieres.value.length && filieres.value.length > 0;
  }
);

watch(
  () => form.target_year_ids,
  (newIds) => {
    selectAllYears.value = newIds.length === years.value.length && years.value.length > 0;
  }
);

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
        target_class_ids: a.target_class_id ? [a.target_class_id] : [],
        target_filiere_ids: a.target_filiere_id ? [a.target_filiere_id] : [],
        target_year_ids: a.target_year_id ? [a.target_year_id] : [],
        is_visible: a.is_visible,
      });

      selectAllClasses.value =
        form.target_class_ids.length === classes.value.length && classes.value.length > 0;
      selectAllFilieres.value =
        form.target_filiere_ids.length === filieres.value.length &&
        filieres.value.length > 0;
      selectAllYears.value =
        form.target_year_ids.length === years.value.length && years.value.length > 0;
    }
  },
  { immediate: true }
);

// --- Watch for modal close to reset form ---
watch(
  () => props.show,
  (isVisible) => {
    if (!isVisible) {
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
    const payload = {
      ...form,
      posted_by: props.postedBy,
      target_class_id:
        selectAllClasses.value || form.target_class_ids.length === 0
          ? null
          : form.target_class_ids[0],
      target_filiere_id:
        selectAllFilieres.value || form.target_filiere_ids.length === 0
          ? null
          : form.target_filiere_ids[0],
      target_year_id:
        selectAllYears.value || form.target_year_ids.length === 0
          ? null
          : form.target_year_ids[0],
    };

    if (props.mode === "add") {
      const newAnnonce = await store.createAnnonce(payload, newFiles.value);
      emit("saved", newAnnonce);
    } else if (props.mode === "edit" && props.annonce) {
      const updated = await store.updateAnnonce(
        props.annonce.id_annonce,
        payload,
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

// --- Helpers pour le mode info ---
const getPriorityColor = (priority) => {
  const colors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };
  return colors[priority] || "bg-gray-100 text-gray-800";
};

const getTypeColor = (type) => {
  const colors = {
    general: "bg-blue-100 text-blue-800",
    cours: "bg-purple-100 text-purple-800",
    evenement: "bg-orange-100 text-orange-800",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
};

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// --- On mounted ---
onMounted(() => {
  loadLists();
});
</script>

<template>
  <transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        <!-- HEADER -->
        <div
          class="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl"
        >
          <div class="flex items-center space-x-3">
            <div
              v-if="mode === 'info'"
              class="w-3 h-8 rounded-full bg-gradient-to-b from-purple-500 to-blue-600"
            ></div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                <span v-if="mode === 'add'">Nouvelle annonce</span>
                <span v-else-if="mode === 'edit'">Modifier l'annonce</span>
                <span v-else>Détails de l'annonce</span>
              </h2>
              <p class="text-sm text-gray-600 mt-1">
                <span v-if="mode === 'add'"
                  >Remplissez les informations pour créer une nouvelle annonce</span
                >
                <span v-else-if="mode === 'edit'"
                  >Modifiez les informations de l'annonce existante</span
                >
                <span v-else>Consultez les détails complets de l'annonce</span>
              </p>
            </div>
          </div>
          <button
            @click="emit('close')"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- CONTENT -->
        <div class="flex-1 overflow-y-auto">
          <!-- MODE INFO -->
          <template v-if="mode === 'info' && annonce">
            <div class="p-6 space-y-6">
              <!-- En-tête avec badges -->
              <div class="flex flex-wrap items-center gap-3">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    getTypeColor(annonce.type),
                  ]"
                >
                  {{ annonce.type?.charAt(0).toUpperCase() + annonce.type?.slice(1) }}
                </span>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    getPriorityColor(annonce.priority),
                  ]"
                >
                  Priorité {{ annonce.priority }}
                </span>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    annonce.is_visible
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ annonce.is_visible ? "Visible" : "Masquée" }}
                </span>
              </div>

              <!-- Titre et contenu -->
              <div class="space-y-4">
                <h3 class="text-2xl font-bold text-gray-900 leading-tight">
                  {{ annonce.title }}
                </h3>
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {{ annonce.content }}
                  </p>
                </div>
              </div>

              <!-- Grille d'informations -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Informations de publication -->
                <div class="space-y-4">
                  <h4 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg
                      class="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Informations de publication
                  </h4>
                  <div class="space-y-3">
                    <div
                      class="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <span class="text-sm font-medium text-gray-600">Publié par</span>
                      <span class="text-sm text-gray-900 font-medium">
                        {{ annonce.posted_by_name }} {{ annonce.posted_by_lastname }}
                      </span>
                    </div>
                    <div
                      class="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <span class="text-sm font-medium text-gray-600">Date limite</span>
                      <span class="text-sm text-gray-900 font-medium">
                        {{ formatDate(annonce.deadline) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Public cible -->
                <div class="space-y-4">
                  <h4 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg
                      class="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Public cible
                  </h4>
                  <div class="space-y-3">
                    <div
                      class="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <span class="text-sm font-medium text-gray-600">Classe</span>
                      <span class="text-sm text-gray-900 font-medium">
                        {{ annonce.class_name || "Toutes les classes" }}
                      </span>
                    </div>
                    <div
                      class="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <span class="text-sm font-medium text-gray-600">Filière</span>
                      <span class="text-sm text-gray-900 font-medium">
                        {{ annonce.filiere_name || "Toutes les filières" }}
                      </span>
                    </div>
                    <div
                      class="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <span class="text-sm font-medium text-gray-600">Niveau</span>
                      <span class="text-sm text-gray-900 font-medium">
                        {{ annonce.year_value || "Tous les niveaux" }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Fichiers -->
              <div v-if="annonce.files?.length" class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    class="w-5 h-5 text-gray-500"
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
                  Fichiers attachés
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a
                    v-for="f in annonce.files"
                    :key="f.id_file"
                    :href="`${f.file_path}`"
                    target="_blank"
                    class="group flex items-center p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <div class="flex items-center space-x-3 flex-1 min-w-0">
                      <div
                        class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                      >
                        <svg
                          class="w-5 h-5 text-blue-600"
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
                      </div>
                      <div class="flex-1 min-w-0">
                        <p
                          class="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700 transition-colors"
                        >
                          {{ f.file_name }}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">Cliquer pour télécharger</p>
                      </div>
                    </div>
                  </a>
                </div>

                <!-- Aperçu des images -->
                <!-- <div
                  v-if="
                    annonce.files.some((f) => /\.(png|jpe?g|gif)$/i.test(f.file_name))
                  "
                  class="space-y-3"
                >
                  <h5 class="text-sm font-medium text-gray-700">Aperçu des images</h5>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div
                      v-for="f in annonce.files.filter((f) =>
                        /\.(png|jpe?g|gif)$/i.test(f.file_name)
                      )"
                      :key="f.id_file"
                      class="relative group"
                    >
                      <img
                        :src="`${f.file_path}`"
                        :alt="f.file_name"
                        class="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:shadow-md transition-all duration-200"
                      />
                      <div
                        class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg"
                      ></div>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </template>

          <!-- MODE ADD / EDIT -->
          <template v-else>
            <form @submit.prevent="saveAnnonce" class="p-6 space-y-6">
              <!-- Champs de base -->
              <div class="grid md:grid-cols-3 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Titre</label>
                  <input
                    v-model="form.title"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Titre de l'annonce..."
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    v-model="form.type"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="general">Général</option>
                    <option value="cours">Cours</option>
                    <option value="evenement">Événement</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Priorité</label>
                  <select
                    v-model="form.priority"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>
              </div>

              <!-- Public cible -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900">Public cible</h4>
                <div class="grid md:grid-cols-3 gap-6">
                  <!-- Classes -->
                  <div class="space-y-3">
                    <label class="block text-sm font-medium text-gray-700">Classes</label>
                    <div
                      class="border border-gray-300 rounded-xl p-4 space-y-3 max-h-48 overflow-y-auto"
                    >
                      <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          id="all-classes"
                          v-model="selectAllClasses"
                          class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label
                          for="all-classes"
                          class="text-sm font-medium text-gray-700"
                        >
                          Toutes les classes
                        </label>
                      </div>
                      <div
                        v-for="c in classes"
                        :key="c.id_class"
                        class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          :id="`class-${c.id_class}`"
                          :value="c.id_class"
                          v-model="form.target_class_ids"
                          :disabled="selectAllClasses"
                          class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label :for="`class-${c.id_class}`" class="text-sm text-gray-700">
                          {{ c.name }}
                        </label>
                      </div>
                      <p
                        v-if="classes.length === 0"
                        class="text-sm text-gray-500 text-center py-2"
                      >
                        Aucune classe disponible
                      </p>
                    </div>
                  </div>

                  <!-- Filières -->
                  <div class="space-y-3">
                    <label class="block text-sm font-medium text-gray-700"
                      >Filières</label
                    >
                    <div
                      class="border border-gray-300 rounded-xl p-4 space-y-3 max-h-48 overflow-y-auto"
                    >
                      <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          id="all-filieres"
                          v-model="selectAllFilieres"
                          class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label
                          for="all-filieres"
                          class="text-sm font-medium text-gray-700"
                        >
                          Toutes les filières
                        </label>
                      </div>
                      <div
                        v-for="f in filieres"
                        :key="f.id_filiere"
                        class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          :id="`filiere-${f.id_filiere}`"
                          :value="f.id_filiere"
                          v-model="form.target_filiere_ids"
                          :disabled="selectAllFilieres"
                          class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label
                          :for="`filiere-${f.id_filiere}`"
                          class="text-sm text-gray-700"
                        >
                          {{ f.name }}
                        </label>
                      </div>
                      <p
                        v-if="filieres.length === 0"
                        class="text-sm text-gray-500 text-center py-2"
                      >
                        Aucune filière disponible
                      </p>
                    </div>
                  </div>

                  <!-- Niveaux -->
                  <div class="space-y-3">
                    <label class="block text-sm font-medium text-gray-700">Niveaux</label>
                    <div
                      class="border border-gray-300 rounded-xl p-4 space-y-3 max-h-48 overflow-y-auto"
                    >
                      <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          id="all-years"
                          v-model="selectAllYears"
                          class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label for="all-years" class="text-sm font-medium text-gray-700">
                          Tous les niveaux
                        </label>
                      </div>
                      <div
                        v-for="y in years"
                        :key="y.id_year"
                        class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          :id="`year-${y.id_year}`"
                          :value="y.id_year"
                          v-model="form.target_year_ids"
                          :disabled="selectAllYears"
                          class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label :for="`year-${y.id_year}`" class="text-sm text-gray-700">
                          {{ y.year_value }}
                        </label>
                      </div>
                      <p
                        v-if="years.length === 0"
                        class="text-sm text-gray-500 text-center py-2"
                      >
                        Aucun niveau disponible
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Date limite et visibilité -->
              <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >Date limite</label
                  >
                  <input
                    type="date"
                    v-model="form.deadline"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div class="flex items-center space-x-3 p-2">
                  <input
                    type="checkbox"
                    id="is_visible"
                    :true-value="true"
                    :false-value="false"
                    v-model="form.is_visible"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label for="is_visible" class="text-sm font-medium text-gray-700">
                    Rendre visible publiquement
                  </label>
                </div>
              </div>

              <!-- Contenu -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Contenu</label>
                <textarea
                  v-model="form.content"
                  rows="6"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Décrivez le contenu de l'annonce..."
                ></textarea>
              </div>

              <!-- Fichiers -->
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Fichiers</label>
                  <div
                    class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors"
                  >
                    <input
                      type="file"
                      multiple
                      @change="handleFiles"
                      class="hidden"
                      id="file-upload"
                    />
                    <label for="file-upload" class="cursor-pointer">
                      <svg
                        class="w-8 h-8 text-gray-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p class="text-sm text-gray-600">
                        Cliquez pour ajouter des fichiers
                      </p>
                    </label>
                  </div>
                  <div v-if="newFiles.length" class="space-y-2 mt-3">
                    <p class="text-sm font-medium text-gray-700">Nouveaux fichiers :</p>
                    <ul class="space-y-1">
                      <li
                        v-for="f in newFiles"
                        :key="f.name"
                        class="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg"
                      >
                        {{ f.name }}
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Fichiers existants (edit) -->
                <div v-if="mode === 'edit' && annonce?.files?.length" class="space-y-3">
                  <h4 class="text-sm font-medium text-gray-700">Fichiers existants</h4>
                  <div class="space-y-2">
                    <div
                      v-for="f in annonce.files"
                      :key="f.id_file"
                      class="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div class="flex items-center space-x-3">
                        <svg
                          class="w-5 h-5 text-gray-400"
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
                        <a
                          :href="`/${f.file_path}`"
                          target="_blank"
                          class="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                        >
                          {{ f.file_name }}
                        </a>
                      </div>
                      <button
                        type="button"
                        @click="removeExistingFile(f.id_file)"
                        class="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Boutons -->
              <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  @click="emit('close')"
                  class="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  :disabled="store.isLoading"
                  class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="store.isLoading">
                    <svg
                      class="w-4 h-4 animate-spin inline mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {{ mode === "add" ? "Création..." : "Mise à jour..." }}
                  </span>
                  <span v-else>
                    {{ mode === "add" ? "Créer l'annonce" : "Mettre à jour" }}
                  </span>
                </button>
              </div>
            </form>
          </template>
        </div>
      </div>
    </div>
  </transition>
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
