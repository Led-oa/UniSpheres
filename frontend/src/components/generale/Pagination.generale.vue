<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalItems: Number,
  itemsPerPage: Number,
  showInfo: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["page-change"]);

const pageNumbers = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(props.totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const handlePageChange = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit("page-change", page);
  }
};

const startItem = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1;
});

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems);
});
</script>

<template>
  <div
    class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg shadow border border-gray-200 p-4"
  >
    <!-- Info -->
    <div v-if="showInfo && totalItems" class="text-sm text-gray-700">
      Affichage de <span class="font-medium">{{ startItem }}</span> à
      <span class="font-medium">{{ endItem }}</span> sur
      <span class="font-medium">{{ totalItems }}</span> résultats
    </div>

    <div v-else-if="showInfo" class="text-sm text-gray-700">
      Page <span class="font-medium">{{ currentPage }}</span> sur
      <span class="font-medium">{{ totalPages }}</span>
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center space-x-1">
      <!-- Previous -->
      <button
        @click="handlePageChange(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Précédent
      </button>

      <!-- Page Numbers -->
      <button
        v-for="page in pageNumbers"
        :key="page"
        @click="handlePageChange(page)"
        :class="[
          'px-3 py-1 border rounded text-sm transition-colors',
          currentPage === page
            ? 'bg-blue-600 text-white border-blue-600'
            : 'border-gray-300 hover:bg-gray-50',
        ]"
      >
        {{ page }}
      </button>

      <!-- Next -->
      <button
        @click="handlePageChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Suivant
      </button>
    </div>
  </div>
</template>
