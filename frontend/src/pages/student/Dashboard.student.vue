<script setup>
import { onMounted, ref, computed } from "vue";
import { useUtilityStore } from "../../stores/utility.store";
import { useAuthStore } from "../../stores/auth.store";
import { useClasseStore } from "../../stores/academique/classe.store";

const utilityStore = useUtilityStore();
const authStore = useAuthStore();
const classeStore = useClasseStore();

const classInfo = ref(null);
const avgNote = ref("–");
const student = computed(() => authStore.user);

// Données simulées pour l'emploi du temps
const scheduleData = ref([
  {
    periode: "1ère Période",
    horaire: "8h00 - 10h00",
    jours: {
      lundi: { cours: "Mathématiques", salle: "A101", enseignant: "M. Dupont" },
      mardi: { cours: "Physique", salle: "B205", enseignant: "Mme. Martin" },
      mercredi: { cours: "Informatique", salle: "C301", enseignant: "M. Leroy" },
      jeudi: { cours: "Chimie", salle: "D401", enseignant: "Mme. Bernard" },
      vendredi: { cours: "Anglais", salle: "A102", enseignant: "M. Thomas" },
      samedi: { cours: "Projet", salle: "Labo", enseignant: "M. Robert" },
    },
  },
  {
    periode: "2ème Période",
    horaire: "10h15 - 12h15",
    jours: {
      lundi: { cours: "Algorithmique", salle: "C302", enseignant: "M. Moreau" },
      mardi: { cours: "Base de données", salle: "D402", enseignant: "Mme. Simon" },
      mercredi: { cours: "Réseaux", salle: "A103", enseignant: "M. Laurent" },
      jeudi: { cours: "Développement Web", salle: "B206", enseignant: "Mme. Petit" },
      vendredi: { cours: "Systèmes", salle: "C303", enseignant: "M. Durand" },
      samedi: { cours: "TD Projet", salle: "Labo", enseignant: "M. Robert" },
    },
  },
  {
    periode: "3ème Période",
    horaire: "13h30 - 15h30",
    jours: {
      lundi: { cours: "IA", salle: "D403", enseignant: "M. Blanc" },
      mardi: { cours: "Sécurité", salle: "A104", enseignant: "Mme. Roux" },
      mercredi: { cours: "Cloud", salle: "B207", enseignant: "M. Vincent" },
      jeudi: { cours: "Mobile", salle: "C304", enseignant: "Mme. Garcia" },
      vendredi: { cours: "DevOps", salle: "D404", enseignant: "M. Lopez" },
      samedi: { cours: "-", salle: "-", enseignant: "-" },
    },
  },
  {
    periode: "4ème Période",
    horaire: "15h45 - 17h45",
    jours: {
      lundi: { cours: "TP Informatique", salle: "Labo", enseignant: "M. Leroy" },
      mardi: { cours: "TP Physique", salle: "Labo", enseignant: "Mme. Martin" },
      mercredi: { cours: "Révisions", salle: "A105", enseignant: "M. Dupont" },
      jeudi: { cours: "TD Math", salle: "B208", enseignant: "M. Dupont" },
      vendredi: { cours: "Soutien", salle: "C305", enseignant: "Mme. Bernard" },
      samedi: { cours: "-", salle: "-", enseignant: "-" },
    },
  },
]);

const loadUser = async () => {
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUserData();
    } catch (error) {
      console.error("Failed to fetch user data");
    }
  }
};

const loadClass = async (classId) => {
  await classeStore.fetchClass(classId);
  classInfo.value = classeStore.currentClass?.data;
};

onMounted(async () => {
  loadUser();
  if (student.value.class_id) {
    await utilityStore.fetchCoursesCountInClass(student.value.class_id);
    await utilityStore.fetchLastAnnonces(5);
  }
  loadClass(student.value.class_id);

  // Simule ou récupère la moyenne
  avgNote.value = "14.5 / 20";
});
</script>

<template>
  <div class="min-h-screen rounded-2xl p-6">
    <!-- En-tête -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Tableau de bord Étudiant</h1>
      <p class="text-gray-600">
        Bienvenue {{ student?.name || "Étudiant" }}, voici votre résumé académique
      </p>
    </div>

    <!-- Cartes de stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Cours -->
      <div
        class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span class="text-2xl">📚</span>
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium">Total des Cours</p>
            <p class="text-2xl font-bold text-gray-800">
              {{ utilityStore.coursesCountInClass || 0 }}
            </p>
          </div>
        </div>
      </div>

      <!-- Classe -->
      <div
        class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span class="text-2xl">👩‍🎓</span>
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium">Votre Classe</p>
            <p class="text-2xl font-bold text-gray-800">
              {{ classInfo?.name || "Non assigné" }}
            </p>
          </div>
        </div>
      </div>

      <!-- Notes moyennes -->
      <div
        class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow"
      >
        <div class="flex items-center space-x-4">
          <div
            class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
          >
            <span class="text-2xl">📝</span>
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium">Moyenne Générale</p>
            <p class="text-2xl font-bold text-gray-800">{{ avgNote }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Grille principale -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Emploi du temps -->
      <div class="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">
            Emploi du temps de la semaine
          </h2>
          <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            20 Octobre - 25 Octobre
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-indigo-600 text-white">
                <th
                  class="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider"
                >
                  Périodes
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider"
                >
                  Lundi
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider"
                >
                  Mardi
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider"
                >
                  Mercredi
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider"
                >
                  Jeudi
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider"
                >
                  Vendredi
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider"
                >
                  Samedi
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="(periode, index) in scheduleData"
                :key="index"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ periode.periode }}
                  </div>
                  <div class="text-xs text-gray-500">{{ periode.horaire }}</div>
                </td>
                <td
                  v-for="(jour, dayName) in periode.jours"
                  :key="dayName"
                  class="px-4 py-4"
                >
                  <div
                    v-if="jour.cours !== '-'"
                    class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg"
                  >
                    <div class="text-sm font-medium text-gray-900 mb-1">
                      {{ jour.cours }}
                    </div>
                    <div class="text-xs text-gray-600 mb-1">Salle {{ jour.salle }}</div>
                    <div class="text-xs text-gray-500">{{ jour.enseignant }}</div>
                  </div>
                  <div v-else class="text-center text-gray-400 text-sm py-2">-</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Annonces -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Dernières annonces</h2>
          <span class="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {{ utilityStore.lastAnnonces.length }} nouvelle(s)
          </span>
        </div>

        <div class="space-y-4">
          <div
            v-for="a in utilityStore.lastAnnonces"
            :key="a.id_annonce"
            class="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-gray-800 text-sm">{{ a.title }}</h3>
              <span class="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                {{ new Date(a.created_at).toLocaleDateString() }}
              </span>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ a.content.substring(0, 80) }}{{ a.content.length > 80 ? "..." : "" }}
            </p>
          </div>

          <div
            v-if="utilityStore.lastAnnonces.length === 0"
            class="text-center py-8 text-gray-500"
          >
            <div class="text-4xl mb-2">📢</div>
            <p>Aucune annonce pour le moment</p>
          </div>
        </div>
      </div>

      <!-- Prochains événements -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Prochains événements</h2>
          <span class="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            Cette semaine
          </span>
        </div>

        <div class="space-y-4">
          <div class="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-gray-800 text-sm">Examen de Mathématiques</h3>
              <span class="text-xs text-purple-600 bg-white px-2 py-1 rounded">
                Jeu. 23 Oct
              </span>
            </div>
            <p class="text-gray-600 text-sm">Salle A101 - 8h00-10h00</p>
          </div>

          <div class="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-gray-800 text-sm">Rendu de projet</h3>
              <span class="text-xs text-orange-600 bg-white px-2 py-1 rounded">
                Ven. 24 Oct
              </span>
            </div>
            <p class="text-gray-600 text-sm">Projet de développement web</p>
          </div>

          <div class="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-gray-800 text-sm">Réunion de classe</h3>
              <span class="text-xs text-blue-600 bg-white px-2 py-1 rounded">
                Lun. 26 Oct
              </span>
            </div>
            <p class="text-gray-600 text-sm">Salle de réunion - 12h00</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section notes récentes
    <div class="mt-8 bg-white rounded-xl shadow-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Notes récentes</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          class="bg-gradient-to-r from-green-50 to-emerald-100 p-4 rounded-lg border border-green-200"
        >
          <div class="text-sm text-gray-600 mb-1">Algorithmique</div>
          <div class="text-2xl font-bold text-gray-800 mb-1">16.5</div>
          <div class="text-xs text-green-600">/20 • Excellent</div>
        </div>

        <div
          class="bg-gradient-to-r from-blue-50 to-cyan-100 p-4 rounded-lg border border-blue-200"
        >
          <div class="text-sm text-gray-600 mb-1">Base de données</div>
          <div class="text-2xl font-bold text-gray-800 mb-1">14.0</div>
          <div class="text-xs text-blue-600">/20 • Très bien</div>
        </div>

        <div
          class="bg-gradient-to-r from-yellow-50 to-amber-100 p-4 rounded-lg border border-yellow-200"
        >
          <div class="text-sm text-gray-600 mb-1">Réseaux</div>
          <div class="text-2xl font-bold text-gray-800 mb-1">12.5</div>
          <div class="text-xs text-yellow-600">/20 • Assez bien</div>
        </div>

        <div
          class="bg-gradient-to-r from-red-50 to-pink-100 p-4 rounded-lg border border-red-200"
        >
          <div class="text-sm text-gray-600 mb-1">Physique</div>
          <div class="text-2xl font-bold text-gray-800 mb-1">9.5</div>
          <div class="text-xs text-red-600">/20 • À améliorer</div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
/* Styles personnalisés supplémentaires */
.table-responsive {
  overflow-x: auto;
}

/* Animation subtle pour les cartes */
.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
}

/* Scrollbar personnalisée pour le tableau */
::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
