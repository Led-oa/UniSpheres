<template>
  <section class="relative overflow-hidden py-16 sm:py-24 lg:py-32">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div class="w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      </div>
      <div class="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2">
        <div class="w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <!-- Badge d'introduction -->
        <div
          class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8"
        >
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
              clip-rule="evenodd"
            />
          </svg>
          Plateforme éducative innovante
        </div>

        <!-- Titre principal -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          <span class="block text-gray-900">Bienvenue sur</span>
          <span
            class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-2"
          >
            UniSphere
          </span>
        </h1>

        <!-- Description -->
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          La plateforme qui révolutionne l'apprentissage en connectant étudiants,
          enseignants et administrateurs dans un environnement numérique moderne et
          collaboratif.
        </p>

        <!-- Statistiques -->
        <!-- <div class="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600">500+</div>
              <div class="text-gray-600 mt-1">Étudiants actifs</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600">50+</div>
              <div class="text-gray-600 mt-1">Enseignants experts</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-indigo-600">100+</div>
              <div class="text-gray-600 mt-1">Cours disponibles</div>
            </div>
          </div> -->

        <!-- Call to Action -->
        <div class="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <router-link
            to="/register"
            class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Commencer dès maintenant</span>
            <svg
              class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </router-link>

          <router-link
            to="/login"
            class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200"
          >
            <svg
              class="w-5 h-5 mr-2 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Se connecter
          </router-link>
        </div>

        <!-- Features highlights -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div
            class="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl">👨‍🎓</span>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Pour les Étudiants</h3>
            <p class="text-gray-600 text-sm">
              Accédez à vos cours, ressources et communiquez avec vos enseignants
            </p>
          </div>

          <div
            class="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl">👨‍🏫</span>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Pour les Enseignants</h3>
            <p class="text-gray-600 text-sm">
              Gérez vos classes, cours et interagissez avec vos étudiants
            </p>
          </div>

          <div
            class="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl">⚙️</span>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Pour les Administrateurs</h3>
            <p class="text-gray-600 text-sm">
              Supervisez l'ensemble de la plateforme et gérez les utilisateurs
            </p>
          </div>
        </div>

        <!-- Trust indicator -->
        <div class="mt-16 border-t border-gray-200 pt-8">
          <p class="text-gray-500 text-sm">
            Rejoignez des milliers d'utilisateurs qui font confiance à UniSphere pour leur
            éducation
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Animation subtle pour le gradient */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
