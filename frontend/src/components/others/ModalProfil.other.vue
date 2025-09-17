<script setup>
import { ref, watch } from "vue";
import { useUserStore } from "../../stores/user.store";

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
const form = ref({ name: "", email: "" });

watch(
  () => props.userId,
  async (id) => {
    if (id) {
      await userStore.fetchUser(id);
      form.value.name = userStore.currentUser.name;
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
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <button class="float-right text-gray-500" @click="$emit('close')">✖</button>

      <!-- Update Photo -->
      <div v-if="mode === 'updatePhoto'">
        <h2 class="text-xl font-bold mb-4">Changer la photo de profil</h2>
        <input type="file" @change="handleFileChange" accept="image/*" class="mb-4" />
        <div v-if="previewUrl" class="mb-4">
          <img
            :src="previewUrl"
            alt="Preview"
            class="w-32 h-32 object-cover rounded-full mx-auto"
          />
        </div>
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded"
          @click="updatePhoto"
          :disabled="loading"
        >
          {{ loading ? "Chargement..." : "Enregistrer" }}
        </button>
        <p v-if="error" class="text-red-600 mt-2">{{ error.message || error }}</p>
      </div>

      <!-- Update Profil -->
      <div v-else-if="mode === 'updateProfil'">
        <h2 class="text-xl font-bold mb-4">Modifier les informations</h2>
        <form @submit.prevent="updateProfil">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Nom complet</label>
            <input v-model="form.name" type="text" class="border p-2 w-full rounded" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Email</label>
            <input v-model="form.email" type="email" class="border p-2 w-full rounded" />
          </div>
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded"
            :disabled="loading"
          >
            {{ loading ? "Chargement..." : "Enregistrer" }}
          </button>
          <p v-if="error" class="text-red-600 mt-2">{{ error.message || error }}</p>
        </form>
      </div>

      <!-- Update Password -->
      <div v-else-if="mode === 'updatePassword'">
        <h2 class="text-xl font-bold mb-4">Changer le mot de passe</h2>
        <form @submit.prevent="updatePassword">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Ancien mot de passe</label>
            <input
              v-model="passwordForm.oldPassword"
              type="password"
              class="border p-2 w-full rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Nouveau mot de passe</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="border p-2 w-full rounded"
            />
          </div>
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded"
            :disabled="loading"
          >
            {{ loading ? "Chargement..." : "Enregistrer" }}
          </button>
          <p v-if="error" class="text-red-600 mt-2">{{ error.message || error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>
