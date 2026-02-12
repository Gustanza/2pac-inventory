<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Stock History</h1>
          <p class="text-gray-600">Track all inventory movements and transactions</p>
        </div>
        <div class="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
          <span class="text-white text-xl font-semibold">📊</span>
        </div>
      </div>
    </div>

    <ErrorBanner v-if="error" :message="error" />

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <LoadingSpinner class="mr-3" />
      <span class="text-gray-600">Loading stock history...</span>
    </div>

    <!-- Search and Filter -->
    <div v-else class="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search movements..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex items-center space-x-6 text-sm">
          <div class="flex items-center">
            <span class="text-gray-500">Total:</span>
            <span class="ml-1 font-semibold text-gray-900">{{ movements.length }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-blue-600 mr-1">📈</span>
            <span class="text-gray-500">Stock In:</span>
            <span class="ml-1 font-semibold text-blue-600">{{ stockInCount }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-gray-600 mr-1">📉</span>
            <span class="text-gray-500">Stock Out:</span>
            <span class="ml-1 font-semibold text-gray-600">{{ stockOutCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Movements Grid -->
    <div v-if="filteredMovements.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="movement in filteredMovements"
        :key="movement.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
      >
        <div class="p-4">
          <!-- Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center">
              <div 
                class="h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                :class="movement.type === 'restock' ? 'bg-blue-100' : 'bg-gray-100'"
              >
                <span class="text-sm font-semibold" :class="movement.type === 'restock' ? 'text-blue-600' : 'text-gray-600'">
                  {{ movement.type === 'restock' ? '📈' : '📉' }}
                </span>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-900 capitalize">
                  {{ movement.type === 'restock' ? 'Stock Added' : 'Sale' }}
                </h3>
                <p class="text-xs text-gray-500">{{ movement.date }}</p>
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="mb-3">
            <p class="text-sm font-medium text-gray-900 mb-1">{{ movement.reference }}</p>
            <p class="text-xs text-gray-500">Product</p>
          </div>

          <!-- Quantity Info -->
          <div class="space-y-2">
            <div class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
              <span class="text-xs font-medium text-gray-600">Quantity</span>
              <span 
                class="text-sm font-semibold"
                :class="movement.type === 'restock' ? 'text-blue-600' : 'text-gray-600'"
              >
                {{ movement.type === 'restock' ? '+' : '-' }}{{ movement.quantity }} {{ movement.unit }}
              </span>
            </div>
            
            <div v-if="movement.baseQuantity && movement.baseUnit" class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
              <span class="text-xs font-medium text-gray-600">Base Units</span>
              <span class="text-sm font-semibold text-gray-900">
                {{ movement.baseQuantity }} {{ movement.baseUnit }}
              </span>
            </div>
          </div>

          <!-- Action Button -->
          <div class="mt-4">
            <button
              type="button"
              class="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium text-sm"
              @click="viewProduct(movement)"
            >
              View Product
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="text-3xl">📊</span>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ searchQuery ? 'No movements found' : 'No Stock Movements Yet' }}
      </h3>
      <p class="text-gray-600 mb-6">
        {{ searchQuery ? 'Try adjusting your search terms' : 'Start adding or selling products to see movement history' }}
      </p>
      <div v-if="!searchQuery" class="flex space-x-3 justify-center">
        <button
          type="button"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          @click="goToAddStock"
        >
          <span class="mr-2">+</span>
          Add Stock
        </button>
        <button
          type="button"
          class="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          @click="goToSellProducts"
        >
          <span class="mr-2">💰</span>
          Sell Products
        </button>
      </div>
      <button
        v-else
        type="button"
        class="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        @click="searchQuery = ''"
      >
        Clear Search
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMockStore } from '../mock/store';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorBanner from '../components/ErrorBanner.vue';

const router = useRouter();
const store = useMockStore();

const loading = ref(false);
const error = ref('');
const movements = ref([]);
const searchQuery = ref('');

const fetchHistory = () => {
  loading.value = true;
  error.value = '';
  const list = store.listHistory();
  movements.value = list.map((item) => ({
    ...item,
    quantityDisplay:
      item.quantityDisplay ??
      `${item.quantity} ${item.unit} (${item.baseQuantity} ${item.baseUnit})`,
  }));
  loading.value = false;
};

const filteredMovements = computed(() => {
  if (!searchQuery.value) return movements.value;
  
  const query = searchQuery.value.toLowerCase();
  return movements.value.filter(movement =>
    movement.reference.toLowerCase().includes(query) ||
    movement.type.toLowerCase().includes(query) ||
    movement.date.toLowerCase().includes(query)
  );
});

const stockInCount = computed(() => 
  movements.value.filter(m => m.type === 'restock').length
);

const stockOutCount = computed(() => 
  movements.value.filter(m => m.type === 'sale').length
);

const viewProduct = (movement) => {
  // Navigate to product details or edit page
  router.push({ name: 'products' });
};

const goToAddStock = () => {
  router.push({ name: 'add-stock' });
};

const goToSellProducts = () => {
  router.push({ name: 'sell-product' });
};

onMounted(fetchHistory);
</script>



