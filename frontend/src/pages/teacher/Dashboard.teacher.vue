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
    <!-- En-tête -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p class="text-gray-600 max-w-2xl">
          Bienvenue
          <span class="font-semibold text-indigo-600 transition-colors duration-200">
            {{ teacher.lastname || "" }} {{ teacher.name || "Enseignant" }}
          </span>
          , voici un aperçu de vos activités d'enseignement.
        </p>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Mes Cours -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Mes Cours</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">
              {{ utilityStore.coursesCountByTeacher || 0 }}
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
        <p class="text-xs text-gray-500 mt-3">Cours actuellement assignés</p>
      </div>

      <!-- Classes Assignées -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Classes Assignées</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">
              {{ utilityStore.classesCountByTeacher || 0 }}
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-3">Classes sous votre responsabilité</p>
      </div>
    </div>

    <!-- Annonces récentes -->
    <section
      class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <!-- En-tête de section -->
      <div class="border-b border-gray-200 px-6 py-4">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg
            class="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12"
            />
          </svg>
          Dernières annonces
        </h2>
        <p class="text-sm text-gray-600 mt-1">
          Les annonces les plus récentes de l'établissement
        </p>
      </div>

      <!-- Liste des annonces -->
      <div class="p-6">
        <div v-if="utilityStore.lastAnnonces.length" class="space-y-4">
          <div
            v-for="a in utilityStore.lastAnnonces"
            :key="a.id_annonce"
            class="group p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer"
          >
            <div class="flex items-start justify-between mb-2">
              <h3
                class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
              >
                {{ a.title }}
              </h3>
              <span
                class="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200"
              >
                {{ new Date(a.created_at).toLocaleDateString("fr-FR") }}
              </span>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {{ a.content }}
            </p>
            <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <div class="flex items-center gap-1">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{{ a.posted_by_name }}</span>
              </div>
              <div v-if="a.class_name" class="flex items-center gap-1">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span>{{ a.class_name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- État vide -->
        <div v-else class="text-center py-8">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucune annonce</h3>
          <p class="text-gray-600 text-sm">
            Les annonces apparaîtront ici une fois publiées.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation pour les cartes */
.group:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
}
</style>
