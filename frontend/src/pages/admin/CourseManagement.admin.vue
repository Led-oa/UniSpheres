<script setup>
import { ref, onMounted, computed } from "vue";
import { useCourseStore } from "../../stores/course.store";
import { useTeacherStore } from "../../stores/teacher.store";
import { useClasseStore } from "../../stores/academique/classe.store";

import ModalCourseAdmin from "../../components/admin/ModalCourse.admin.vue";

// -------------------
// Stores
// -------------------
const courseStore = useCourseStore();
const classeStore = useClasseStore();
const teacherStore = useTeacherStore();

const showModal = ref(false); // pour le futur modal
const selectedCourse = ref(null); // pour Details / Modifier
const modalType = ref("add");
const loading = ref(false);

// -------------------
// Recherche et filtres
// -------------------
const searchTitle = ref("");
const filterClassId = ref("");
const filterTeacherId = ref("");

const filteredCourses = computed(() => {
  return courseStore.courses.filter((c) => {
    const matchesTitle = c.title
      ? c.title.toLowerCase().includes(searchTitle.value.toLowerCase())
      : false;
    const matchesClass = filterClassId.value ? c.class_id == filterClassId.value : true;
    const matchesTeacher = filterTeacherId.value
      ? c.teach_by == filterTeacherId.value
      : true;
    return matchesTitle && matchesClass && matchesTeacher;
  });
});

const loadCourses = async () => {
  loading.value = true;
  try {
    await courseStore.fetchAllCourses();
  } catch (err) {
    console.error("Erreur chargement cours:", err);
  } finally {
    loading.value = false;
  }
};

const deleteCourse = async (id) => {
  if (!confirm("Voulez-vous vraiment supprimer ce cours ?")) return;
  try {
    await courseStore.deleteCourse(id);
  } catch (err) {
    console.error("Erreur suppression cours:", err);
  }
};

// -------------------
// Modal handlers
// -------------------
const openAddModal = () => {
  selectedCourse.value = {};
  modalType.value = "add";
  showModal.value = true;
};

const openEditModal = (course) => {
  selectedCourse.value = { ...course };
  modalType.value = "edit";
  showModal.value = true;
};

const openInfoModal = (course) => {
  selectedCourse.value = { ...course };
  modalType.value = "info";
  showModal.value = true;
};

const handleCreated = async (courseData) => {
  try {
    await courseStore.createCourse(courseData);
    await loadCourses();
  } catch (err) {
    console.error("Erreur création cours:", err);
  }
};

const handleUpdated = async (courseData) => {
  try {
    await courseStore.updateCourse(courseData.id_course, courseData);
    await loadCourses();
  } catch (err) {
    console.error("Erreur modification cours:", err);
  }
};

onMounted(() => {
  loadCourses();
  classeStore.fetchClasses(); // si nécessaire pour futur formulaire
  teacherStore.fetchTeachers(); // si nécessaire pour futur formulaire
});
</script>

<template>
  <section class="space-y-8">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des cours</h1>
      <button
        class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:opacity-90"
        @click="openAddModal"
      >
        + Nouveau cours
      </button>
    </header>

    <!-- Barre de recherche et filtres -->
    <div class="flex flex-col sm:flex-row gap-2 mb-4">
      <input
        type="text"
        placeholder="Rechercher par titre"
        v-model="searchTitle"
        class="px-3 py-2 border rounded-lg flex-1"
      />
      <select v-model="filterClassId" class="px-3 py-2 border rounded-lg">
        <option value="">Toutes les classes</option>
        <option v-for="cl in classeStore.classes" :key="cl.id_class" :value="cl.id_class">
          {{ cl.name }}
        </option>
      </select>
      <select v-model="filterTeacherId" class="px-3 py-2 border rounded-lg">
        <option value="">Tous les enseignants</option>
        <option v-for="t in teacherStore.teachers" :key="t.id_user" :value="t.id_user">
          {{ t.name }} {{ t.lastname }}
        </option>
      </select>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="c in filteredCourses"
        :key="c.id_course"
        class="p-6 bg-white rounded-xl shadow border border-gray-100 flex flex-col"
      >
        <h2 class="text-lg font-semibold text-blue-700">{{ c.title }}</h2>
        <p class="text-gray-600 mt-1 flex-1">Classe : {{ c.class_name }}</p>
        <p class="text-sm text-gray-500">
          Enseignant : {{ c.teacher_name }} {{ c.teacher_lastname }}
        </p>
        <div class="mt-4 flex justify-end space-x-2 text-sm">
          <button class="text-yellow-600 hover:underline" @click="openInfoModal(c)">
            Details
          </button>
          <button class="text-blue-600 hover:underline" @click="openEditModal(c)">
            Modifier
          </button>
          <button class="text-red-500 hover:underline" @click="deleteCourse(c.id_course)">
            Supprimer
          </button>
        </div>
      </article>
    </div>

    <!-- Modal futur -->
    <ModalCourseAdmin
      :show="showModal"
      :type="modalType"
      :course="selectedCourse"
      :classes="classeStore.classes"
      :teachers="teacherStore.teachers"
      @close="showModal = false"
      @created="handleCreated"
      @updated="handleUpdated"
    />
  </section>
</template>
