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
      icon: "👥",
      color: "from-blue-500 to-purple-500",
    },
    {
      label: "Cours",
      value: getCount("course"),
      icon: "📚",
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Classes",
      value: getCount("classe"),
      icon: "🏫",
      color: "from-green-500 to-teal-500",
    },
    {
      label: "Annonces",
      value: getCount("annonce"),
      icon: "📢",
      color: "from-orange-500 to-red-500",
    },
  ];
});
</script>

<template>
  <section class="space-y-8">
    <header>
      <h1 class="text-2xl font-bold text-gray-800">Tableau de bord</h1>
      <p class="text-gray-500 text-sm mt-1">
        Vue d’ensemble des données administratives.
      </p>
    </header>

    <div v-if="utilityStore.loading" class="text-gray-500">Chargement...</div>

    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="item in stats"
        :key="item.label"
        class="p-6 rounded-xl shadow bg-gradient-to-br text-white transition-transform hover:scale-105"
        :class="item.color"
      >
        <div class="text-3xl">{{ item.icon }}</div>
        <p class="mt-2 text-2xl font-bold">{{ item.value }}</p>
        <p class="text-sm">{{ item.label }}</p>
      </div>
    </div>

    <div v-if="utilityStore.error" class="text-red-500 mt-4">
      ⚠️ {{ utilityStore.error.message || utilityStore.error }}
    </div>
  </section>
</template>
