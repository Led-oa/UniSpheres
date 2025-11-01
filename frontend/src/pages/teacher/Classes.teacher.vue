<script setup>
import { ref, computed, onMounted } from "vue";
import { useClasseStore } from "../../stores/academique/classe.store";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

const classeStore = useClasseStore();
const searchQuery = ref("");
const isLoading = ref(false);

// États des modaux
const isDispoModalOpen = ref(false);
const isEmploiModalOpen = ref(false);
const selectedClass = ref(null);

// Charger les classes de l'enseignant
const loadClasses = async () => {
  isLoading.value = true;
  try {
    await classeStore.fetchClasseTeacher();
  } catch (err) {
    console.error("Erreur lors de la récupération des classes:", err);
  } finally {
    isLoading.value = false;
  }
};

// Ouvrir le modal de disponibilité
const openDispoModal = () => {
  isDispoModalOpen.value = true;
};

// Ouvrir le modal d'emploi du temps
const openEmploiModal = (classe) => {
  selectedClass.value = classe;
  isEmploiModalOpen.value = true;
};

// Fermer les modaux
const closeDispoModal = () => {
  isDispoModalOpen.value = false;
};

const closeEmploiModal = () => {
  isEmploiModalOpen.value = false;
  selectedClass.value = null;
};

onMounted(loadClasses);

// Liste filtrée selon la recherche
const filteredClasses = computed(() => {
  if (!searchQuery.value) return classeStore.classes || [];
  return (classeStore.classes || []).filter((cl) =>
    cl.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <section class="space-y-6">
    <!-- Header -->
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 transition-colors duration-200">
          Mes Classes
        </h1>
        <p class="text-gray-500 text-sm mt-1 transition-colors duration-200">
          Liste des classes où vous enseignez au moins un cours.
        </p>
      </div>
      <button
        class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:opacity-90 transition-all duration-200 ease-in-out cursor-pointer font-medium"
        @click="openDispoModal"
      >
        Mettre disponibilité
      </button>
    </header>

    <!-- Barre de recherche -->
    <div class="mb-4 transition-all duration-200">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher une classe..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ease-in-out"
      />
    </div>

    <!-- Liste des classes -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
      <!-- Skeleton Loader -->
      <template v-if="isLoading">
        <div
          v-for="n in 6"
          :key="n"
          class="p-6 bg-white rounded-xl shadow border border-gray-100 animate-pulse transition-colors duration-200"
        >
          <div
            class="h-6 bg-gray-200 rounded w-3/4 mb-4 transition-colors duration-200"
          ></div>
          <div
            class="h-4 bg-gray-200 rounded w-1/2 mb-2 transition-colors duration-200"
          ></div>
          <div
            class="h-4 bg-gray-200 rounded w-2/3 mb-2 transition-colors duration-200"
          ></div>
          <div
            class="h-4 bg-gray-200 rounded w-1/3 mt-4 transition-colors duration-200"
          ></div>
        </div>
      </template>

      <!-- Classes réelles -->
      <article
        v-else
        v-for="cl in filteredClasses"
        :key="cl.id_class"
        class="group p-6 bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 transition-all duration-300 ease-in-out hover:scale-105"
      >
        <div
          class="flex items-center justify-between mb-2 transition-colors duration-200"
        >
          <h2
            class="text-lg font-semibold text-purple-700 group-hover:text-purple-800 transition-colors duration-200"
          >
            {{ cl.name }}
          </h2>
          <span class="text-sm text-gray-500 transition-colors duration-200">
            {{ cl.year_value }} - {{ cl.filiere_name }}
          </span>
        </div>

        <p class="text-gray-600 text-sm flex-1 transition-colors duration-200">
          Parcours : {{ cl.parcours_name }}
        </p>

        <div class="mt-4 space-x-2 transition-all duration-200">
          <router-link
            :to="{ name: 'NotesClasseEnseignant', params: { idClasse: cl.id_class } }"
            class="inline-block text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline p-2 transition-all duration-200 ease-in-out"
          >
            Notes
          </router-link>
          <router-link
            :to="{ name: 'ListeEtudiantEnseignant', params: { idClasse: cl.id_class } }"
            class="inline-block text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline p-2 transition-all duration-200 ease-in-out"
          >
            Étudiants
          </router-link>
          <button
            class="inline-block text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline p-2 cursor-pointer transition-all duration-200 ease-in-out"
            @click="openEmploiModal(cl)"
          >
            Emploi du temps
          </button>
        </div>
      </article>
    </div>

    <!-- Message si aucune classe -->
    <div
      v-if="!isLoading && filteredClasses.length === 0"
      class="text-center py-12 text-gray-500 transition-colors duration-200"
    >
      <svg
        class="w-12 h-12 text-gray-400 mx-auto mb-4 transition-colors duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"
        />
      </svg>
      Aucune classe trouvée.
    </div>

    <!-- Modal de disponibilité -->
    <TransitionRoot as="template" :show="isDispoModalOpen">
      <Dialog as="div" class="relative z-10" @close="closeDispoModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              >
                <div class="flex items-center justify-between mb-4">
                  <DialogTitle
                    as="h3"
                    class="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Gérer les disponibilités
                  </DialogTitle>
                  <button
                    @click="closeDispoModal"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div class="space-y-4">
                  <p class="text-sm text-gray-600 transition-colors duration-200">
                    Configurez vos disponibilités pour les différentes périodes de cours.
                  </p>

                  <!-- Contenu du formulaire de disponibilité -->
                  <div
                    class="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-colors duration-200"
                  >
                    <h4
                      class="font-medium text-gray-900 mb-3 transition-colors duration-200"
                    >
                      Périodes disponibles
                    </h4>
                    <div class="space-y-3">
                      <div
                        v-for="day in [
                          'Lundi',
                          'Mardi',
                          'Mercredi',
                          'Jeudi',
                          'Vendredi',
                          'Samedi',
                        ]"
                        :key="day"
                        class="flex items-center justify-between p-2 bg-white rounded border border-gray-200 transition-colors duration-200 hover:bg-gray-50"
                      >
                        <span
                          class="text-sm font-medium text-gray-700 transition-colors duration-200"
                          >{{ day }}</span
                        >
                        <div class="flex space-x-2">
                          <label class="inline-flex items-center">
                            <input
                              type="checkbox"
                              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors duration-200"
                            />
                            <span
                              class="ml-2 text-sm text-gray-600 transition-colors duration-200"
                              >Matin</span
                            >
                          </label>
                          <label class="inline-flex items-center">
                            <input
                              type="checkbox"
                              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors duration-200"
                            />
                            <span
                              class="ml-2 text-sm text-gray-600 transition-colors duration-200"
                              >Après-midi</span
                            >
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 transition-colors duration-200"
                  >
                    <div class="flex">
                      <svg
                        class="h-5 w-5 text-yellow-400 transition-colors duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <div class="ml-3">
                        <h3
                          class="text-sm font-medium text-yellow-800 transition-colors duration-200"
                        >
                          Information
                        </h3>
                        <div
                          class="mt-1 text-sm text-yellow-700 transition-colors duration-200"
                        >
                          <p>
                            Vos disponibilités seront utilisées pour la génération
                            automatique des emplois du temps.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    @click="closeDispoModal"
                    class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 ease-in-out"
                  >
                    Annuler
                  </button>
                  <button
                    class="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all duration-200 ease-in-out"
                  >
                    Enregistrer
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal d'emploi du temps -->
    <TransitionRoot as="template" :show="isEmploiModalOpen">
      <Dialog as="div" class="relative z-10" @close="closeEmploiModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6"
              >
                <div class="flex items-center justify-between mb-4">
                  <DialogTitle
                    as="h3"
                    class="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Emploi du temps - {{ selectedClass?.name }}
                  </DialogTitle>
                  <button
                    @click="closeEmploiModal"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div class="space-y-4">
                  <p class="text-sm text-gray-600 transition-colors duration-200">
                    Emploi du temps pour la classe {{ selectedClass?.name }} -
                    {{ selectedClass?.filiere_name }}
                  </p>

                  <!-- Contenu de l'emploi du temps -->
                  <div
                    class="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-colors duration-200"
                  >
                    <div class="overflow-x-auto">
                      <table
                        class="min-w-full bg-white rounded-lg overflow-hidden transition-colors duration-200"
                      >
                        <thead>
                          <tr class="bg-gray-100 transition-colors duration-200">
                            <th
                              class="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b transition-colors duration-200"
                            >
                              Créneau
                            </th>
                            <th
                              v-for="day in [
                                'Lundi',
                                'Mardi',
                                'Mercredi',
                                'Jeudi',
                                'Vendredi',
                                'Samedi',
                              ]"
                              :key="day"
                              class="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b transition-colors duration-200"
                            >
                              {{ day }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="period in ['8h-10h', '10h-12h', '14h-16h', '16h-18h']"
                            :key="period"
                            class="transition-colors duration-200 hover:bg-gray-50"
                          >
                            <td
                              class="px-4 py-3 text-sm font-medium text-gray-900 border-b transition-colors duration-200"
                            >
                              {{ period }}
                            </td>
                            <td
                              v-for="day in 6"
                              :key="day"
                              class="px-4 py-3 text-center border-b transition-colors duration-200"
                            >
                              <div
                                class="text-xs text-gray-500 italic transition-colors duration-200"
                              >
                                -
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div
                    class="flex items-center justify-between text-sm text-gray-600 transition-colors duration-200"
                  >
                    <span>Dernière mise à jour: --/--/----</span>
                    <button
                      class="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    >
                      Exporter PDF
                    </button>
                  </div>
                </div>

                <div class="mt-6 flex justify-end">
                  <button
                    @click="closeEmploiModal"
                    class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 ease-in-out"
                  >
                    Fermer
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </section>
</template>
