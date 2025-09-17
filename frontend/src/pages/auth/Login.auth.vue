<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth.store";

const router = useRouter();
const authStore = useAuthStore();

const loginData = ref({ email: "", password: "" });

const showPassword = ref(false);
const hasError = ref(false);

// Effacer l'erreur quand l'utilisateur commence à taper
const clearError = () => {
  if (authStore.error) {
    authStore.error = null;
  }
  hasError.value = false;
};

// Validation du formulaire
const isFormValid = computed(() => {
  return loginData.value.email && loginData.value.password;
});

const handleLogin = async () => {
  if (!isFormValid.value) return;

  try {
    const result = await authStore.login(loginData);

    console.log("Result after login : ", result);

    // Succès! Le store a tout géré (token, user dans le state et localStorage)

    if (result && result.user) {
      // Redirection basée sur le rôle
      const rolePath = result.user.role.toLowerCase() || authStore.user?.role;

      console.log("Role Path : ", rolePath);

      if (rolePath) {
        const redirectPath = router.currentRoute.value.query.redirect || `/${rolePath}`;

        hasError.value = false;
        setTimeout(() => {
          router.push(redirectPath);
        }, 500);
      }
    }
  } catch (error) {
    // L'erreur est déjà stockée dans `authStore.error`, le template l'affichera.
    console.error("Login failed", error);
    hasError.value = true;
  }
};

// Mot de passe oublié
const handleForgotPassword = () => {
  // TODO: Implémenter la logique de réinitialisation
  console.log("Mot de passe oublié cliqué");
};

// Reset error quand le composant est monté
watch(
  () => authStore.error,
  (newError) => {
    if (newError) {
      hasError.value = true;
    }
  }
);

// Nettoyer les erreurs au démontage
import { onUnmounted } from "vue";
onUnmounted(() => {
  authStore.error = null;
});
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex">
      <!-- Formulaire -->
      <div class="w-full md:w-1/2 p-8 md:p-12 lg:p-16">
        <div class="text-center mb-8">
          <div class="flex items-center justify-center gap-3 mb-6">
            <span class="text-4xl">🎓</span>
            <span
              class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >UniSphere</span
            >
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Connexion</h1>
          <p class="text-gray-600">Accédez à votre espace universitaire</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Message d'erreur -->
          <div
            v-if="authStore.error"
            class="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-3 animate-shake"
          >
            <span class="text-xl">⚠️</span>
            <span>{{ authStore.error }}</span>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Adresse Email</label
            >
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >📧</span
              >
              <input
                type="email"
                v-model="loginData.email"
                :disabled="authStore.loading"
                required
                placeholder="votre@email.com"
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                @input="clearError"
              />
            </div>
          </div>

          <!-- Mot de passe -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Mot de passe</label
            >
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >🔒</span
              >
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="loginData.password"
                :disabled="authStore.loading"
                required
                placeholder="Votre mot de passe"
                class="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                @input="clearError"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                :disabled="authStore.loading"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {{ showPassword ? "🙈" : "👁️" }}
              </button>
            </div>
          </div>

          <!-- Mot de passe oublié -->
          <div class="text-right">
            <button
              type="button"
              @click="handleForgotPassword"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <!-- Bouton de connexion -->
          <button
            type="submit"
            :disabled="authStore.loading || !isFormValid"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <span v-if="!authStore.loading">Se connecter</span>
            <span v-else class="flex items-center gap-2">
              <div
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              Connexion...
            </span>
          </button>

          <!-- Séparateur -->
          <div class="relative flex items-center">
            <div class="flex-grow border-t border-gray-300"></div>
            <span class="flex-shrink mx-4 text-gray-400 text-sm">ou</span>
            <div class="flex-grow border-t border-gray-300"></div>
          </div>

          <!-- Lien d'inscription -->
          <div class="text-center">
            <p class="text-gray-600 mb-2">Pas encore de compte ?</p>
            <router-link
              :to="{ name: 'Inscription' }"
              class="inline-block border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              Créer un compte
            </router-link>
          </div>
        </form>

        <div class="mt-8 text-center text-gray-400 text-sm">
          <p>© 2025 UniSphere. Tous droits réservés.</p>
        </div>
      </div>

      <!-- Illustration -->
      <div
        class="hidden md:block w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-12 relative overflow-hidden"
      >
        <div class="relative z-10 flex flex-col justify-center h-full text-center">
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
              💻
            </div>
          </div>

          <h2 class="text-3xl font-bold mb-4">Bienvenue sur UniSphere</h2>
          <p class="text-lg opacity-90">
            Votre plateforme universitaire complète pour apprendre, collaborer et réussir
          </p>
        </div>

        <div class="absolute inset-0 bg-white opacity-5"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  75% {
    transform: translateX(5px);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>
