<script setup>
import { ref, computed, onMounted } from "vue";
import { useClasseStore } from "../../stores/academique/classe.store";

const classeStore = useClasseStore();
const searchQuery = ref("");
const isLoading = ref(false);

// Charger les classes de l'enseignant
const loadClasses = async () => {
  isLoading.value = true;
  try {
    await classeStore.fetchClasseTeacher();
  } catch (err) {
    console.error("Erreur lors de la récupération des classes:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadClasses);

// Liste filtrée selon la recherche
const filteredClasses = computed(() => {
  if (!searchQuery.value) return classeStore.classes || [];
  return (classeStore.classes || []).filter((cl) =>
    cl.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <section class="space-y-6">
    <!-- Header -->
    <header>
      <h1 class="text-2xl font-bold text-gray-800">Mes Classes</h1>
      <p class="text-gray-500 text-sm mt-1">
        Liste des classes où vous enseignez au moins un cours.
      </p>
    </header>

    <!-- Barre de recherche -->
    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher une classe..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      />
    </div>

    <!-- Liste des classes -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Skeleton Loader -->
      <template v-if="isLoading">
        <div
          v-for="n in 6"
          :key="n"
          class="p-6 bg-white rounded-xl shadow border border-gray-100 animate-pulse"
        >
          <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>
        </div>
      </template>

      <!-- Classes réelles -->
      <article
        v-else
        v-for="cl in filteredClasses"
        :key="cl.id_class"
        class="group p-6 bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 transition"
      >
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-semibold text-purple-700 group-hover:text-purple-800">
            {{ cl.name }}
          </h2>
          <span class="text-sm text-gray-500">
            {{ cl.year_value }} - {{ cl.filiere_name }}
          </span>
        </div>

        <p class="text-gray-600 text-sm flex-1">Parcours : {{ cl.parcours_name }}</p>

        <div class="mt-4 space-x-2">
          <router-link
            :to="{ name: 'NotesClasseEnseignant', params: { idClasse: cl.id_class } }"
            class="inline-block text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Voir notes →
          </router-link>
          <router-link
            :to="{ name: 'ListeEtudiantEnseignant', params: { idClasse: cl.id_class } }"
            class="inline-block text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Voir étudiants →
          </router-link>
        </div>
      </article>
    </div>

    <!-- Message si aucune classe -->
    <div
      v-if="!isLoading && filteredClasses.length === 0"
      class="text-center py-12 text-gray-500"
    >
      Aucune classe trouvée.
    </div>
  </section>
</template>
