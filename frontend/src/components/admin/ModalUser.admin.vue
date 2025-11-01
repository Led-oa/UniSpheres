<script setup>
import { computed } from "vue";
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from "@headlessui/vue";

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

// Formater la date de création
const formattedDate = computed(() => {
  if (!props.user.created_at) return "—";
  return new Date(props.user.created_at).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Obtenir la couleur du badge selon le rôle
const getRoleColor = (role) => {
  const colors = {
    admin: "bg-purple-100 text-purple-800 border-purple-200",
    teacher: "bg-blue-100 text-blue-800 border-blue-200",
    student: "bg-green-100 text-green-800 border-green-200",
    parent: "bg-orange-100 text-orange-800 border-orange-200",
  };
  return colors[role] || "bg-gray-100 text-gray-800 border-gray-200";
};

// Obtenir la couleur du statut
const getStatusColor = (isActive) => {
  return isActive
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-red-100 text-red-800 border-red-200";
};

// Obtenir l'initiale pour l'avatar
const getInitials = (name, lastname) => {
  return `${name?.charAt(0) || ""}${lastname?.charAt(0) || ""}`.toUpperCase();
};
</script>

<template>
  <Dialog :open="show" @close="emit('close')" class="relative z-50">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

    <!-- Modal container -->
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel
        class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl"
        >
          <div class="flex items-center space-x-3">
            <div
              class="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"
            ></div>
            <div>
              <DialogTitle class="text-xl font-bold text-gray-900">
                Profil Utilisateur
              </DialogTitle>
              <DialogDescription class="text-sm text-gray-600 mt-1">
                Informations détaillées de l'utilisateur
              </DialogDescription>
            </div>
          </div>
          <button
            @click="emit('close')"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <!-- En-tête du profil -->
          <div class="flex items-start space-x-4 mb-6 p-4 bg-gray-50 rounded-xl">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div
                v-if="user.profile_pic"
                class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden border-2 border-white shadow-lg"
              >
                <img
                  :src="user.profile_pic"
                  :alt="`${user.name} ${user.lastname}`"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg border-2 border-white shadow-lg"
              >
                {{ getInitials(user.name, user.lastname) }}
              </div>
            </div>

            <!-- Informations principales -->
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-bold text-gray-900 truncate">
                {{ user.name }} {{ user.lastname }}
              </h3>
              <p class="text-gray-600 text-sm truncate">{{ user.email }}</p>

              <!-- Badges -->
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                  :class="[
                    'px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    getRoleColor(user.role),
                  ]"
                >
                  {{ user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "—" }}
                </span>
                <span
                  :class="[
                    'px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    getStatusColor(user.is_active),
                  ]"
                >
                  {{ user.is_active ? "Actif" : "Inactif" }}
                </span>
              </div>
            </div>
          </div>

          <!-- Grille d'informations -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Informations personnelles -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-gray-500"
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
                Informations personnelles
              </h4>

              <div class="space-y-3">
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm font-medium text-gray-600">ID Utilisateur</span>
                  <span
                    class="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded"
                  >
                    {{ user.id_user || "—" }}
                  </span>
                </div>

                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm font-medium text-gray-600">Nom complet</span>
                  <span class="text-sm text-gray-900 text-right">
                    {{ user.lastname || "—" }} {{ user.name || "—" }}
                  </span>
                </div>

                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm font-medium text-gray-600">Email</span>
                  <span class="text-sm text-gray-900">{{ user.email || "—" }}</span>
                </div>

                <!-- Informations étudiant -->
                <template v-if="user.role === 'student'">
                  <div
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-sm font-medium text-gray-600">Classe</span>
                    <span class="text-sm text-gray-900">{{
                      user.class_name || "—"
                    }}</span>
                  </div>

                  <div
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-sm font-medium text-gray-600">Filière</span>
                    <span class="text-sm text-gray-900">{{
                      user.filiere_name || "—"
                    }}</span>
                  </div>

                  <div
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-sm font-medium text-gray-600">Parcours</span>
                    <span class="text-sm text-gray-900">{{
                      user.parcours_name || "—"
                    }}</span>
                  </div>

                  <div
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-sm font-medium text-gray-600">Année</span>
                    <span class="text-sm text-gray-900">{{
                      user.year_value || "—"
                    }}</span>
                  </div>
                </template>

                <!-- Informations enseignant -->
                <template v-else-if="user.role === 'teacher'">
                  <div
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-sm font-medium text-gray-600">Matricule</span>
                    <span
                      class="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded"
                    >
                      {{ user.matricule || "—" }}
                    </span>
                  </div>
                </template>
              </div>
            </div>

            <!-- Statut du compte -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Statut du compte
              </h4>

              <div class="space-y-3">
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm font-medium text-gray-600">Rôle</span>
                  <span
                    :class="[
                      'px-2.5 py-0.5 rounded-full text-xs font-medium border',
                      getRoleColor(user.role),
                    ]"
                  >
                    {{ user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "—" }}
                  </span>
                </div>

                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm font-medium text-gray-600">Statut</span>
                  <span
                    :class="[
                      'px-2.5 py-0.5 rounded-full text-xs font-medium border',
                      getStatusColor(user.is_active),
                    ]"
                  >
                    {{ user.is_active ? "Actif" : "Inactif" }}
                  </span>
                </div>

                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-sm font-medium text-gray-600">Membre depuis</span>
                  <span class="text-sm text-gray-900">{{ formattedDate }}</span>
                </div>

                <!-- Informations supplémentaires selon le rôle -->
                <template v-if="user.role === 'student'">
                  <div
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-sm font-medium text-gray-600">Niveau</span>
                    <span class="text-sm text-gray-900">{{
                      user.year_value || "—"
                    }}</span>
                  </div>
                </template>

                <template v-else-if="user.role === 'teacher'">
                  <div
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-sm font-medium text-gray-600">Spécialité</span>
                    <span class="text-sm text-gray-900">{{
                      user.specialite || "—"
                    }}</span>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- Section informations supplémentaires -->
          <div v-if="user.bio || user.phone" class="mt-6 space-y-4">
            <h4 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg
                class="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Informations supplémentaires
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-if="user.phone"
                class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <svg
                  class="w-4 h-4 text-gray-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div>
                  <p class="text-xs text-gray-500">Téléphone</p>
                  <p class="text-sm font-medium text-gray-900">{{ user.phone }}</p>
                </div>
              </div>

              <div v-if="user.bio" class="md:col-span-2 p-3 bg-gray-50 rounded-lg">
                <p class="text-xs text-gray-500 mb-1">Bio</p>
                <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ user.bio }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="flex justify-end p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl"
        >
          <button
            @click="emit('close')"
            class="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Fermer
          </button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<style scoped>
/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
