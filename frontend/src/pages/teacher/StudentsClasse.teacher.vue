<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">Étudiants – Classe {{ className }}</h1>

    <div class="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-medium">Nom</th>
            <th class="px-6 py-3 text-left text-sm font-medium">Email</th>
            <th class="px-6 py-3 text-left text-sm font-medium">Matricule</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="student in students" :key="student.id" class="hover:bg-gray-50">
            <td class="px-6 py-3">{{ student.name }}</td>
            <td class="px-6 py-3">{{ student.email }}</td>
            <td class="px-6 py-3">{{ student.matricule }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const className = route.params.classId || "Classe";

const students = [
  { id: 1, name: "Alice Dupont", email: "alice@uni.com", matricule: "STD-101" },
  { id: 2, name: "Jean Martin", email: "jean@uni.com", matricule: "STD-102" },
  { id: 3, name: "Sophie Durand", email: "sophie@uni.com", matricule: "STD-103" },
];
</script>
