<script setup>
import { onMounted, computed, ref } from "vue";
import { useAuthStore } from "../../stores/auth.store"; // pour récupérer l'ID du user connecté
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
  <div class="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
    <!-- En-tête -->
    <div class="mb-6 lg:mb-8 text-center lg:text-left">
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
        Profil {{ current.name }} {{ current.lastname }}
      </h1>
      <p class="mt-2 text-gray-600 text-sm lg:text-base">
        Gérez vos informations personnelles
      </p>
    </div>

    <!-- Loader -->
    <div v-if="isLoading" class="flex justify-center py-8 lg:py-12">
      <div
        class="animate-spin rounded-full h-10 w-10 lg:h-12 lg:w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Erreur -->
    <div
      v-else-if="error"
      class="text-red-600 font-medium text-center py-4 lg:py-6 text-sm lg:text-base"
    >
      Une erreur est survenue : {{ error.message || error }}
    </div>

    <!-- Contenu profil -->
    <div v-else-if="current" class="max-w-4xl mx-auto">
      <!-- Carte profil principale -->
      <div
        class="bg-white rounded-lg shadow border border-gray-200 p-4 lg:p-6 mb-6 lg:mb-8"
      >
        <div
          class="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-6"
        >
          <!-- Photo de profil -->
          <div class="flex flex-col items-center">
            <div
              class="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full overflow-hidden flex items-center justify-center mb-3 lg:mb-4 border-4 border-white shadow-lg transition-all duration-300 ease-in-out"
            >
              <img
                v-if="current.profile_pic"
                :src="current.profile_pic"
                alt="Photo de profil"
                class="w-full h-full object-cover transition-all duration-300 ease-in-out"
              />
              <span
                v-else
                class="text-2xl lg:text-4xl transition-all duration-300 ease-in-out"
                >👤</span
              >
            </div>
            <button
              @click="openModal('updatePhoto')"
              class="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-medium transition-all duration-200 ease-in-out hover:scale-105"
            >
              Changer la photo
            </button>
          </div>

          <!-- Infos principales -->
          <div class="flex-1 text-center lg:text-left">
            <h2 class="text-xl lg:text-2xl font-bold text-gray-900">
              {{ current.name }} {{ current.lastname }}
            </h2>
            <p class="text-gray-600 text-sm lg:text-base mt-1">{{ current.email }}</p>
            <div class="mt-3 flex flex-wrap justify-center lg:justify-start gap-2">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 transition-all duration-200 ease-in-out"
              >
                {{ current.role }}
              </span>
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ease-in-out',
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

      <!-- Grille d'informations -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <!-- Informations personnelles -->
        <div class="bg-white rounded-lg shadow border border-gray-200 p-4 lg:p-6">
          <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
            Informations personnelles
          </h3>
          <dl class="space-y-2 lg:space-y-3">
            <div>
              <dt class="text-xs lg:text-sm font-medium text-gray-500">ID Utilisateur</dt>
              <dd class="text-xs lg:text-sm text-gray-900 break-all">
                {{ current.id_user }}
              </dd>
            </div>
            <div>
              <dt class="text-xs lg:text-sm font-medium text-gray-500">Nom complet</dt>
              <dd class="text-xs lg:text-sm text-gray-900">
                {{ current.lastname }} {{ current.name }}
              </dd>
            </div>
            <div>
              <dt class="text-xs lg:text-sm font-medium text-gray-500">Email</dt>
              <dd class="text-xs lg:text-sm text-gray-900 break-all">
                {{ current.email }}
              </dd>
            </div>

            <!-- Afficher info supplémentaires selon le rôle -->
            <template v-if="current.role === 'student'">
              <div>
                <dt class="text-xs lg:text-sm font-medium text-gray-500">Classe</dt>
                <dd class="text-xs lg:text-sm text-gray-900">
                  {{ current.class_name || "Non assigné" }}
                </dd>
              </div>
              <div>
                <dt class="text-xs lg:text-sm font-medium text-gray-500">Filière</dt>
                <dd class="text-xs lg:text-sm text-gray-900">
                  {{ current.filiere_name || "Non assigné" }}
                </dd>
              </div>
              <div>
                <dt class="text-xs lg:text-sm font-medium text-gray-500">Parcours</dt>
                <dd class="text-xs lg:text-sm text-gray-900">
                  {{ current.parcours_name || "Non assigné" }}
                </dd>
              </div>
              <div>
                <dt class="text-xs lg:text-sm font-medium text-gray-500">Année</dt>
                <dd class="text-xs lg:text-sm text-gray-900">
                  {{ current.year_value || "Non assigné" }}
                </dd>
              </div>
            </template>

            <template v-else-if="current.role === 'teacher'">
              <div>
                <dt class="text-xs lg:text-sm font-medium text-gray-500">Matricule</dt>
                <dd class="text-xs lg:text-sm text-gray-900">
                  {{ current.matricule || "Non assigné" }}
                </dd>
              </div>
            </template>
          </dl>
        </div>

        <!-- Statut du compte -->
        <div class="bg-white rounded-lg shadow border border-gray-200 p-4 lg:p-6">
          <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
            Statut du compte
          </h3>
          <dl class="space-y-2 lg:space-y-3">
            <div>
              <dt class="text-xs lg:text-sm font-medium text-gray-500">Rôle</dt>
              <dd class="text-xs lg:text-sm text-gray-900">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 transition-all duration-200 ease-in-out"
                >
                  {{ current.role }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-xs lg:text-sm font-medium text-gray-500">Statut</dt>
              <dd class="text-xs lg:text-sm text-gray-900">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ease-in-out',
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
              <dt class="text-xs lg:text-sm font-medium text-gray-500">Membre depuis</dt>
              <dd class="text-xs lg:text-sm text-gray-900">
                {{ new Date(current.created_at).toLocaleDateString("fr-FR") }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Actions -->
      <div
        class="mt-6 lg:mt-8 bg-white rounded-lg shadow border border-gray-200 p-4 lg:p-6"
      >
        <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
          Actions
        </h3>
        <div class="flex flex-col sm:flex-row gap-3 lg:gap-4">
          <button
            class="flex-1 bg-blue-600 text-white py-2 lg:py-3 px-4 lg:px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 ease-in-out hover:scale-105 text-sm lg:text-base"
            @click="openModal('updateProfil')"
          >
            Modifier le profil
          </button>
          <button
            class="flex-1 border border-gray-300 text-gray-700 py-2 lg:py-3 px-4 lg:px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 ease-in-out hover:scale-105 text-sm lg:text-base"
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

<style scoped>
/* Transitions globales améliorées */
* {
  transition-property: color, background-color, border-color, transform, box-shadow,
    opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animation de spin pour le loader */
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

/* Amélioration des transitions hover */
button {
  transition: all 0.2s ease-in-out;
}

/* Responsive utilities supplémentaires */
@media (max-width: 640px) {
  .text-balance {
    text-wrap: balance;
  }
}
</style>
