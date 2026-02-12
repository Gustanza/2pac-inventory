<template>
  <div>
    <label class="block text-sm font-medium text-gray-900 mb-1">
      {{ label }}
    </label>
    <select
      class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">Select unit</option>
      <option
        v-for="u in units"
        :key="u.name"
        :value="u.name"
      >
        {{ u.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Unit',
  },
  units: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue']);
</script>



