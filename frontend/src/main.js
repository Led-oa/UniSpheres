import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import { useAuthStore } from "./stores/auth.store";
import { useChatStore } from "./stores/chat.store";

import "./style.css";
import App from "./App.vue";
import router from "./routes/index.routes";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);

const authStore = useAuthStore();
const chatStore = useChatStore();
app.use(router);
authStore.initializeAuth();

// Initialiser le socket si l'utilisateur est authentifié
if (authStore.isLoggedIn && authStore.user) {
  chatStore.initializeSocket(authStore.user.id_user);
}

app.use(Toast);

app.mount("#app");
