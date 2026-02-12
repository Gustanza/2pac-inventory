<template>
  <div class="bg-white shadow-sm rounded-md overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            scope="col"
            class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ col.label }}
          </th>
          <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-if="rows.length === 0">
          <td
            :colspan="columns.length + 1"
            class="px-3 py-4 text-sm text-gray-500 text-center"
          >
            {{ emptyText }}
          </td>
        </tr>
        <tr
          v-for="row in rows"
          :key="row[primaryKey]"
          class="hover:bg-gray-50"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-3 py-2 text-sm text-gray-900"
          >
            {{ row[col.key] }}
          </td>
          <td class="px-3 py-2 text-right text-xs space-x-2">
            <button
              type="button"
              class="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
              @click="$emit('view', row)"
            >
              View
            </button>
            <button
              type="button"
              class="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
              @click="$emit('edit', row)"
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
  primaryKey: {
    type: String,
    default: 'id',
  },
  emptyText: {
    type: String,
    default: 'No data to display.',
  },
});

defineEmits(['view', 'edit']);
</script>



