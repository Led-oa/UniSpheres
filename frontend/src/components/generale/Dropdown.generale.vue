<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton
      class="inline-flex justify-center w-full px-4 py-2 bg-white text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none"
    >
      {{ buttonText }}
      <svg class="-mr-1 ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0l-4.25-4.25a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </MenuButton>

    <TransitionRoot
      enter="transition ease-out duration-100"
      enter-from="transform opacity-0 scale-95"
      enter-to="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leave-from="transform opacity-100 scale-100"
      leave-to="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-50"
      >
        <div class="py-1">
          <MenuItem v-for="(item, index) in items" :key="index">
            <button
              @click="item.action"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
            >
              {{ item.label }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </TransitionRoot>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem, TransitionRoot } from "@headlessui/vue";

const props = defineProps({
  buttonText: { type: String, default: "Menu" },
  items: { type: Array, default: () => [] }, // { label: '...', action: ()=>{} }
});
</script>
