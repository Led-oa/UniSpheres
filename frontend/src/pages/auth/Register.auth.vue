<!-- Fichier: /src/pages/auth/Register.vue -->
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
// import { useUserStore } from "../../store/user.store";
// import { useClasseStore } from "../../store/classes.store";

import { useAuthStore } from "../../stores/auth.store";

const router = useRouter();
// const authStore = useUserStore();
// const classeStore = useClasseStore();
const authStore = useAuthStore();

const fileInput = ref(null);

// Données mock pour les classes (à remplacer par un appel API réel)
const classes = ref([]);
const isLoadingClasses = ref(false);

// Charger les classes au montage
onMounted(async () => {
  authStore.error = null;
  await loadClasses();
});

// Fonction pour charger les classes
const loadClasses = async () => {
  isLoadingClasses.value = true;
  try {
    await classeStore.fetchClassesForRegister({ join: true });
    classes.value = classeStore.classes.map((classe) => ({
      id: classe.id_class,
      nom: `${classe.class_name} - ${classe.filiere_name}`,
      fullData: classe, // Garder les données complètes si besoin
    }));
  } catch (error) {
    console.error("Erreur chargement classes:", error);
    // Fallback sur des données mock si l'API échoue
    classes.value = [
      { id: 1, nom: "L1 Informatique" },
      { id: 2, nom: "L2 Informatique" },
      { id: 3, nom: "L3 Informatique" },
      { id: 4, nom: "M1 Informatique" },
      { id: 5, nom: "M2 Informatique" },
    ];
  } finally {
    isLoadingClasses.value = false;
  }
};

const registrationData = ref({
  name: "",
  lastname: "",
  email: "",
  matricule: "",
  password: "",
  role: "",
  class_id: "",
  profile_pic: null,
});

const passwordConfirm = ref("");
const registrationSuccess = ref(false);
const selectedFile = ref(null);
const filePreviewUrl = ref("");
const hasFileError = ref(false);

const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Types MIME autorisés (doivent correspondre au backend)
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
];

const isLoading = computed(() => authStore.loading);

const passwordsMatch = computed(() => {
  return (
    registrationData.value.password &&
    registrationData.value.password === passwordConfirm.value
  );
});

const isImageFile = computed(() => {
  //   return selectedFile.value && selectedFile.value.type.startsWith("image/");
  selectedFile.value && selectedFile.value.type.startsWith("image/");
});

const isFormValid = computed(() => {
  const baseValid =
    registrationData.value.name &&
    registrationData.value.lastname &&
    registrationData.value.email &&
    registrationData.value.password &&
    registrationData.value.role &&
    passwordsMatch.value;

  if (registrationData.value.role === "student") {
    return (
      baseValid && registrationData.value.matricule && registrationData.value.class_id
    );
  }

  return baseValid;
});

// Force de mot de passe
const passwordStrength = computed(() => {
  const password = registrationData.value.password;
  if (!password) return 0;

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return strength;
});

const passwordStrengthClass = computed(() => {
  return `strength-${passwordStrength.value}`;
});

const passwordStrengthText = computed(() => {
  const strengths = ["Faible", "Moyen", "Fort", "Très fort"];
  return registrationData.value.password ? strengths[passwordStrength.value] || "" : "";
});

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + "" + sizes[i];
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  hasFileError.value = false;
  authStore.error = null;

  if (!file) {
    selectedFile.value = null;
    filePreviewUrl.value = "";
    registrationData.value.profile_pic = null;
    return;
  }
  // Validation du type de fichier
  if (!allowedMimeTypes.includes(file.type)) {
    hasFileError.value = true;
    authStore.error =
      "Type de fichier non supporté. Types autorisés: JPG, PNG, GIF, WEBP, HEIC";
    resetFileInput();
    return;
  }
  // Validation de la taille (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    hasFileError.value = true;
    authStore.error = "La taille du fichier ne doit pas dépasser 5MB";
    resetFileInput();
    return;
  }

  selectedFile.value = file;
  registrationData.value.profile_pic = file;

  // Créer un aperçu pour les images
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      filePreviewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Supprimer le fichier sélectionné
const removeFile = () => {
  selectedFile.value = null;
  filePreviewUrl.value = "";
  registrationData.value.profile_pic = null;
  resetFileInput();
  hasFileError.value = false;
  authStore.error = null;
};

// Réinitialiser l'input file
const resetFileInput = () => {
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Gestion du changement de rôle
const onRoleChange = () => {
  // Réinitialiser les champs conditionnels quand le rôle change
  if (registrationData.value.role !== "student") {
    registrationData.value.matricule = "";
    registrationData.value.class_id = "";
  }
};

const clearError = () => {
  if (authStore.error) {
    authStore.error = null;
  }
  hasFileError.value = false;
};

// Préparer FormData pour l'envoi
const prepareFormData = () => {
  const formData = new FormData();

  // Ajouter tous les champs texte
  Object.keys(registrationData.value).forEach((key) => {
    if (
      key !== "profile_pic" &&
      registrationData.value[key] !== null &&
      registrationData.value[key] !== undefined
    ) {
      formData.append(key, registrationData.value[key]);
    }
  });

  // Ajouter le fichier s'il existe
  if (registrationData.value.profile_pic instanceof File) {
    formData.append("profile_pic", registrationData.value.profile_pic);
  }

  return formData;
};

const handleRegister = async () => {
  if (!isFormValid.value) return;

  try {
    authStore.error = null;
    hasFileError.value = false;

    // Validation frontend
    if (!passwordsMatch.value) {
      console.log(passwordsMatch.value);
      authStore.error = "Les mots de passe ne correspondent pas";
      return;
    }

    if (
      registrationData.value.role === "student" &&
      (!registrationData.value.matricule || !registrationData.value.class_id)
    ) {
      authStore.error =
        "Les champs matricule et classe sont obligatoires pour les étudiants";
      return;
    }

    const formData = prepareFormData();

    console.log("FormData : ", formData);

    await authStore.register(formData);
    // Succès

    registrationSuccess.value = true;
    // Redirection après délai
    setTimeout(() => {
      router.push("/login?message=account_created");
    }, 200);

  } catch (error) {
    console.error("Registration failed", error);
  }
};

// Reset error au montage
onMounted(() => {
  authStore.error = null;
});

// Watch pour les erreurs
watch(
  () => authStore.error,
  (newError) => {
    if (newError) {
      hasFileError.value = true;
    }
  }
);
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex">
      <!-- Formulaire -->
      <div class="w-full md:w-1/2 p-8 md:p-12 lg:p-16 overflow-y-auto max-h-screen">
        <div class="text-center mb-8">
          <div class="flex items-center justify-center gap-3 mb-6">
            <span class="text-4xl">🎓</span>
            <span
              class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              UniSphere
            </span>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Créer un compte</h1>
          <p class="text-gray-600">Rejoignez notre communauté universitaire</p>
        </div>

        <form
          @submit.prevent="handleRegister"
          class="space-y-6"
          enctype="multipart/form-data"
        >
          <!-- Messages -->
          <div
            v-if="authStore.error"
            class="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-3"
          >
            <span class="text-xl">⚠️</span>
            <span>{{ authStore.error }}</span>
          </div>

          <div
            v-if="registrationSuccess"
            class="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg flex items-center gap-3"
          >
            <span class="text-xl">✅</span>
            <span>Compte créé avec succès ! Redirection...</span>
          </div>

          <!-- Informations personnelles -->
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  👤
                </span>
                <input
                  type="text"
                  v-model="registrationData.lastname"
                  :disabled="isLoading"
                  required
                  placeholder="Votre nom"
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  @input="clearError"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  👤
                </span>
                <input
                  type="text"
                  v-model="registrationData.name"
                  :disabled="isLoading"
                  required
                  placeholder="Votre prénom"
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  @input="clearError"
                />
              </div>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                📧
              </span>
              <input
                type="email"
                v-model="registrationData.email"
                :disabled="isLoading"
                required
                placeholder="votre@email.com"
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                @input="clearError"
              />
            </div>
          </div>

          <!-- Mot de passe -->
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe *
              </label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  🔒
                </span>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="registrationData.password"
                  :disabled="isLoading"
                  required
                  placeholder="Créez un mot de passe"
                  class="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  @input="clearError"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  :disabled="isLoading"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {{ showPassword ? "🙈" : "👁️" }}
                </button>
              </div>
              <div v-if="registrationData.password" class="mt-2">
                <div class="text-sm px-2 py-1 rounded-md" :class="passwordStrengthClass">
                  {{ passwordStrengthText }}
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Confirmation *
              </label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >🔒</span
                >
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="passwordConfirm"
                  :disabled="isLoading"
                  required
                  placeholder="Confirmez le mot de passe"
                  :class="[
                    'w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                    passwordConfirm && !passwordsMatch
                      ? 'border-red-300'
                      : 'border-gray-300',
                  ]"
                  @input="clearError"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  :disabled="isLoading"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {{ showConfirmPassword ? "🙈" : "👁️" }}
                </button>
              </div>
              <div
                v-if="passwordConfirm && !passwordsMatch"
                class="mt-2 text-red-600 text-sm"
              >
                Les mots de passe ne correspondent pas
              </div>
            </div>
          </div>

          <!-- Rôle -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rôle *</label>
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                🎭
              </span>
              <select
                v-model="registrationData.role"
                :disabled="isLoading"
                required
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
                @change="onRoleChange"
              >
                <option value="">Sélectionnez un rôle</option>
                <option value="student">Étudiant</option>
                <option value="teacher">Enseignant</option>
              </select>
            </div>
          </div>

          <!-- Matricule -->
          <div
            v-if="
              registrationData.role === 'student' || registrationData.role === 'teacher'
            "
          >
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Matricule *
            </label>
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                🏷️
              </span>
              <input
                type="text"
                v-model="registrationData.matricule"
                :disabled="isLoading"
                required
                placeholder="Votre matricule"
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                @input="clearError"
              />
            </div>
          </div>

          <!-- Classe -->
          <div v-if="registrationData.role === 'student'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Classe *</label>
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                🏫
              </span>

              <!-- Loading state -->
              <div v-if="isLoadingClasses" class="flex items-center justify-center py-3">
                <div
                  class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"
                ></div>
                <span class="ml-2 text-gray-500">Chargement des classes...</span>
              </div>

              <select
                v-else
                v-model="registrationData.class_id"
                :disabled="isLoading || isLoadingClasses"
                required
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
              >
                <option value="">Sélectionnez une classe</option>
                <option v-for="classe in classes" :key="classe.id" :value="classe.id">
                  {{ classe.nom }}
                </option>
              </select>
            </div>
            <!-- Message si aucune classe -->
            <div
              v-if="!isLoadingClasses && classes.length === 0"
              class="mt-2 text-yellow-600 text-sm bg-yellow-50 p-2 rounded"
            >
              ⚠️ Aucune classe disponible. Contactez l'administration.
            </div>
          </div>

          <!-- Photo de profil -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Photo de profil
            </label>
            <div class="space-y-2">
              <input
                type="file"
                ref="fileInput"
                @change="handleFileUpload"
                :disabled="isLoading"
                accept="image/jpeg, image/png, image/gif, image/webp, image/heic, image/heif"
                class="hidden"
              />
              <label
                @click="fileInput?.click()"
                class="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
              >
                <span class="text-xl">📷</span>
                <span class="text-gray-600">Choisir une photo</span>
              </label>

              <div
                v-if="selectedFile"
                class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <img
                  v-if="isImageFile"
                  :src="filePreviewUrl"
                  alt="Aperçu"
                  class="w-12 h-12 rounded object-cover"
                />
                <div v-else class="flex flex-col">
                  <span class="font-medium">{{ selectedFile.name }}</span>
                  <span class="text-sm text-gray-500"
                    >({{ formatFileSize(selectedFile.size) }})</span
                  >
                </div>
                <button
                  type="button"
                  @click="removeFile"
                  :disabled="isLoading"
                  class="ml-auto text-red-600 hover:text-red-800 transition-colors"
                >
                  ×
                </button>
              </div>

              <p class="text-sm text-gray-500">
                Types autorisés: JPG, PNG, GIF, WEBP, HEIC. Max 5MB
              </p>
            </div>
          </div>

          <!-- Bouton d'inscription -->
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <span v-if="!isLoading">Créer mon compte</span>
            <span v-else class="flex items-center gap-2">
              <div
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              Création...
            </span>
          </button>

          <!-- Séparateur -->
          <div class="relative flex items-center">
            <div class="flex-grow border-t border-gray-300"></div>
            <span class="flex-shrink mx-4 text-gray-400 text-sm">Déjà un compte ?</span>
            <div class="flex-grow border-t border-gray-300"></div>
          </div>

          <!-- Lien de connexion -->
          <router-link
            :to="{ name: 'Authentification' }"
            class="block text-center border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
          >
            Se connecter
          </router-link>
        </form>

        <div class="mt-8 text-center text-gray-400 text-sm">
          <p>© 2025 UniSphere. Tous droits réservés.</p>
        </div>
      </div>

      <!-- Illustration -->
      <div
        class="hidden md:block w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-12 relative overflow-hidden"
      >
        <div class="relative z-10 flex flex-col justify-center h-full">
          <div class="relative h-48 mb-8">
            <div
              class="absolute top-8 left-12 text-5xl animate-bounce"
              style="animation-delay: 0s"
            >
              📚
            </div>
            <div
              class="absolute top-4 right-16 text-5xl animate-bounce"
              style="animation-delay: 0.5s"
            >
              🎓
            </div>
            <div
              class="absolute bottom-12 left-20 text-5xl animate-bounce"
              style="animation-delay: 1s"
            >
              📝
            </div>
            <div
              class="absolute bottom-8 right-12 text-5xl animate-bounce"
              style="animation-delay: 1.5s"
            >
              👥
            </div>
          </div>

          <h2 class="text-3xl font-bold mb-4 text-center">Rejoignez Notre Communauté</h2>
          <p class="text-lg opacity-90 mb-8 text-center">
            Accédez à tous les outils dont vous avez besoin pour réussir votre parcours
            universitaire
          </p>

          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <span class="text-xl">✔️</span>
              <span>Cours et ressources</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xl">✔️</span>
              <span>Communication simplifiée</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xl">✔️</span>
              <span>Suivi académique</span>
            </div>
          </div>
        </div>

        <div class="absolute inset-0 bg-white opacity-5"></div>
      </div>
    </div>
  </div>
</template>
