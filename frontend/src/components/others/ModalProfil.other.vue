<script setup>
import { ref, watch } from "vue";
import { useUserStore } from "../../stores/user.store";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  mode: {
    type: String,
    required: true, // 'updatePhoto', 'updateProfil', 'updatePassword'
  },
  userId: {
    type: Number,
    required: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "updated"]);

const userStore = useUserStore();

const loading = ref(false);
const error = ref(null);

// ------------------ Photo ------------------
const selectedFile = ref(null);
const previewUrl = ref(null);

function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
}

async function updatePhoto() {
  if (!selectedFile.value) return;
  loading.value = true;
  error.value = null;
  try {
    const formData = new FormData();
    formData.append("profile_pic", selectedFile.value);

    await userStore.updateCurrentUser(props.userId, formData);
    emit("updated");
    emit("close");
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
}

// ------------------ Profil ------------------
const form = ref({ name: "", lastname: "", email: "" });

watch(
  () => props.userId,
  async (id) => {
    if (id) {
      await userStore.fetchUser(id);
      form.value.name = userStore.currentUser.name;
      form.value.lastname = userStore.currentUser.lastname;
      form.value.email = userStore.currentUser.email;
    }
  },
  { immediate: true }
);

async function updateProfil() {
  loading.value = true;
  error.value = null;
  try {
    await userStore.updateCurrentUser(props.userId, form.value);
    emit("updated");
    emit("close");
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
}

// ------------------ Password ------------------
const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
});

async function updatePassword() {
  loading.value = true;
  error.value = null;
  try {
    await userStore.updateCurrentUser(props.userId, passwordForm.value);
    emit("updated");
    emit("close");
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
}

// Reset form when modal closes
watch(
  () => props.show,
  (show) => {
    if (!show) {
      selectedFile.value = null;
      previewUrl.value = null;
      error.value = null;
      passwordForm.value = {
        oldPassword: "",
        newPassword: "",
      };
    }
  }
);
</script>

<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/75 transition-opacity" />
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
              class="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 w-full max-w-md sm:p-6 mx-4"
            >
              <!-- Header -->
              <div class="flex items-center justify-between mb-4 sm:mb-6">
                <DialogTitle as="h3" class="text-lg sm:text-xl font-bold text-gray-900">
                  <span v-if="mode === 'updatePhoto'">Changer la photo de profil</span>
                  <span v-else-if="mode === 'updateProfil'"
                    >Modifier les informations</span
                  >
                  <span v-else-if="mode === 'updatePassword'"
                    >Changer le mot de passe</span
                  >
                </DialogTitle>
                <button
                  @click="$emit('close')"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-600 transition-all duration-200 ease-in-out hover:scale-110"
                >
                  <XMarkIcon class="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <!-- Update Photo -->
              <div v-if="mode === 'updatePhoto'" class="space-y-4 sm:space-y-6">
                <div class="text-center">
                  <input
                    type="file"
                    @change="handleFileChange"
                    accept="image/*"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 ease-in-out"
                  />
                </div>

                <div v-if="previewUrl" class="flex justify-center">
                  <img
                    :src="previewUrl"
                    alt="Preview"
                    class="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-white shadow-lg transition-all duration-300 ease-in-out"
                  />
                </div>

                <div class="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    @click="$emit('close')"
                    class="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 ease-in-out hover:scale-105 text-sm sm:text-base"
                    :disabled="loading"
                  >
                    Annuler
                  </button>
                  <button
                    @click="updatePhoto"
                    class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 ease-in-out hover:scale-105 text-sm sm:text-base"
                    :disabled="loading || !selectedFile"
                  >
                    <span v-if="loading">Chargement...</span>
                    <span v-else>Enregistrer</span>
                  </button>
                </div>

                <p
                  v-if="error"
                  class="text-red-600 text-sm text-center mt-2 transition-all duration-200 ease-in-out"
                >
                  {{ error.message || error }}
                </p>
              </div>

              <!-- Update Profil -->
              <div v-else-if="mode === 'updateProfil'">
                <form @submit.prevent="updateProfil" class="space-y-4 sm:space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Nom</label
                    >
                    <input
                      v-model="form.lastname"
                      type="text"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Prénom</label
                    >
                    <input
                      v-model="form.name"
                      type="text"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                      placeholder="Votre prénom"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Email</label
                    >
                    <input
                      v-model="form.email"
                      type="email"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div class="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      @click="$emit('close')"
                      class="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 ease-in-out hover:scale-105 text-sm sm:text-base"
                      :disabled="loading"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 ease-in-out hover:scale-105 text-sm sm:text-base"
                      :disabled="loading"
                    >
                      <span v-if="loading">Chargement...</span>
                      <span v-else>Enregistrer</span>
                    </button>
                  </div>

                  <p
                    v-if="error"
                    class="text-red-600 text-sm text-center mt-2 transition-all duration-200 ease-in-out"
                  >
                    {{ error.message || error }}
                  </p>
                </form>
              </div>

              <!-- Update Password -->
              <div v-else-if="mode === 'updatePassword'">
                <form @submit.prevent="updatePassword" class="space-y-4 sm:space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Ancien mot de passe
                    </label>
                    <input
                      v-model="passwordForm.oldPassword"
                      type="password"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      v-model="passwordForm.newPassword"
                      type="password"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                      placeholder="••••••••"
                    />
                  </div>

                  <div class="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      @click="$emit('close')"
                      class="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 ease-in-out hover:scale-105 text-sm sm:text-base"
                      :disabled="loading"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 ease-in-out hover:scale-105 text-sm sm:text-base"
                      :disabled="loading"
                    >
                      <span v-if="loading">Chargement...</span>
                      <span v-else>Enregistrer</span>
                    </button>
                  </div>

                  <p
                    v-if="error"
                    class="text-red-600 text-sm text-center mt-2 transition-all duration-200 ease-in-out"
                  >
                    {{ error.message || error }}
                  </p>
                </form>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
/* Transitions globales améliorées */
* {
  transition-property: color, background-color, border-color, transform, box-shadow,
    opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animation de focus pour les inputs */
input:focus {
  transition: all 0.2s ease-in-out;
}

/* Style personnalisé pour le file input */
input[type="file"]::-webkit-file-upload-button {
  transition: all 0.2s ease-in-out;
}

input[type="file"]::-webkit-file-upload-button:hover {
  transform: scale(1.05);
}
</style>
