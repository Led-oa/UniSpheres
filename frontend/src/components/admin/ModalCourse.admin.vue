<script setup>
import { ref, watch,computed } from "vue";

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
  if (props.type === "add") return "Créer un nouveau cours";
  if (props.type === "edit") return "Modifier le cours";
  if (props.type === "info") return "Détails du cours";
  return "";
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
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div class="bg-white rounded-lg w-full max-w-2xl p-6 relative">
      <!-- Close button -->
      <button
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- Header -->
      <h2 class="text-xl font-bold mb-4">
        {{ modalTitle }}
      </h2>

      <!-- Content selon type -->
      <div v-if="type === 'add'">
        <!-- Formulaire création cours -->
        <form @submit.prevent="handleAdd">
          <div class="mb-4">
            <label class="block font-medium">Titre</label>
            <input
              v-model="localCourse.title"
              type="text"
              required
              class="w-full border px-3 py-2 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block font-medium">Classe</label>
            <select
              v-model="localCourse.class_id"
              class="w-full border px-3 py-2 rounded"
            >
              <option v-for="cl in classes" :key="cl.id_class" :value="cl.id_class">
                {{ cl.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block font-medium">Enseignant</label>
            <select
              v-model="localCourse.teach_by"
              class="w-full border px-3 py-2 rounded"
            >
              <option v-for="t in teachers" :key="t.id_user" :value="t.id_user">
                {{ t.name }} {{ t.lastname }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block font-medium">Contenu</label>
            <textarea
              v-model="localCourse.content"
              class="w-full border px-3 py-2 rounded"
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block font-medium">Durée (heures)</label>
            <input
              v-model="localCourse.duration"
              type="number"
              min="0"
              class="w-full border px-3 py-2 rounded"
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
              Créer
            </button>
            <button
              type="button"
              class="px-4 py-2 bg-gray-300 rounded"
              @click="$emit('close')"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>

      <div v-else-if="type === 'edit'">
        <!-- Formulaire édition cours -->
        <form @submit.prevent="handleEdit">
          <div class="mb-4">
            <label class="block font-medium">Titre</label>
            <input
              v-model="localCourse.title"
              type="text"
              required
              class="w-full border px-3 py-2 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block font-medium">Classe</label>
            <select
              v-model="localCourse.class_id"
              class="w-full border px-3 py-2 rounded"
            >
              <option v-for="cl in classes" :key="cl.id_class" :value="cl.id_class">
                {{ cl.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block font-medium">Enseignant</label>
            <select
              v-model="localCourse.teach_by"
              class="w-full border px-3 py-2 rounded"
            >
              <option v-for="t in teachers" :key="t.id_user" :value="t.id_user">
                {{ t.name }} {{ t.lastname }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block font-medium">Contenu</label>
            <textarea
              v-model="localCourse.content"
              class="w-full border px-3 py-2 rounded"
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block font-medium">Durée (heures)</label>
            <input
              v-model="localCourse.duration"
              type="number"
              min="0"
              class="w-full border px-3 py-2 rounded"
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
              Enregistrer
            </button>
            <button
              type="button"
              class="px-4 py-2 bg-gray-300 rounded"
              @click="$emit('close')"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>

      <div v-else-if="type === 'info'">
        <!-- Informations du cours -->
        <div class="space-y-2">
          <p><strong>Titre :</strong> {{ localCourse.title }}</p>
          <p><strong>Classe :</strong> {{ getClassName(localCourse.class_id) }}</p>
          <p><strong>Enseignant :</strong> {{ getTeacherName(localCourse.teach_by) }}</p>
          <p><strong>Contenu :</strong> {{ localCourse.content }}</p>
          <p><strong>Durée :</strong> {{ localCourse.duration }} heures</p>
          <div v-if="localCourse.files && localCourse.files.length">
            <h4 class="font-medium mt-2">Fichiers :</h4>
            <ul class="list-disc ml-5">
              <li v-for="f in localCourse.files" :key="f.id_file">
                <a :href="f.file_path" target="_blank">{{ f.file_name }}</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button class="px-4 py-2 bg-gray-300 rounded" @click="$emit('close')">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
