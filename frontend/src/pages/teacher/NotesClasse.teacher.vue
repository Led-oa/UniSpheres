<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();
const className = route.params.classId || "Classe";

const subjects = [
  {
    id: 1,
    name: "Mathématiques",
    teacher: "Mr. Dupuis",
    notes: [
      { student: "Alice Dupont", grade: 16 },
      { student: "Jean Martin", grade: 14 },
    ],
  },
  {
    id: 2,
    name: "Physique",
    teacher: "Mme. Leroy",
    notes: [
      { student: "Alice Dupont", grade: 15 },
      { student: "Jean Martin", grade: 17 },
    ],
  },
];

let selectedSubject = ref(null);
function openModal(subject) {
  selectedSubject = subject;
}
</script>
<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">Notes – Classe {{ className }}</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="subject in subjects"
        :key="subject.id"
        class="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col"
      >
        <h2 class="text-lg font-semibold text-purple-700">{{ subject.name }}</h2>
        <p class="text-gray-500 mt-1">{{ subject.teacher }}</p>
        <button
          @click="openModal(subject)"
          class="mt-4 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90"
        >
          Voir les notes
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="selectedSubject"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
        <button
          @click="selectedSubject = null"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h3 class="text-xl font-bold text-gray-800 mb-4">
          Notes – {{ selectedSubject.name }}
        </h3>
        <ul class="space-y-2">
          <li
            v-for="note in selectedSubject.notes"
            :key="note.student"
            class="flex justify-between border-b pb-1"
          >
            <span>{{ note.student }}</span>
            <span class="font-semibold">{{ note.grade }}/20</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
