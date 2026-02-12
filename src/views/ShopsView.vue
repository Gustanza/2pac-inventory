<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-900">Shops</h1>
      <button
        type="button"
        class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
        :disabled="loading"
        @click="openCreate = true"
      >
        New Shop
      </button>
    </div>

    <ErrorBanner v-if="error" :message="error" />

    <div v-if="loading" class="flex items-center text-sm text-gray-500">
      <LoadingSpinner class="mr-2" />
      <span>Loading shops...</span>
    </div>

    <div v-else>
      <div v-if="shops.length === 0" class="text-sm text-gray-500">
        No shops yet. Create your first shop to get started.
      </div>
      <ul v-else class="divide-y divide-gray-200 bg-white shadow-sm rounded-md">
        <li
          v-for="shop in shops"
          :key="shop.id"
          class="flex items-center justify-between px-4 py-3"
        >
          <div>
            <p class="text-sm font-medium text-gray-900">{{ shop.name }}</p>
            <p class="text-xs text-gray-500" v-if="shop.description">
              {{ shop.description }}
            </p>
          </div>
          <button
            type="button"
            class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            @click="setActive(shop)"
          >
            Set active
          </button>
        </li>
      </ul>
    </div>

    <Modal v-if="openCreate" title="Create shop" @close="openCreate = false">
      <form class="space-y-4" @submit.prevent="handleCreate">
        <FormInput
          id="shop_name"
          label="Shop name"
          v-model="newShopName"
          required
        />
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="openCreate = false"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
            :disabled="creating"
          >
            <LoadingSpinner v-if="creating" class="mr-2" />
            <span>{{ creating ? 'Creating...' : 'Create' }}</span>
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useMockStore } from '../mock/store';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorBanner from '../components/ErrorBanner.vue';
import FormInput from '../components/FormInput.vue';
import Modal from '../components/Modal.vue';

const store = useMockStore();

const shops = ref([]);
const loading = ref(false);
const error = ref('');
const openCreate = ref(false);
const newShopName = ref('');
const creating = ref(false);

const fetchShops = () => {
  loading.value = true;
  error.value = '';
  // Instant mock load
  shops.value = store.listShops();
  loading.value = false;
};

const handleCreate = () => {
  if (!newShopName.value) return;
  creating.value = true;
  error.value = '';
  const created = store.createShop(newShopName.value);
  shops.value.push(created);
  newShopName.value = '';
  openCreate.value = false;
  creating.value = false;
};

const setActive = (shop) => {
  // Persist active shop selection locally only; backend is still source of truth.
  window.localStorage.setItem('active_shop', JSON.stringify(shop));
};

onMounted(fetchShops);
</script>



