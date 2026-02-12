<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
    <div class="flex items-center space-x-3">
      <span class="text-base font-semibold text-gray-900">Multi-Shop Inventory</span>
      <span v-if="currentShop" class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
        Active shop:
        <span class="ml-1 truncate max-w-[160px]" :title="currentShop.name">
          {{ currentShop.name }}
        </span>
      </span>
      <span v-else class="text-xs text-gray-400">
        No active shop selected
      </span>
    </div>
    <div class="flex items-center space-x-2">
      <button
        type="button"
        class="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
        @click="$emit('logout')"
      >
        Logout
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  currentShop: {
    type: Object,
    default: null,
  },
});
</script>


