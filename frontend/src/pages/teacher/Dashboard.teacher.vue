<script setup>
import { onMounted, ref, computed } from "vue";
import { useUtilityStore } from "../../stores/utility.store";
import { useAuthStore } from "../../stores/auth.store";

const utilityStore = useUtilityStore();
const authStore = useAuthStore();

const teacher = computed(() => authStore.user);

console.log("Current teacher : ", teacher.value);

const loadUser = async () => {
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUserData();
    } catch (error) {
      console.error("Failed to fetch user data");
    }
  }
};

onMounted(async () => {
  loadUser();
  if (teacher.value.id_user) {
    await utilityStore.fetchClassesCountByTeacher(teacher.value.id_user);
    await utilityStore.fetchCoursesCountByTeacher(teacher.value.id_user);
    await utilityStore.fetchLastAnnonces(5);
  }
});
</script>

<template>
  <div class="space-y-8">
    <!-- Titre -->
    <h1 class="text-2xl font-bold text-gray-800">Tableau de bord Enseignant</h1>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="p-6 rounded-xl shadow bg-white border border-gray-100">
        <p class="text-gray-500 text-sm">Mes Cours</p>
        <p class="text-3xl font-bold text-blue-600 mt-1">
          {{ utilityStore.coursesCountByTeacher || 0 }}
        </p>
      </div>
      <div class="p-6 rounded-xl shadow bg-white border border-gray-100">
        <p class="text-gray-500 text-sm">Classes Assignées</p>
        <p class="text-3xl font-bold text-blue-600 mt-1">
          {{ utilityStore.classesCountByTeacher || 0 }}
        </p>
      </div>
    </div>

    <!-- Annonces récentes -->
    <section>
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Dernières annonces</h2>
      <ul v-if="utilityStore.lastAnnonces.length" class="space-y-4">
        <li
          v-for="a in utilityStore.lastAnnonces"
          :key="a.id_annonce"
          class="p-4 bg-white rounded-xl shadow border border-gray-100"
        >
          <h3 class="font-medium text-gray-800">{{ a.title }}</h3>
          <p class="text-gray-600 text-sm mt-1">{{ a.content.substring(0, 60) }}...</p>
          <!-- <p class="text-xs text-gray-400 mt-1">Publié le {{ a.date }}</p> -->
        </li>
      </ul>
      <p v-else class="text-gray-500 text-sm">Aucune annonce pour le moment.</p>
    </section>
  </div>
</template>
