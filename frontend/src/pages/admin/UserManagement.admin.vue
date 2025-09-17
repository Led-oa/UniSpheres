<script setup>
import { ref, computed, onMounted } from "vue";

import { useAdminStore } from "../../stores/admin.store";

// Onglet actif
const activeTab = ref("students");

// Récupération du store
const adminStore = useAdminStore();

// Liste dynamique selon l'onglet actif
const currentUsers = computed(() => {
  return adminStore.users.filter((u) => {
    if (activeTab.value === "students") return u.role === "student";
    if (activeTab.value === "teachers") return u.role === "teacher";
    if (activeTab.value === "admins") return u.role === "administrator";
    return false;
  });
});

// Actions
function handleAdd() {
  switch (activeTab.value) {
    case "students":
      alert("Activate student");
      break;
    case "teachers":
      alert("Activate teacher");
      break;
    case "admins":
      alert("Ajouter un administrateur");
      break;
  }
}

function handleEdit(user) {
  alert(`Modifier ${user.name}`);
}

function handleDelete(user) {
  if (confirm(`Voulez-vous vraiment supprimer ${user.name} ?`)) {
    adminStore.removeUser(user.id_user);
  }
}

function handleActivate(user) {
  adminStore.activate(user.id_user);
}

function handleDesactivate(user) {
  adminStore.desactivate(user.id_user);
}

// Fetch initial
onMounted(() => {
  adminStore.fetchUsers();
});
</script>

<template>
  <section class="space-y-8">
    <!-- En-tête -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h1>
        <p class="text-gray-500 text-sm mt-1">
          Ajouter, modifier ou supprimer des comptes.
        </p>
      </div>
      <button
        @click="handleAdd"
        class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:opacity-90"
      >
        <span v-if="activeTab === 'students'">+ Activer Étudiant</span>
        <span v-else-if="activeTab === 'teachers'">+ Activer Enseignant</span>
        <span v-else>+ Nouvel Administrateur</span>
      </button>
    </header>

    <!-- Onglets -->
    <div class="flex space-x-4 border-b border-gray-200">
      <button
        v-for="tab in [
          { key: 'students', label: 'Étudiants' },
          { key: 'teachers', label: 'Enseignants' },
          { key: 'admins', label: 'Administrateurs' },
        ]"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="px-4 py-2 text-sm font-medium border-b-2 transition"
        :class="
          activeTab === tab.key
            ? 'border-purple-600 text-purple-700'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tableau dynamique -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white rounded-xl shadow border border-gray-100">
        <thead class="bg-gray-50 text-gray-700 text-sm">
          <tr>
            <th class="px-4 py-3 text-left">Nom</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Statut</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in currentUsers" :key="user.id" class="border-t">
            <td class="px-4 py-3">{{ user.name }}</td>
            <td class="px-4 py-3">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  user.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800',
                ]"
              >
                {{ user.is_active ? "Actif" : "Inactif" }}
              </span>
            </td>
            <td class="px-4 py-3 text-right space-x-2">
              <button @click="handleEdit(user)" class="text-blue-600 hover:underline">
                Modifier
              </button>
              <button @click="handleDelete(user)" class="text-red-500 hover:underline">
                Supprimer
              </button>
              <button
                v-if="!user.is_active"
                @click="handleActivate(user)"
                class="text-green-600 hover:underline"
              >
                Activer
              </button>
              <button
                v-else
                @click="handleDesactivate(user)"
                class="text-orange-500 hover:underline"
              >
                Désactiver
              </button>
            </td>
          </tr>
          <tr v-if="!currentUsers.length">
            <td colspan="4" class="text-center text-gray-500 py-4">
              Aucun utilisateur dans cette catégorie.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
