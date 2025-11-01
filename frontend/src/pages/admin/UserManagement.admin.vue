<script setup>
import { ref, computed, onMounted, watch } from "vue";

import { useAdminStore } from "../../stores/admin.store";

import PaginationGenerale from "../../components/generale/Pagination.generale.vue";
import ModalUserAdmin from "../../components/admin/ModalUser.admin.vue";

// Onglet actif
const activeTab = ref("students");

// Récupération du store
const adminStore = useAdminStore();

// Modals
const showDeleteModal = ref(false);
const showUserModal = ref(false);
const userToDelete = ref(null);
const selectedUser = ref(null);

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
function handleActivation() {
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
  selectedUser.value = user;
  showUserModal.value = true;
}

function handleDelete(user) {
  userToDelete.value = user;
  showDeleteModal.value = true;
}

// Confirmer la suppression
function confirmDelete() {
  if (userToDelete.value) {
    adminStore.removeUser(userToDelete.value.id_user);
    closeDeleteModal();
  }
}

// Annuler la suppression
function cancelDelete() {
  closeDeleteModal();
}

// Fermer le modal de suppression
function closeDeleteModal() {
  showDeleteModal.value = false;
  userToDelete.value = null;
}

function handleActivate(user) {
  adminStore.activate(user.id_user);
}

function handleDesactivate(user) {
  adminStore.desactivate(user.id_user);
}

const loadUsers = async (page = 1) => {
  const limit = 10;

  if (activeTab.value === "students") {
    await adminStore.fetchUsersByRole("student", page, limit);
  } else if (activeTab.value === "teachers") {
    await adminStore.fetchUsersByRole("teacher", page, limit);
  } else if (activeTab.value === "admins") {
    await adminStore.fetchUsersByRole("administrator", page, limit);
  }
};

// Gestion du changement de page
const handlePageChange = (page) => {
  loadUsers(page);
};

// Watcher pour recharger les données quand l'onglet change
watch(activeTab, (newTab) => {
  loadUsers(1);
});

// Fetch initial
onMounted(() => {
  loadUsers(1);
});
</script>

<template>
  <section class="space-y-8">
    <!-- En-tête -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h1>
        <p class="text-gray-500 text-sm mt-1">
          Activer, modifier ou supprimer des comptes.
        </p>
      </div>
      <button
        @click="handleActivation"
        class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:opacity-90 transition-all duration-200 font-medium"
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
        class="px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200"
        :class="
          activeTab === tab.key
            ? 'border-purple-600 text-purple-700 bg-purple-50'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tableau dynamique -->
    <div class="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
      <table class="min-w-full">
        <thead class="bg-gray-50 text-gray-700 text-sm">
          <tr>
            <th class="px-6 py-4 text-left font-semibold">Matricule</th>
            <th class="px-6 py-4 text-left font-semibold">Nom complete</th>
            <th class="px-6 py-4 text-left font-semibold">Email</th>
            <th class="px-6 py-4 text-left font-semibold">Statut</th>
            <th class="px-6 py-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="user in currentUsers"
            :key="user.id_user"
            class="hover:bg-gray-50 transition-colors duration-150"
          >
            <td class="px-6 py-4">
              <span class="font-mono text-sm text-gray-600">
                {{ user.matricule || "Non attribué" }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-sm font-medium text-gray-700"
                >
                  {{ user.name?.charAt(0) || "" }}{{ user.lastname?.charAt(0) || "" }}
                </div>
                <span class="font-medium text-gray-900">
                  {{ user.lastname }} {{ user.name }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600">{{ user.email }}</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
                  user.is_active
                    ? 'bg-green-100 px-7 text-green-800 border-green-200'
                    : 'bg-red-100 px-6 text-red-800 border-red-200',
                ]"
              >
                <span
                  :class="[
                    'w-2 h-2 rounded-full mr-2',
                    user.is_active ? 'bg-green-500' : 'bg-red-500',
                  ]"
                ></span>
                {{ user.is_active ? "Actif" : "Inactif" }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-end space-x-2">
                <button
                  @click="handleEdit(user)"
                  class="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>Détails</span>
                </button>
                <button
                  @click="handleDelete(user)"
                  class="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Supprimer</span>
                </button>
                <button
                  v-if="!user.is_active"
                  @click="handleActivate(user)"
                  class="flex items-center space-x-1 px-7 py-2 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Activer</span>
                </button>
                <button
                  v-else
                  @click="handleDesactivate(user)"
                  class="flex items-center space-x-1 px-4.5 py-2 text-sm text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Désactiver</span>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!currentUsers.length && !adminStore.loading">
            <td colspan="5" class="text-center text-gray-500 py-8">
              <div class="flex flex-col items-center space-y-2">
                <svg
                  class="w-12 h-12 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <p class="text-gray-500">Aucun utilisateur dans cette catégorie.</p>
              </div>
            </td>
          </tr>
          <tr v-if="adminStore.loading">
            <td colspan="5" class="text-center py-8">
              <div class="flex justify-center items-center space-x-2">
                <div
                  class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
                ></div>
                <span class="text-gray-500">Chargement...</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <PaginationGenerale
      v-if="adminStore.pagination.totalPages > 0"
      :current-page="adminStore.pagination.currentPage"
      :total-pages="adminStore.pagination.totalPages"
      :total-items="adminStore.pagination.totalItems"
      :items-per-page="adminStore.pagination.itemsPerPage"
      @page-change="handlePageChange"
    />

    <!-- Modal de détails utilisateur -->
    <ModalUserAdmin
      :user="selectedUser"
      :show="showUserModal"
      @close="showUserModal = false"
    />

    <!-- Modal de confirmation de suppression -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200"
      @click.self="cancelDelete"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-200 scale-100"
      >
        <div class="p-6 text-center">
          <!-- Icône d'alerte -->
          <div
            class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4"
          >
            <svg
              class="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Confirmer la suppression
          </h3>
          <p class="text-gray-600 mb-6">
            Voulez-vous vraiment supprimer l'utilisateur :
            <strong class="text-gray-900"
              >"{{ userToDelete?.name }} {{ userToDelete?.lastname }}"</strong
            >
            ?
            <br />
            <span class="text-sm text-gray-500 block mt-1">
              ({{ userToDelete?.email }})
            </span>
          </p>

          <div class="flex gap-3 justify-center">
            <button
              @click="cancelDelete"
              class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Annuler
            </button>
            <button
              @click="confirmDelete"
              class="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Styles pour les transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
