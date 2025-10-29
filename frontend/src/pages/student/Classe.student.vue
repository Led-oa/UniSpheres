<script setup>
import { ref, onMounted, computed } from "vue";
import { useClasseStore } from "../../stores/academique/classe.store";
import { useAuthStore } from "../../stores/auth.store";

const classeStore = useClasseStore();
const authStore = useAuthStore();

const isLoading = ref(false);
const error = ref(null);
const classInfo = ref(null);
const students = ref([]);
const teachers = ref([]);

// Récupération des données
const loadMyClass = async () => {
  try {
    isLoading.value = true;

    if (!authStore.user) {
      await authStore.fetchUserData();
    }

    const myClassId = authStore.user?.class_id;
    if (!myClassId) throw new Error("Aucune classe associée à votre compte.");

    // Infos de la classe
    await classeStore.fetchClass(myClassId);

    console.log("Classe Information : ", classeStore.currentClass?.data);

    classInfo.value = classeStore.currentClass?.data;

    // Étudiants
    const res = await classeStore.getStudentFromClass(myClassId);
    students.value = res.data || [];

    const resTeacher = await classeStore.getTeacherOfClass(myClassId);
    teachers.value = resTeacher.data || [];
  } catch (err) {
    console.error("Erreur lors du chargement de la classe :", err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
};

// Helpers
const studentCount = computed(() => students.value.length);
const teacherCount = computed(() => teachers.value.length);
const formatStudentName = (s) =>
  `${s.lastname || ""} ${s.name || ""}`.trim() || "Nom indisponible";

onMounted(loadMyClass);
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <!-- Loading -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
      <div class="relative">
        <div class="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
        <div
          class="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
      <p class="mt-4 text-gray-600 font-medium">Chargement des données...</p>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm mb-6"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg
            class="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-red-800 font-medium text-lg">Erreur de chargement</h3>
          <p class="text-red-700 mt-1">
            {{ error.message || "Impossible de charger les informations." }}
          </p>
        </div>
      </div>
    </div>

    <!-- Contenu -->
    <div v-else>
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          {{ classInfo?.name || "Classe" }}
        </h1>
        <div
          class="w-20 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mt-4"
        ></div>
        <p class="text-gray-600 mt-4 max-w-2xl mx-auto">
          Informations détaillées sur la classe, ses étudiants et enseignants
        </p>
      </div>

      <!-- Détails -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">
          Informations de la classe
        </h2>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
            <div
              class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Nom de la classe</p>
              <p class="text-lg font-semibold text-gray-800">
                {{ classInfo?.name }}
              </p>
            </div>
          </div>

          <!-- <div class="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
            <div
              class="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Chef de mention</p>
              <p class="text-lg font-semibold text-gray-800">
                {{ classInfo?.chefMention || "Non défini" }}
              </p>
            </div>
          </div> -->

          <div class="flex items-start space-x-4 p-4 bg-indigo-50 rounded-lg">
            <div
              class="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Année</p>
              <p class="text-lg font-semibold text-gray-800">
                {{ classInfo?.year_value }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Étudiants -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8"
      >
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-2xl font-bold">Liste des Étudiants</h2>
              <p class="text-blue-100 mt-1">{{ studentCount }} étudiant(s) inscrit(s)</p>
            </div>
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 bg-opacity-20 text-blue-100 mt-3 sm:mt-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Étudiants
            </span>
          </div>
        </div>

        <div class="p-6">
          <!-- Aucun étudiant -->
          <div v-if="!students.length" class="text-center py-10">
            <div
              class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-600 mb-2">Aucun étudiant</h3>
            <p class="text-gray-500 max-w-md mx-auto">
              Aucun étudiant n'est actuellement inscrit dans cette classe.
            </p>
          </div>

          <!-- Grille d'étudiants -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="student in students"
              :key="student.id_user"
              class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-100"
            >
              <div class="flex items-center space-x-4">
                <div class="relative">
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center overflow-hidden shadow-inner"
                  >
                    <img
                      v-if="student.profile_pic"
                      :src="student.profile_pic"
                      alt="Profil"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                  <!-- <div
                    class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"
                  ></div> -->
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-800 truncate">
                    {{ formatStudentName(student) }}
                  </h3>
                  <p class="text-sm text-gray-600 truncate">
                    Matricule: {{ student.matricule || student.id_user }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enseignants -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-2xl font-bold">Liste des Enseignants</h2>
              <p class="text-purple-100 mt-1">{{ teacherCount }} enseignant(s)</p>
            </div>
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500 bg-opacity-20 text-purple-100 mt-3 sm:mt-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              Enseignants
            </span>
          </div>
        </div>

        <div class="p-6">
          <!-- Aucun enseignant -->
          <div v-if="!teachers.length" class="text-center py-10">
            <div
              class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-600 mb-2">Aucun enseignant</h3>
            <p class="text-gray-500 max-w-md mx-auto">
              Aucun enseignant n'enseigne actuellement dans cette classe.
            </p>
          </div>

          <!-- Grille d'enseignant -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="teacher in teachers"
              :key="teacher.id_user"
              class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-purple-100"
            >
              <div class="flex items-center space-x-4">
                <div class="relative">
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center overflow-hidden shadow-inner"
                  >
                    <img
                      v-if="teacher.profile_pic"
                      :src="teacher.profile_pic"
                      alt="Profil"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                  <!-- <div
                    class="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-400 border-2 border-white rounded-full"
                  ></div> -->
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-800 truncate">
                    {{ formatStudentName(teacher) }}
                  </h3>
                  <p class="text-sm text-gray-600 truncate">
                    Matricule: {{ teacher.matricule || teacher.id_user }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
