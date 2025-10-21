<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useCourseStore } from "../../stores/course.store"; // fetchCoursesByTeacher
import { useAuthStore } from "../../stores/auth.store"; // fetchUserData
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
    <header>
      <h1 class="text-2xl font-bold text-gray-800">Mes Cours</h1>
      <p class="text-gray-500 text-sm mt-1">Cours dont vous êtes titulaire.</p>
    </header>

    <!-- Barre de recherche et filtre -->
    <div
      class="flex flex-col justify-between sm:flex-row gap-4 items-start sm:items-center"
    >
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher par titre..."
        class="px-4 py-2 border rounded-lg shadow-sm w-full sm:w-1/2"
      />

      <select
        v-model="selectedClass"
        class="px-4 py-2 border rounded-lg shadow-sm w-full sm:w-1/4"
      >
        <option value="all">Toutes les classes</option>
        <option v-for="cl in classeStore.classes" :key="cl.id_class" :value="cl.id_class">
          {{ cl.name }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="text-gray-500">Chargement des cours...</div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" v-else>
      <article
        v-for="course in filteredCourses"
        :key="course.id_course"
        class="group p-6 bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 transition flex flex-col"
      >
        <h2 class="text-lg font-semibold text-blue-700 group-hover:text-blue-800">
          {{ course.title }}
        </h2>
        <p class="text-gray-600 mt-2 flex-1 text-sm">{{ course.content }}</p>

        <div class="mt-4 flex justify-between items-center text-sm text-gray-500">
          <span>Credits : {{ course.credits }}</span>
          <router-link
            :to="{ name: 'CoursEnseignant', params: { id: course.id_course } }"
            class="text-blue-600 hover:text-blue-700 hover:underline font-medium"
          >
            Gérer Cours →
          </router-link>
          <router-link
            :to="{ name: 'NoterCoursEnseignant', params: { id: course.id_course } }"
            class="text-blue-600 hover:text-blue-700 hover:underline font-medium"
          >
            Attribuer notes →
          </router-link>
        </div>
      </article>
    </div>
  </section>
</template>
