<template>
  <div>
    <label
      :for="id"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ label }}
    </label>
    <div class="mt-1">
      <input
        :id="id"
        v-bind="$attrs"
        :type="type"
        class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
});

defineEmits(['update:modelValue']);
</script>



