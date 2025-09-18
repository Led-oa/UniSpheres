<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useClasseStore } from "../../stores/academique/classe.store";

const route = useRoute();
const classId = route.params.idClasse;

const classeStore = useClasseStore();

// État local
const students = ref([]);
const classInfo = ref(null);
const isLoading = ref(false);
const error = ref(null);

// Nom de la classe pour l'affichage
const className = ref("Classe");

// Fonction pour charger les étudiants
const loadStudents = async () => {
  if (!classId) return;
  isLoading.value = true;
  error.value = null;
  try {
    const res = await classeStore.getStudentFromClass(classId);
    students.value = res.data || [];
  } catch (err) {
    console.error("Erreur lors de la récupération des étudiants :", err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
};

// Fonction pour charger les infos de la classe
const loadClassInfo = async () => {
  if (!classId) return;
  isLoading.value = true;
  error.value = null;
  try {
    await classeStore.fetchClass(classId); // suppose que currentClass sera mis à jour
    classInfo.value = classeStore.currentClass?.data || null;
    if (classInfo.value) {
      className.value = classInfo.value.name;
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des infos de la classe :", err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadClassInfo();
  loadStudents();
});
</script>

<template>
  <div class="px-6 py-8">
    <!-- Header -->
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ classInfo?.name || "Classe" }}
        </h1>
        <p class="mt-2 text-gray-600">Liste des étudiants</p>
      </div>
    </div>

    <!-- Informations de la classe -->
    <div
      v-if="classInfo"
      class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <div class="text-sm text-gray-600">Étudiants</div>
          <div class="text-2xl font-bold text-blue-600">{{ students.length }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-600">Filière</div>
          <div class="text-2xl font-bold text-purple-600">
            {{ classInfo.filiere_name }}
          </div>
        </div>
        <div>
          <div class="text-sm text-gray-600">Parcours</div>
          <div class="text-2xl font-bold text-indigo-600">
            {{ classInfo.parcours_name }}
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des étudiants -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="students.length === 0" class="text-center py-16">
        <div class="text-gray-400 text-6xl mb-4">👥</div>
        <h3 class="text-lg font-semibold text-gray-600 mb-2">Aucun étudiant</h3>
        <p class="text-gray-500">Aucun étudiant n'est inscrit dans cette classe.</p>
      </div>

      <!-- Students Table -->
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Photo
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Matricule
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nom complet
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Statut
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="student in students"
            :key="student.id"
            class="hover:bg-gray-50 transition-colors duration-200"
          >
            <!-- Photo de profil -->
            <td class="px-8 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="relative">
                  <img
                    v-if="student.profile_pic"
                    :src="student.profile_pic"
                    alt="Photo de profil"
                    class="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div
                    v-else
                    class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-xl border-2 border-white shadow-sm"
                  >
                    👤
                  </div>
                </div>
              </div>
            </td>

            <!-- Matricule -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ student.matricule || "N/A" }}
              </span>
            </td>

            <!-- Nom complet -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ student.name }}</div>
                </div>
              </div>
            </td>

            <!-- Email -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ student.email }}</div>
            </td>

            <!-- Statut -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                Actif
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
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
</style>
