<template>
  <div class="rounded-md bg-red-50 p-3 border border-red-200 text-sm text-red-700">
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
});
</script>



