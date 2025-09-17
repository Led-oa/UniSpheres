import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";

export const toast = useToast();

// Fonctions utilitaires
export function notifySuccess(message) {
  toast.success(message, {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}

export function notifyError(message) {
  toast.error(message, {
    position: "top-right",
    timeout: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}

export function notifyInfo(message) {
  toast.info(message, {
    position: "top-right",
    timeout: 4000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}

export function notifyWarning(message) {
  toast.warning(message, {
    position: "top-right",
    timeout: 4000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}
