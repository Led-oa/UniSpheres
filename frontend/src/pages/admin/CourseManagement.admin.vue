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

const showModal = ref(false);
const selectedCourse = ref(null);
const modalType = ref("add");
const loading = ref(false);

// -------------------
// Modal de suppression
// -------------------
const showDeleteModal = ref(false);
const courseToDelete = ref(null);

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

// Statistiques calculées
const stats = computed(() => ({
  total: courseStore.courses.length,
  byClass: courseStore.courses.reduce((acc, course) => {
    acc[course.class_name] = (acc[course.class_name] || 0) + 1;
    return acc;
  }, {}),
  byTeacher: courseStore.courses.reduce((acc, course) => {
    const teacherName = `${course.teacher_name} ${course.teacher_lastname}`;
    acc[teacherName] = (acc[teacherName] || 0) + 1;
    return acc;
  }, {}),
}));

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

const deleteCourse = async (course) => {
  courseToDelete.value = course;
  showDeleteModal.value = true;
};

// Confirmer la suppression
const confirmDelete = async () => {
  if (!courseToDelete.value) return;

  try {
    await courseStore.deleteCourse(courseToDelete.value.id_course);
    await loadCourses();
  } catch (err) {
    console.error("Erreur suppression cours:", err);
  } finally {
    closeDeleteModal();
  }
};

// Annuler la suppression
const cancelDelete = () => {
  closeDeleteModal();
};

// Fermer le modal de suppression
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  courseToDelete.value = null;
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
  classeStore.fetchClasses();
  teacherStore.fetchTeachers();
});
</script>

<template>
  <section class="space-y-8">
    <!-- En-tête -->
    <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-gray-900">Gestion des cours</h1>
        <p class="text-gray-600 max-w-2xl">
          Créez, modifiez et gérez les cours attribués aux classes et enseignants.
        </p>
      </div>
      <button
        @click="openAddModal"
        class="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold group"
      >
        <svg
          class="w-5 h-5 group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Nouveau cours</span>
      </button>
    </header>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-700">Total cours</p>
            <p class="text-3xl font-bold text-blue-900">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-700">Classes actives</p>
            <p class="text-3xl font-bold text-green-900">
              {{ Object.keys(stats.byClass).length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-700">Enseignants impliqués</p>
            <p class="text-3xl font-bold text-purple-900">
              {{ Object.keys(stats.byTeacher).length }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-white"
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
          </div>
        </div>
      </div>
    </div>

    <!-- Barre de recherche et filtres améliorés -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Recherche par titre -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Recherche</label>
          <div class="relative">
            <svg
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Titre du cours..."
              v-model="searchTitle"
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <!-- Filtre classe -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Classe</label>
          <select
            v-model="filterClassId"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Toutes les classes</option>
            <option
              v-for="cl in classeStore.classes"
              :key="cl.id_class"
              :value="cl.id_class"
            >
              {{ cl.name }}
            </option>
          </select>
        </div>

        <!-- Filtre enseignant -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Enseignant</label>
          <select
            v-model="filterTeacherId"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Tous les enseignants</option>
            <option
              v-for="t in teacherStore.teachers"
              :key="t.id_user"
              :value="t.id_user"
            >
              {{ t.name }} {{ t.lastname }}
            </option>
          </select>
        </div>

        <!-- Actions de filtrage -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 opacity-0">Actions</label>
          <div class="flex space-x-2">
            <button
              @click="
                searchTitle = '';
                filterClassId = '';
                filterTeacherId = '';
              "
              class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des cours -->
    <div class="space-y-4">
      <!-- Loader -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="text-gray-600">Chargement des cours...</span>
        </div>
      </div>

      <!-- Grille des cours -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="c in filteredCourses"
          :key="c.id_course"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group"
        >
          <!-- En-tête de la carte -->
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center space-x-2">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                >
                  Cours
                </span>
                <span
                  v-if="c.duration"
                  class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                >
                  {{ c.duration }}h
                </span>
              </div>
            </div>

            <h3
              class="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2"
            >
              {{ c.title }}
            </h3>

            <p v-if="c.content" class="text-gray-600 text-sm mt-2 line-clamp-2">
              {{ c.content }}
            </p>
          </div>

          <!-- Informations du cours -->
          <div class="p-4 bg-gray-50">
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <div
                  class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-500">Classe</p>
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ c.class_name }}
                  </p>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <div
                  class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-purple-600"
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
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-500">Enseignant</p>
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ c.teacher_name }} {{ c.teacher_lastname }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="p-4 flex justify-between items-center">
            <button
              @click="openInfoModal(c)"
              class="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>Détails</span>
            </button>

            <div class="flex items-center space-x-2">
              <button
                @click="openEditModal(c)"
                class="flex items-center space-x-1 px-3 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>Modifier</span>
              </button>

              <button
                @click="deleteCourse(c)"
                class="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
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
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div
        v-if="!loading && filteredCourses.length === 0"
        class="text-center py-12 bg-white rounded-2xl border border-gray-200"
      >
        <svg
          class="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucun cours trouvé</h3>
        <p class="text-gray-600 max-w-md mx-auto">
          {{
            searchTitle || filterClassId || filterTeacherId
              ? "Aucun cours ne correspond à vos critères de recherche."
              : "Commencez par créer votre premier cours."
          }}
        </p>
        <button
          v-if="!searchTitle && !filterClassId && !filterTeacherId"
          @click="openAddModal"
          class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Créer un cours
        </button>
      </div>
    </div>

    <!-- Modal de cours -->
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

    <!-- Modal de confirmation de suppression -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200"
      @click.self="cancelDelete"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-200 scale-100"
      >
        <div class="p-6 text-center">
          <!-- Icône d'alerte -->
          <div
            class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4"
          >
            <svg
              class="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Confirmer la suppression
          </h3>
          <p class="text-gray-600 mb-6">
            Voulez-vous vraiment supprimer le cours :
            <strong class="text-gray-900">"{{ courseToDelete?.title }}"</strong> ?
            <br />
            <span class="text-sm text-gray-500"> Cette action est irréversible. </span>
          </p>

          <div class="flex gap-3 justify-center">
            <button
              @click="cancelDelete"
              class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Annuler
            </button>
            <button
              @click="confirmDelete"
              class="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  overflow: hidden;
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
