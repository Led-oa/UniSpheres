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
    await classeStore.fetchClass(classId);
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
  <div class="px-6 py-8 transition-all duration-300">
    <!-- Header -->
    <div
      class="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300"
    >
      <button
        @click="$router.back()"
        class="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 ease-in-out"
      >
        <svg
          class="w-5 h-5 text-gray-600 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>
      <div class="transition-all duration-300">
        <h1 class="text-3xl font-bold text-gray-900 transition-colors duration-200">
          {{ classInfo?.name || "Classe" }}
        </h1>
        <p class="mt-2 text-gray-600 transition-colors duration-200">
          Liste des étudiants
        </p>
      </div>
    </div>

    <!-- Informations de la classe -->
    <div
      v-if="classInfo"
      class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100 transition-all duration-300 ease-in-out hover:shadow-lg"
    >
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center transition-all duration-300"
      >
        <div class="transition-all duration-300 hover:scale-105">
          <div class="text-sm text-gray-600 transition-colors duration-200">
            Étudiants
          </div>
          <div class="text-2xl font-bold text-blue-600 transition-colors duration-200">
            {{ students.length }}
          </div>
        </div>
        <div class="transition-all duration-300 hover:scale-105">
          <div class="text-sm text-gray-600 transition-colors duration-200">Filière</div>
          <div class="text-2xl font-bold text-purple-600 transition-colors duration-200">
            {{ classInfo.filiere_name }}
          </div>
        </div>
        <div class="transition-all duration-300 hover:scale-105">
          <div class="text-sm text-gray-600 transition-colors duration-200">Parcours</div>
          <div class="text-2xl font-bold text-indigo-600 transition-colors duration-200">
            {{ classInfo.parcours_name }}
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des étudiants -->
    <div
      class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out"
    >
      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex justify-center items-center py-16 transition-all duration-300"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 transition-colors duration-200"
        ></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16 transition-all duration-300">
        <svg
          class="w-16 h-16 text-red-400 mx-auto mb-4 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h3
          class="text-lg font-semibold text-red-600 mb-2 transition-colors duration-200"
        >
          Erreur de chargement
        </h3>
        <p class="text-gray-500 transition-colors duration-200">
          Impossible de charger la liste des étudiants.
        </p>
        <button
          @click="loadStudents"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 ease-in-out"
        >
          Réessayer
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="students.length === 0"
        class="text-center py-16 transition-all duration-300"
      >
        <svg
          class="w-16 h-16 text-gray-400 mx-auto mb-4 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3
          class="text-lg font-semibold text-gray-600 mb-2 transition-colors duration-200"
        >
          Aucun étudiant
        </h3>
        <p class="text-gray-500 transition-colors duration-200">
          Aucun étudiant n'est inscrit dans cette classe.
        </p>
      </div>

      <!-- Students Table -->
      <div v-else class="transition-all duration-300">
        <table class="min-w-full divide-y divide-gray-200 transition-colors duration-200">
          <thead class="bg-gray-50 transition-colors duration-200">
            <tr class="transition-colors duration-200">
              <th
                class="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200"
              >
                Photo
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200"
              >
                Matricule
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200"
              >
                Nom complet
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200"
              >
                Email
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200"
              >
                Statut
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 transition-colors duration-200">
            <tr
              v-for="student in students"
              :key="student.id"
              class="hover:bg-gray-50 transition-all duration-200 ease-in-out"
            >
              <!-- Photo de profil -->
              <td class="px-8 py-4 whitespace-nowrap transition-colors duration-200">
                <div class="flex items-center transition-colors duration-200">
                  <div class="relative transition-colors duration-200">
                    <img
                      v-if="student.profile_pic"
                      :src="student.profile_pic"
                      alt="Photo de profil"
                      class="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm transition-all duration-200 ease-in-out hover:scale-110"
                    />
                    <div
                      v-else
                      class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-gray-400 border-2 border-white shadow-sm transition-all duration-200 ease-in-out hover:scale-110"
                    >
                      <svg
                        class="w-6 h-6 transition-colors duration-200"
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
                    </div>
                  </div>
                </div>
              </td>

              <!-- Matricule -->
              <td class="px-6 py-4 whitespace-nowrap transition-colors duration-200">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 transition-all duration-200 ease-in-out hover:bg-blue-200"
                >
                  {{ student.matricule || "N/A" }}
                </span>
              </td>

              <!-- Nom complet -->
              <td class="px-6 py-4 whitespace-nowrap transition-colors duration-200">
                <div class="flex items-center transition-colors duration-200">
                  <div class="ml-4 transition-colors duration-200">
                    <div
                      class="text-sm font-medium text-gray-900 transition-colors duration-200"
                    >
                      {{ student.name }}
                    </div>
                    <div
                      v-if="student.lastname"
                      class="text-sm text-gray-500 transition-colors duration-200"
                    >
                      {{ student.lastname }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Email -->
              <td class="px-6 py-4 whitespace-nowrap transition-colors duration-200">
                <div class="text-sm text-gray-900 transition-colors duration-200">
                  {{ student.email }}
                </div>
              </td>

              <!-- Statut -->
              <td class="px-6 py-4 whitespace-nowrap transition-colors duration-200">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 transition-all duration-200 ease-in-out hover:bg-green-200"
                >
                  <svg
                    class="w-3 h-3 mr-1 transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  Actif
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Statistiques supplémentaires -->
    <!-- <div
      v-if="students.length > 0"
      class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-300"
    >
      <div
        class="bg-white rounded-lg p-4 shadow border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-lg"
      >
        <div class="flex items-center transition-colors duration-200">
          <div class="p-2 bg-blue-100 rounded-lg transition-colors duration-200">
            <svg
              class="w-6 h-6 text-blue-600 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div class="ml-4 transition-colors duration-200">
            <p class="text-sm font-medium text-gray-600 transition-colors duration-200">
              Total étudiants
            </p>
            <p class="text-2xl font-bold text-gray-900 transition-colors duration-200">
              {{ students.length }}
            </p>
          </div>
        </div>
      </div>
    </div> -->
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

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
