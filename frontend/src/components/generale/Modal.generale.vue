<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="fixed inset-0 z-50 overflow-y-auto" @close="closeModal">
      <div class="flex items-center justify-center min-h-screen px-4 text-center">
        <TransitionChild
          enter="ease-out duration-300"
          enter-from="opacity-100"
          enter-to="opacity-0"
          leave="ease-in duration-200"
          leave-from="opacity-0"
          leave-to="opacity-100"
        >
          <DialogOverlay class="fixed inset-0" />
        </TransitionChild>

        <span class="inline-block align-middle h-screen" aria-hidden="true">&#8203;</span>

        <TransitionChild
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <div
            class="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
          >
            <!-- Header -->
            <div class="flex justify-between items-center mb-4">
              <DialogTitle class="text-lg font-medium text-gray-900">{{
                title
              }}</DialogTitle>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div>
              <slot />
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { defineProps } from "vue";

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: "" },
});

const emit = defineEmits(["update:isOpen"]);

function closeModal() {
  emit("update:isOpen", false);
}
</script>
