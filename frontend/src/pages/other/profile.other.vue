<script setup>
import { onMounted, computed, ref } from "vue";
import { useAuthStore } from "../../stores/auth.store"; // pour récupérer l’ID du user connecté
import { useUserStore } from "../../stores/user.store";

import ModalProfilOther from "../../components/others/ModalProfil.other.vue";

const authStore = useAuthStore();
const userStore = useUserStore();

const userId = authStore.user?.id_user || null;

// Etat du modal et type de mise à jour
const showModal = ref(false);
const modalMode = ref(""); // 'updatePhoto', 'updateProfil', 'updatePassword'

// Récupération du profil dès le montage
onMounted(async () => {
  if (userId) {
    await userStore.fetchUser(userId);
  }
});

// Ouvrir le modal selon le type
function openModal(mode) {
  modalMode.value = mode;
  showModal.value = true;
}

// Raccourcis
const current = computed(() => ({
  name: "",
  lastname: "",
  email: "",
  role: "",
  is_active: false,
  id_user: "",
  profile_pic: "",
  class_id: "",
  class_name: "",
  matricule: "",
  created_at: new Date(),
  ...userStore.currentUser, // Spread operator pour fusionner avec les valeurs par défaut
}));
const isLoading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

// Rafraîchir le profil après mise à jour
function handleUpdated() {
  if (userId) {
    userStore.fetchUser(userId);
  }
}
</script>

<template>
  <div class="px-6 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Profil {{ current.name }} {{ current.lastname }}
      </h1>
      <p class="mt-2 text-gray-600">Gérez vos informations personnelles</p>
    </div>

    <!-- Loader -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="text-red-600 font-medium text-center py-6">
      Une erreur est survenue : {{ error.message || error }}
    </div>

    <!-- Contenu profil -->
    <div v-else-if="current" class="max-w-4xl mx-auto">
      <!-- Carte profil -->
      <div class="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
        <div class="flex items-center space-x-6">
          <div class="flex flex-col items-center">
            <div
              class="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full overflow-hidden flex items-center justify-center mb-4 border-4 border-white shadow-lg"
            >
              <img
                v-if="current.profile_pic"
                :src="current.profile_pic"
                alt="Photo de profil"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-4xl">👤</span>
            </div>
            <button
              @click="openModal('updatePhoto')"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Changer la photo
            </button>
          </div>

          <!-- Infos principales -->
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900">
              {{ current.name }} {{ current.lastname }}
            </h2>
            <p class="text-gray-600">{{ current.email }}</p>
            <div class="mt-2 flex items-center space-x-4">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ current.role }}
              </span>
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  current.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800',
                ]"
              >
                {{ current.is_active ? "Actif" : "Inactif" }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Détails -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Informations personnelles
          </h3>
          <dl class="space-y-3">
            <div>
              <dt class="text-sm font-medium text-gray-500">ID Utilisateur</dt>
              <dd class="text-sm text-gray-900">{{ current.id_user }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Nom complet</dt>
              <dd class="text-sm text-gray-900">
                {{ current.lastname }} {{ current.name }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="text-sm text-gray-900">{{ current.email }}</dd>
            </div>

            <!-- Afficher info supplémentaires selon le rôle -->
            <template v-if="current.role === 'student'">
              <div>
                <dt class="text-sm font-medium text-gray-500">Classe</dt>
                <dd class="text-sm text-gray-900">{{ current.class_name }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Filière</dt>
                <dd class="text-sm text-gray-900">{{ current.filiere_name }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Parcours</dt>
                <dd class="text-sm text-gray-900">{{ current.parcours_name }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Année</dt>
                <dd class="text-sm text-gray-900">{{ current.year_value }}</dd>
              </div>
            </template>

            <template v-else-if="current.role === 'teacher'">
              <div>
                <dt class="text-sm font-medium text-gray-500">Matricule</dt>
                <dd class="text-sm text-gray-900">{{ current.matricule }}</dd>
              </div>
            </template>
          </dl>
        </div>

        <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Statut du compte</h3>
          <dl class="space-y-3">
            <div>
              <dt class="text-sm font-medium text-gray-500">Rôle</dt>
              <dd class="text-sm text-gray-900">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ current.role }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Statut</dt>
              <dd class="text-sm text-gray-900">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    current.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ current.is_active ? "Actif" : "Inactif" }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Membre depuis</dt>
              <dd class="text-sm text-gray-900">
                {{ new Date(current.created_at).toLocaleDateString("fr-FR") }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-8 bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            @click="openModal('updateProfil')"
          >
            Modifier le profil
          </button>
          <button
            class="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            @click="openModal('updatePassword')"
          >
            Changer le mot de passe
          </button>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <ModalProfilOther
      :mode="modalMode"
      :userId="userId"
      :show="showModal"
      @close="showModal = false"
      @updated="handleUpdated"
    />
  </div>
</template>
