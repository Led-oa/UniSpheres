<script setup>
import { onMounted, ref, computed } from "vue";
import { useUtilityStore } from "../../stores/utility.store";
import { useAuthStore } from "../../stores/auth.store";
import { useClasseStore } from "../../stores/academique/classe.store";
import { useScheduleStore } from "../../stores/schedule.store";
import scheduleOther from "../other/schedule.other.vue";

// Stores
const utilityStore = useUtilityStore();
const authStore = useAuthStore();
const classeStore = useClasseStore();
const scheduleStore = useScheduleStore();

// Data
const classInfo = ref(null);
const avgNote = ref("–");
const student = computed(() => authStore.user);
const isLoading = ref(false);

// Chargement des données utilisateur
const loadUser = async () => {
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUserData();
    } catch (error) {
      console.error("Erreur chargement utilisateur:", error);
    }
  }
};

// Chargement des informations de classe
const loadClass = async (classId) => {
  if (!classId) return;

  try {
    await classeStore.fetchClass(classId);
    classInfo.value = classeStore.currentClass?.data;
  } catch (error) {
    console.error("Erreur chargement classe:", error);
  }
};

// Chargement des données du dashboard
const loadDashboardData = async () => {
  if (!student.value?.class_id) return;

  isLoading.value = true;
  try {
    await Promise.all([
      utilityStore.fetchCoursesCountInClass(student.value.class_id),
      utilityStore.fetchLastAnnonces(5),
      loadClass(student.value.class_id),
    ]);
  } catch (error) {
    console.error("Erreur chargement dashboard:", error);
  } finally {
    isLoading.value = false;
  }
};

// Gestion des événements du composant ScheduleOther
const onScheduleLoaded = (data) => {
  console.log("✅ Emploi du temps chargé:", data);
};

const onCellClick = (cellData) => {
  console.log("📅 Cellule cliquée:", cellData);
  // Vous pouvez implémenter l'affichage des détails du cours ici
  showCourseDetails(cellData);
};

const onScheduleError = (error) => {
  console.error("❌ Erreur emploi du temps:", error);
};

const showCourseDetails = (courseData) => {
  // Implémentez l'affichage d'un modal ou d'une tooltip avec les détails du cours
  if (courseData.courses.length > 0) {
    const course = courseData.courses[0];
    alert(
      `Détails du cours:\n${course.course_title}\nEnseignant: ${
        course.teacher_name
      }\nCrédits: ${course.credits || "N/A"}`
    );
  }
};

// Initialisation
onMounted(async () => {
  await loadUser();
  await loadDashboardData();

  // Simulation de la moyenne (à remplacer par des données réelles)
  avgNote.value = "14.5 / 20";
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 rounded-2xl p-6">
    <!-- En-tête -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Tableau de bord Étudiant</h1>
      <p class="text-gray-600">
        Bienvenue
        <span class="font-semibold text-indigo-600">{{
          student?.name || "Étudiant"
        }}</span
        >, voici votre résumé académique
      </p>
    </div>

    <!-- Indicateur de chargement global -->
    <div
      v-if="isLoading"
      class="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
    >
      🔄 Chargement des données...
    </div>

    <!-- Cartes de statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total des Cours -->
      <div
        class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span class="text-2xl text-blue-600">📚</span>
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium">Total des Cours</p>
            <p class="text-2xl font-bold text-gray-800">
              {{ utilityStore.coursesCountInClass || 0 }}
            </p>
            <p class="text-xs text-gray-400 mt-1">Cette année académique</p>
          </div>
        </div>
      </div>

      <!-- Classe -->
      <div
        class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span class="text-2xl text-green-600">👩‍🎓</span>
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium">Votre Classe</p>
            <p class="text-2xl font-bold text-gray-800">
              {{ classInfo?.name || "Non assigné" }}
            </p>
            <p class="text-xs text-gray-400 mt-1" v-if="classInfo">
              {{ classInfo.filiere_name }} • {{ classInfo.year_value }}
            </p>
          </div>
        </div>
      </div>

      <!-- Notes moyennes -->
      <div
        class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        <div class="flex items-center space-x-4">
          <div
            class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
          >
            <span class="text-2xl text-purple-600">📝</span>
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium">Moyenne Générale</p>
            <p class="text-2xl font-bold text-gray-800">{{ avgNote }}</p>
            <p class="text-xs text-gray-400 mt-1">Dernière mise à jour</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Grille principale du contenu -->
    <div class="grid grid-cols-1 xl:grid-cols-1 gap-8">
      <!-- Emploi du temps -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <scheduleOther
          :classId="student?.class_id"
          title="Mon Emploi du Temps"
          view-mode="table"
          :show-week-selector="true"
          :show-statistics="false"
          :show-refresh="true"
          :show-empty-message="true"
          empty-message="Aucun cours planifié pour cette semaine."
          :auto-load="true"
          @schedule-loaded="onScheduleLoaded"
          @cell-click="onCellClick"
          @error="onScheduleError"
        />
      </div>

      <!-- Annonces et Événements -->
      <div class="space-y-8">
        <!-- Dernières annonces -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-800 flex items-center">
              <span class="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
              Dernières annonces
            </h2>
            <span
              v-if="utilityStore.lastAnnonces.length > 0"
              class="text-sm text-white bg-blue-500 px-3 py-1 rounded-full font-medium"
            >
              {{ utilityStore.lastAnnonces.length }} nouvelle(s)
            </span>
          </div>

          <div class="space-y-4 pr-2">
            <div
              v-for="a in utilityStore.lastAnnonces"
              :key="a.id_annonce"
              class="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg hover:shadow-md transition-all duration-200 hover:border-green-600"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-gray-800 text-sm line-clamp-1">
                  {{ a.title }}
                </h3>
                <span
                  class="text-xs text-gray-500 bg-white px-2 py-1 rounded shrink-0 ml-2"
                >
                  {{ new Date(a.created_at).toLocaleDateString("fr-FR") }}
                </span>
              </div>
              <p class="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {{ a.content }}
              </p>
              <div class="flex justify-between items-center mt-3">
                <span
                  v-if="a.priority === 'high'"
                  class="text-xs text-red-600 bg-red-100 px-2 py-1 rounded"
                >
                  🔥 Important
                </span>
                <span
                  v-else-if="a.priority === 'medium'"
                  class="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded"
                >
                  ⚠️ Moyen
                </span>
                <span v-else class="text-xs text-gray-500"> 📌 Information </span>

                <span class="text-xs text-blue-600 font-medium">
                  Par {{ a.posted_by_name || "Administrateur" }}
                </span>
              </div>
            </div>

            <!-- État vide -->
            <div
              v-if="utilityStore.lastAnnonces.length === 0"
              class="text-center py-8 text-gray-500"
            >
              <div class="text-4xl mb-3">📢</div>
              <p class="font-medium">Aucune annonce pour le moment</p>
              <p class="text-sm mt-1">Les nouvelles annonces apparaîtront ici</p>
            </div>
          </div>
        </div>

        <!-- Prochains événements -->
        <!-- <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-800 flex items-center">
              <span class="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
              Prochains événements
            </h2>
            <span
              class="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full font-medium"
            >
              Cette semaine
            </span>
          </div>

          <div class="space-y-4">
            <div
              class="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg hover:shadow-md transition-all"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-gray-800 text-sm">
                  Examen de Mathématiques
                </h3>
                <span
                  class="text-xs text-white bg-purple-500 px-2 py-1 rounded font-medium"
                >
                  Jeu. 23 Oct
                </span>
              </div>
              <p class="text-gray-600 text-sm mb-2">Salle A101 - 8h00-10h00</p>
              <div class="flex items-center text-xs text-gray-500">
                <span class="mr-3">📝 Examen écrit</span>
                <span>⏱️ 2 heures</span>
              </div>
            </div>

            <div
              class="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg hover:shadow-md transition-all"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-gray-800 text-sm">Rendu de projet</h3>
                <span
                  class="text-xs text-white bg-orange-500 px-2 py-1 rounded font-medium"
                >
                  Ven. 24 Oct
                </span>
              </div>
              <p class="text-gray-600 text-sm mb-2">Projet de développement web</p>
              <div class="flex items-center text-xs text-gray-500">
                <span class="mr-3">💻 Projet pratique</span>
                <span>📁 Développement Fullstack</span>
              </div>
            </div>

            <div
              class="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg hover:shadow-md transition-all"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-gray-800 text-sm">Réunion de classe</h3>
                <span
                  class="text-xs text-white bg-blue-500 px-2 py-1 rounded font-medium"
                >
                  Lun. 26 Oct
                </span>
              </div>
              <p class="text-gray-600 text-sm mb-2">Salle de réunion - 12h00</p>
              <div class="flex items-center text-xs text-gray-500">
                <span class="mr-3">👥 Tous les étudiants</span>
                <span>📋 Ordre du jour disponible</span>
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </div>

    <!-- Notes récentes
    <div class="mt-8 bg-white rounded-xl shadow-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Notes récentes</h2>
        <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Semaine en cours
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          class="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg border border-green-200 hover:shadow-md transition-all"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="text-sm text-gray-600 font-medium">Algorithmique</div>
            <span
              class="text-xs text-green-600 bg-white px-2 py-1 rounded-full font-bold"
            >
              +2.5
            </span>
          </div>
          <div class="text-2xl font-bold text-gray-800 mb-1">16.5</div>
          <div class="text-xs text-green-600 font-medium">/20 • Excellent</div>
          <div class="w-full bg-green-200 rounded-full h-2 mt-2">
            <div class="bg-green-500 h-2 rounded-full" style="width: 82.5%"></div>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-blue-50 to-cyan-100 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-all"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="text-sm text-gray-600 font-medium">Base de données</div>
            <span class="text-xs text-blue-600 bg-white px-2 py-1 rounded-full font-bold">
              +1.0
            </span>
          </div>
          <div class="text-2xl font-bold text-gray-800 mb-1">14.0</div>
          <div class="text-xs text-blue-600 font-medium">/20 • Très bien</div>
          <div class="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div class="bg-blue-500 h-2 rounded-full" style="width: 70%"></div>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-yellow-50 to-amber-100 p-4 rounded-lg border border-yellow-200 hover:shadow-md transition-all"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="text-sm text-gray-600 font-medium">Réseaux</div>
            <span
              class="text-xs text-yellow-600 bg-white px-2 py-1 rounded-full font-bold"
            >
              +0.5
            </span>
          </div>
          <div class="text-2xl font-bold text-gray-800 mb-1">12.5</div>
          <div class="text-xs text-yellow-600 font-medium">/20 • Assez bien</div>
          <div class="w-full bg-yellow-200 rounded-full h-2 mt-2">
            <div class="bg-yellow-500 h-2 rounded-full" style="width: 62.5%"></div>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-red-50 to-pink-100 p-4 rounded-lg border border-red-200 hover:shadow-md transition-all"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="text-sm text-gray-600 font-medium">Physique</div>
            <span class="text-xs text-red-600 bg-white px-2 py-1 rounded-full font-bold">
              -1.0
            </span>
          </div>
          <div class="text-2xl font-bold text-gray-800 mb-1">9.5</div>
          <div class="text-xs text-red-600 font-medium">/20 • À améliorer</div>
          <div class="w-full bg-red-200 rounded-full h-2 mt-2">
            <div class="bg-red-500 h-2 rounded-full" style="width: 47.5%"></div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
/* Styles personnalisés */
.line-clamp-1 {
  display: -webkit-box;
  /* -webkit-line-clamp: 1; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animation d'entrée */
.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
}

/* Styles pour l'intégration du composant ScheduleOther */
:deep(.schedule-other) {
  box-shadow: none;
  border-radius: 0;
}

:deep(.schedule-header) {
  border-radius: 12px 12px 0 0;
  margin-bottom: 0;
}

:deep(.schedule-table) {
  border-radius: 0 0 12px 12px;
}

:deep(.schedule-content) {
  padding: 0;
}
</style>
