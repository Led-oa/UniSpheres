<template>
  <div class="space-y-8">
    <h1 class="text-2xl font-bold text-gray-800">
      Notes – {{ course.title }} ({{ className }})
    </h1>

    <div class="bg-white p-6 rounded-xl shadow border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">
        Importer un fichier de notes
      </h2>
      <input type="file" @change="handleFile" class="mb-4" />
      <button
        @click="uploadFile"
        class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded hover:opacity-90"
      >
        Importer
      </button>
    </div>

    <div class="bg-white p-6 rounded-xl shadow border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Saisie manuelle</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <tr>
              <th class="px-6 py-3 text-left text-sm">Étudiant</th>
              <th class="px-6 py-3 text-left text-sm">Note /20</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="s in students" :key="s.id" class="hover:bg-gray-50">
              <td class="px-6 py-3">{{ s.name }}</td>
              <td class="px-6 py-3">
                <input
                  v-model.number="s.grade"
                  type="number"
                  min="0"
                  max="20"
                  class="w-20 px-2 py-1 border rounded"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        @click="saveGrades"
        class="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded hover:opacity-90"
      >
        Enregistrer
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const className = "Terminale A";
const course = { title: "Mathématiques Avancées" };

const students = [
  { id: 1, name: "Alice Dupont", grade: null },
  { id: 2, name: "Jean Martin", grade: null },
];

function handleFile(e) {
  const file = e.target.files[0];
  if (file) console.log("Fichier choisi:", file.name);
}

function uploadFile() {
  console.log("Importer fichier…");
}

function saveGrades() {
  console.log("Notes sauvegardées", students);
}
</script>
