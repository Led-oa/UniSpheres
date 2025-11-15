<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useScheduleStore } from "../../stores/schedule.store";

// Props
const props = defineProps({
  classId: {
    type: [Number, String],
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  viewMode: {
    type: String,
    default: "table", // 'table' | 'cards'
    validator: (value) => ["table", "cards"].includes(value),
  },
  showWeekSelector: {
    type: Boolean,
    default: true,
  },
  showStatistics: {
    type: Boolean,
    default: true,
  },
  showRefresh: {
    type: Boolean,
    default: true,
  },
  showEmptyMessage: {
    type: Boolean,
    default: true,
  },
  emptyMessage: {
    type: String,
    default: "Aucun cours planifié pour cette période.",
  },
  autoLoad: {
    type: Boolean,
    default: true,
  },
});

// Emits
const emit = defineEmits(["schedule-loaded", "cell-click", "error"]);

// Store
const scheduleStore = useScheduleStore();

// Data
const selectedWeek = ref("");
const availableWeeks = ref([]);

// Computed
const loading = computed(() => scheduleStore.isLoading);
const error = computed(() => scheduleStore.getError);
const organizedSchedule = computed(() => scheduleStore.getOrganizedSchedule);
const statistics = computed(() => scheduleStore.getStatistics);

const hasScheduleData = computed(() => {
  if (!organizedSchedule.value) return false;

  const hasCourses = Object.values(organizedSchedule.value).some((day) =>
    Object.values(day).some((periods) => periods.length > 0)
  );

  return hasCourses;
});

const days = computed(() => [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
]);

const periods = computed(() => [
  { code: "P1", label: "", description: "Première période" },
  { code: "P2", label: "", description: "Deuxième période" },
  { code: "P3", label: "", description: "Troisième période" },
  { code: "P4", label: "", description: "Quatrième période" },
]);

// Methods
const loadAvailableWeeks = async () => {
  try {
    const weeks = await scheduleStore.fetchAvailableWeeks(props.classId);
    availableWeeks.value = weeks;
  } catch (err) {
    console.error("Erreur chargement semaines:", err);
  }
};

const loadSchedule = async () => {
  try {
    await scheduleStore.fetchOrganizedSchedule(props.classId, selectedWeek.value);
    emit("schedule-loaded", {
      schedule: organizedSchedule.value,
      statistics: statistics.value,
      week: selectedWeek.value,
    });
  } catch (err) {
    emit("error", err);
  }
};

const formatWeek = (weekString) => {
  const date = new Date(weekString);
  return `Semaine du ${date.toLocaleDateString("fr-FR")}`;
};

const getCoursesInSlot = (day, periodCode) => {
  const dayKey = day.toLowerCase();
  return organizedSchedule.value[dayKey]?.[periodCode] || [];
};

const getCellClass = (day, periodCode) => {
  const courses = getCoursesInSlot(day, periodCode);
  const baseClasses = [
    "border",
    "border-gray-200",
    "p-2",
    "transition-all",
    "duration-200",
    "ease-in-out",
    "cursor-pointer",
    "min-h-[80px]",
  ];

  if (courses.length > 0) {
    baseClasses.push("bg-green-50", "border-green-200", "hover:bg-green-100");
    if (courses.some((course) => course.is_preferred)) {
      baseClasses.push("bg-yellow-50", "border-yellow-300", "border-2");
    }
  } else {
    baseClasses.push("bg-gray-50", "hover:bg-gray-100");
  }

  return baseClasses.join(" ");
};

const getTeacherShortName = (fullName) => {
  const parts = fullName.split(" ");
  return parts.length > 0 ? parts[0] : fullName;
};

const onCellClick = (day, periodCode) => {
  const courses = getCoursesInSlot(day, periodCode);
  emit("cell-click", {
    day: day.toLowerCase(),
    period: periodCode,
    courses,
  });
};

// Lifecycle
onMounted(async () => {
  if (props.autoLoad) {
    await loadAvailableWeeks();
    await loadSchedule();
  }
});

// Watchers
watch(
  () => props.classId,
  async (newClassId) => {
    if (newClassId && props.autoLoad) {
      await loadAvailableWeeks();
      await loadSchedule();
    }
  }
);
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 ease-in-out"
  >
    <!-- En-tête avec sélecteurs -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4 text-white">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-xl font-bold mb-1 transition-colors duration-200" v-if="title">
            {{ title }}
          </h3>
          <h3 class="text-xl font-bold mb-1 transition-colors duration-200" v-else>
            Emploi du Temps
          </h3>

          <div v-if="showWeekSelector" class="flex items-center gap-3">
            <label
              for="week-select"
              class="text-sm font-medium text-blue-100 transition-colors duration-200"
            >
              Semaine :
            </label>
            <select
              id="week-select"
              v-model="selectedWeek"
              @change="loadSchedule"
              :disabled="loading"
              class="px-3 py-1 rounded border-0 bg-white/20 text-white focus:bg-white/30 focus:ring-2 focus:ring-blue-300 transition-all duration-200 ease-in-out"
            >
              <option value="" class="text-gray-800">Semaine courante</option>
              <option
                v-for="week in availableWeeks"
                :key="week"
                :value="week"
                class="text-gray-800"
              >
                {{ formatWeek(week) }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            v-if="showRefresh"
            @click="loadSchedule"
            :disabled="loading"
            class="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-white border-opacity-30 transition-all duration-200 ease-in-out font-medium"
          >
            <svg
              v-if="loading"
              class="animate-spin h-4 w-4 text-white transition-colors duration-200"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else
              class="h-4 w-4 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            {{ loading ? "Chargement..." : "Actualiser" }}
          </button>
        </div>
      </div>
    </div>

    <!-- États de chargement et d'erreur -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-12 px-6 transition-all duration-300 ease-in-out"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 transition-colors duration-200"
      ></div>
      <p class="text-gray-600 font-medium transition-colors duration-200">
        Chargement de l'emploi du temps...
      </p>
    </div>

    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center py-12 px-6 text-center transition-all duration-300 ease-in-out"
    >
      <svg
        class="w-12 h-12 text-red-500 mb-4 transition-colors duration-200"
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
      <p class="text-red-600 font-medium mb-2 transition-colors duration-200">
        Une erreur est survenue
      </p>
      <p class="text-gray-600 text-sm mb-4 transition-colors duration-200">{{ error }}</p>
      <button
        @click="loadSchedule"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 ease-in-out font-medium"
      >
        Réessayer
      </button>
    </div>

    <div
      v-else-if="!hasScheduleData"
      class="flex flex-col items-center justify-center py-12 px-6 text-center transition-all duration-300 ease-in-out"
    >
      <svg
        class="w-12 h-12 text-gray-400 mb-4 transition-colors duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p class="text-gray-600 font-medium mb-2 transition-colors duration-200">
        Aucun emploi du temps disponible
      </p>
      <p
        v-if="showEmptyMessage"
        class="text-gray-500 text-sm transition-colors duration-200"
      >
        {{ emptyMessage }}
      </p>
    </div>

    <!-- Emploi du temps -->
    <div v-else class="p-1 transition-all duration-300 ease-in-out">
      <!-- Vue Tableau -->
      <div
        v-if="viewMode === 'table'"
        class="overflow-x-auto transition-all duration-300 ease-in-out"
      >
        <table class="w-full border-collapse transition-all duration-300 ease-in-out">
          <thead>
            <tr class="bg-gray-50 transition-colors duration-200">
              <th
                class="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200 transition-colors duration-200"
              >
                Créneau
              </th>
              <th
                v-for="day in days"
                :key="day"
                class="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200 transition-colors duration-200"
              >
                {{ day }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 transition-all duration-300">
            <tr
              v-for="period in periods"
              :key="period.code"
              class="transition-colors duration-200"
            >
              <td
                class="px-4 py-3 bg-gray-50 border-r border-gray-200 transition-colors duration-200"
              >
                <div
                  class="text-sm font-semibold text-gray-900 transition-colors duration-200"
                >
                  {{ period.description }}
                </div>
                <div class="text-xs text-gray-500 transition-colors duration-200">
                  {{ period.label }}
                </div>
              </td>
              <td
                v-for="day in days"
                :key="`${day}-${period.code}`"
                :class="getCellClass(day, period.code)"
                @click="onCellClick(day, period.code)"
                class="transition-all duration-200 ease-in-out"
              >
                <div
                  v-if="getCoursesInSlot(day, period.code).length > 0"
                  class="space-y-1 transition-all duration-200"
                >
                  <div
                    v-for="course in getCoursesInSlot(day, period.code)"
                    :key="course.id_schedule"
                    class="p-2 rounded border-l-4 bg-white shadow-sm transition-all duration-200 ease-in-out hover:shadow-md"
                    :class="[
                      course.is_preferred
                        ? 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                        : 'border-green-500 hover:bg-green-100',
                    ]"
                  >
                    <div
                      class="flex justify-between items-start transition-colors duration-200"
                    >
                      <div class="flex-1">
                        <div
                          class="text-sm font-semibold text-gray-900 line-clamp-1 transition-colors duration-200"
                        >
                          {{ course.course_title }}
                        </div>
                        <div
                          class="text-xs text-gray-600 mt-1 transition-colors duration-200"
                        >
                          {{ getTeacherShortName(course.teacher_name) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="flex items-center justify-center h-full text-gray-400 text-sm italic transition-colors duration-200"
                >
                  —
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Vue Cartes -->
      <div
        v-else-if="viewMode === 'cards'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 transition-all duration-300 ease-in-out"
      >
        <div
          v-for="day in days"
          :key="day"
          class="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg"
        >
          <div
            class="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 transition-colors duration-200"
          >
            <h4
              class="text-lg font-semibold text-white text-center transition-colors duration-200"
            >
              {{ day }}
            </h4>
          </div>
          <div class="p-4 space-y-3 transition-all duration-300">
            <div
              v-for="period in periods"
              :key="period.code"
              class="bg-white rounded-lg border border-gray-200 p-3 transition-all duration-200 ease-in-out hover:shadow-md"
              :class="{
                'border-green-300 bg-green-50 hover:bg-green-100':
                  getCoursesInSlot(day, period.code).length > 0,
              }"
            >
              <div
                class="flex justify-between items-center mb-2 transition-colors duration-200"
              >
                <span
                  class="text-sm font-semibold text-gray-900 transition-colors duration-200"
                  >{{ period.code }}</span
                >
                <span
                  class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded transition-colors duration-200"
                >
                  {{ period.label }}
                </span>
              </div>
              <div class="text-xs text-gray-600 mb-3 transition-colors duration-200">
                {{ period.description }}
              </div>

              <div class="space-y-2 transition-all duration-200">
                <div
                  v-for="course in getCoursesInSlot(day, period.code)"
                  :key="course.id_schedule"
                  class="p-2 rounded border-l-4 text-sm transition-all duration-200 ease-in-out hover:shadow-sm"
                  :class="[
                    course.is_preferred
                      ? 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                      : 'border-green-500 bg-white hover:bg-green-50',
                  ]"
                >
                  <div
                    class="flex justify-between items-start transition-colors duration-200"
                  >
                    <div class="flex-1">
                      <div
                        class="font-medium text-gray-900 transition-colors duration-200"
                      >
                        {{ course.course_title }}
                      </div>
                      <div
                        class="text-xs text-gray-600 mt-1 transition-colors duration-200"
                      >
                        {{ getTeacherShortName(course.teacher_name) }}
                      </div>
                    </div>
                    <div
                      v-if="course.is_preferred"
                      class="text-yellow-500 text-xs flex-shrink-0 ml-1 transition-colors duration-200"
                      title="Créneau préféré"
                    >
                      ★
                    </div>
                  </div>
                </div>

                <div
                  v-if="getCoursesInSlot(day, period.code).length === 0"
                  class="text-center py-4 text-gray-400 text-sm italic transition-colors duration-200"
                >
                  Aucun cours
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div
        v-if="showStatistics && statistics.totalAssignments"
        class="border-t border-gray-200 bg-gray-50 px-6 py-4 transition-all duration-300 ease-in-out"
      >
        <h4
          class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 transition-colors duration-200"
        >
          <svg
            class="w-5 h-5 text-gray-600 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
          Statistiques
        </h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-300">
          <div
            v-for="(stat, index) in [
              {
                value: statistics.totalAssignments,
                label: 'Cours planifiés',
                color: 'blue',
              },
              {
                value: statistics.preferredAssignments,
                label: 'Créneaux préférés',
                color: 'green',
              },
              {
                value: statistics.preferenceSatisfaction,
                label: 'Satisfaction',
                color: 'purple',
              },
              { value: statistics.totalTeachers, label: 'Enseignants', color: 'orange' },
            ]"
            :key="index"
            class="bg-white rounded-lg p-4 text-center border border-gray-200 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:scale-105"
          >
            <div
              :class="`text-2xl font-bold mb-1 transition-colors duration-200 text-${stat.color}-600`"
            >
              {{ stat.value }}
            </div>
            <div class="text-sm text-gray-600 transition-colors duration-200">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation pour les cellules */
.schedule-cell {
  transition: all 0.2s ease-in-out;
}

.schedule-cell:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
  transition: background-color 0.2s ease-in-out;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
