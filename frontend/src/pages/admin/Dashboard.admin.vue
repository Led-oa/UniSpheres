<script setup>
import { onMounted, computed } from "vue";
import { useUtilityStore } from "../../stores/utility.store";

// --- Initialisation du store ---
const utilityStore = useUtilityStore();

// Charger les statistiques au montage
onMounted(async () => {
  await utilityStore.fetchTablesCount();
});

// Mapper les statistiques dans le même format que ton tableau `stats`
const stats = computed(() => {
  const tableData = utilityStore.tablesCount;

  // On récupère les totaux de chaque table
  const getCount = (tableName) => {
    const found = tableData.find((t) => t.table_name === tableName);
    return found ? found.table_rows : 0;
  };

  return [
    {
      label: "Utilisateurs",
      value: getCount("user"),
      icon: "users",
      color: "from-blue-500 to-purple-500",
      bgColor: "from-blue-100 to-purple-100",
      textColor: "text-blue-600",
    },
    {
      label: "Cours",
      value: getCount("course"),
      icon: "book-open",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-100 to-pink-100",
      textColor: "text-purple-600",
    },
    {
      label: "Classes",
      value: getCount("classe"),
      icon: "building-library",
      color: "from-green-500 to-teal-500",
      bgColor: "from-green-100 to-teal-100",
      textColor: "text-green-600",
    },
    {
      label: "Annonces",
      value: getCount("annonce"),
      icon: "megaphone",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-100 to-red-100",
      textColor: "text-orange-600",
    },
  ];
});

// Mapping des icônes Heroicons
const iconMap = {
  users:
    "M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z",
  "book-open":
    "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  "building-library":
    "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z",
  megaphone:
    "M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 00-1.06 1.06 5.5 5.5 0 010 7.78.75.75 0 001.06 1.06 7 7 0 000-9.9z",
};
</script>

<template>
  <section class="space-y-8 transition-all duration-300">
    <header class="transition-all duration-300">
      <h1 class="text-2xl font-bold text-gray-800 transition-colors duration-200">
        Tableau de bord
      </h1>
      <p class="text-gray-500 text-sm mt-1 transition-colors duration-200">
        Vue d'ensemble des données administratives.
      </p>
    </header>

    <!-- État de chargement -->
    <div
      v-if="utilityStore.loading"
      class="flex flex-col items-center justify-center py-12 transition-all duration-300"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 transition-colors duration-200"
      ></div>
      <p class="text-gray-600 font-medium transition-colors duration-200">
        Chargement des statistiques...
      </p>
    </div>

    <!-- Cartes de statistiques -->
    <div
      v-else
      class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-300"
    >
      <div
        v-for="item in stats"
        :key="item.label"
        class="group p-6 rounded-xl shadow-lg border border-gray-100 bg-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
      >
        <div
          class="flex items-center justify-between mb-4 transition-colors duration-200"
        >
          <div class="transition-colors duration-200">
            <p class="text-2xl font-bold text-gray-800 transition-colors duration-200">
              {{ item.value }}
            </p>
            <p class="text-sm text-gray-600 mt-1 transition-colors duration-200">
              {{ item.label }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out group-hover:scale-110"
            :class="item.bgColor"
          >
            <svg
              class="w-6 h-6 transition-colors duration-200"
              :class="item.textColor"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="iconMap[item.icon]"
              />
            </svg>
          </div>
        </div>

        <!-- Barre de progression décorative -->
        <div class="w-full bg-gray-200 rounded-full h-2 transition-colors duration-200">
          <div
            class="h-2 rounded-full transition-all duration-500 ease-in-out"
            :class="item.color"
            :style="{ width: Math.min((item.value / 100) * 100, 100) + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- État d'erreur -->
    <div
      v-if="utilityStore.error"
      class="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm transition-all duration-300 ease-in-out"
    >
      <div class="flex items-start transition-colors duration-200">
        <div class="flex-shrink-0 transition-colors duration-200">
          <svg
            class="h-6 w-6 text-red-500 transition-colors duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div class="ml-3 transition-colors duration-200">
          <h3 class="text-red-800 font-medium text-lg transition-colors duration-200">
            Erreur de chargement
          </h3>
          <p class="text-red-700 mt-1 transition-colors duration-200">
            {{ utilityStore.error.message || utilityStore.error }}
          </p>
          <button
            @click="utilityStore.fetchTablesCount()"
            class="mt-3 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-all duration-200 ease-in-out"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>

    <!-- Informations supplémentaires -->
    <div
      v-if="!utilityStore.loading && !utilityStore.error"
      class="bg-blue-50 rounded-xl p-6 border border-blue-200 transition-all duration-300"
    >
      <div class="flex items-center transition-colors duration-200">
        <svg
          class="w-5 h-5 text-blue-600 mr-3 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div class="transition-colors duration-200">
          <p class="text-blue-800 font-medium transition-colors duration-200">
            Statistiques en temps réel
          </p>
          <p class="text-blue-600 text-sm mt-1 transition-colors duration-200">
            Données mises à jour automatiquement depuis la base de données.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

/* Transitions globales */
* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
