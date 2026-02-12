<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
    <div class="w-full max-w-lg rounded-lg bg-white shadow-lg">
      <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 class="text-sm font-semibold text-gray-900">
          {{ title }}
        </h2>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-600"
          @click="$emit('close')"
        >
          <span class="sr-only">Close</span>
          ✕
        </button>
      </div>
      <div class="px-4 py-3">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
});

defineEmits(['close']);
</script>



