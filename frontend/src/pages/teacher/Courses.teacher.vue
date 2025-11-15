<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useCourseStore } from "../../stores/course.store";
import { useAuthStore } from "../../stores/auth.store";
import { useClasseStore } from "../../stores/academique/classe.store";

// -------------------
// Stores
// -------------------
const courseStore = useCourseStore();
const authStore = useAuthStore();
const classeStore = useClasseStore();

const loading = ref(false);
const searchQuery = ref("");
const selectedClass = ref("all");

// -------------------
// Charger les cours de l'enseignant connecté
// -------------------
const loadTeacherCourses = async () => {
  if (!authStore.user) await authStore.fetchUserData();

  const teacherId = authStore.user.id_user;
  loading.value = true;
  try {
    const res = await courseStore.fetchCoursesByTeacher(teacherId);
    console.log("res : ", res);
  } catch (err) {
    console.error("Erreur chargement cours de l'enseignant:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadTeacherCourses();
  classeStore.fetchClasses();
});

// -------------------
// Filtrage dynamique
// -------------------
const filteredCourses = computed(() => {
  return courseStore.courses.filter((c) => {
    const matchesTitle = c.title
      ? c.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      : false;
    const matchesClass =
      selectedClass.value === "all" || c.class_id === selectedClass.value;
    return matchesTitle && matchesClass;
  });
});

// Rechargement automatique si la liste de cours change
watch(courseStore.courses, () => {
  filteredCourses.value;
});
</script>

<template>
  <section class="space-y-8">
    <!-- En-tête -->
    <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-gray-900">Mes Cours</h1>
        <p class="text-gray-600 max-w-2xl">
          Gérez les cours dont vous êtes titulaire et consultez les détails de chaque
          matière.
        </p>
      </div>
    </header>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Cours</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {{ courseStore.courses.length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg
              class="w-6 h-6 text-blue-600"
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

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Cours filtrés</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {{ filteredCourses.length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <svg
              class="w-6 h-6 text-green-600"
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
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Classes actives</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {{ new Set(courseStore.courses.map((c) => c.class_id)).size }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-purple-600"
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
    </div>

    <!-- Barre de recherche et filtres -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un cours par titre..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <!-- Filtre par classe -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Filtrer par classe</label>
          <select
            v-model="selectedClass"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">Toutes les classes</option>
            <option
              v-for="cl in classeStore.classes"
              :key="cl.id_class"
              :value="cl.id_class"
            >
              {{ cl.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="flex items-center space-x-3">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="text-gray-600">Chargement de vos cours...</span>
      </div>
    </div>

    <!-- Liste des cours -->
    <div v-else class="space-y-4">
      <!-- État vide -->
      <div
        v-if="filteredCourses.length === 0 && courseStore.courses.length === 0"
        class="text-center py-12 bg-white rounded-2xl border border-gray-200"
      >
        <div
          class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-8 h-8 text-gray-400"
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
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucun cours assigné</h3>
        <p class="text-gray-600">Vous n'êtes actuellement titulaire d'aucun cours.</p>
      </div>

      <!-- Aucun résultat de recherche -->
      <div
        v-else-if="filteredCourses.length === 0"
        class="text-center py-12 bg-white rounded-2xl border border-gray-200"
      >
        <div
          class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-8 h-8 text-gray-400"
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
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucun résultat</h3>
        <p class="text-gray-600">
          Aucun cours ne correspond à vos critères de recherche.
        </p>
      </div>

      <!-- Grille des cours -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="course in filteredCourses"
          :key="course.id_course"
          class="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group"
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
                  v-if="course.credits"
                  class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                >
                  {{ course.credits }} crédits
                </span>
              </div>
            </div>

            <h3
              class="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors"
            >
              {{ course.title }}
            </h3>

            <p v-if="course.content" class="text-gray-600 text-sm mt-2 line-clamp-2">
              {{ course.content }}
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
                  <p class="text-xs text-gray-500">Description</p>
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ course.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="p-4 flex justify-between items-center">
            <router-link
              :to="{ name: 'CoursEnseignant', params: { id: course.id_course } }"
              class="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Gérer</span>
            </router-link>

            <router-link
              :to="{ name: 'NoterCoursEnseignant', params: { id: course.id_course } }"
              class="flex items-center space-x-1 px-3 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>Noter</span>
            </router-link>
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
</style>
