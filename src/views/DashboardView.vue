<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500">Welcome back!</span>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <span class="text-xl">🏬</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Shops</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalShops }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <span class="text-xl">📦</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Products</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalProducts }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <span class="text-xl">🏷️</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Categories</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalCategories }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <span class="text-xl">📊</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Stock Movements</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalMovements }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          @click="goToRoute('product-create')"
        >
          <span class="mr-2">➕</span>
          Add Product
        </button>
        <button
          type="button"
          class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          @click="goToRoute('stock-add')"
        >
          <span class="mr-2">📥</span>
          Add Stock
        </button>
        <button
          type="button"
          class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          @click="goToRoute('stock-sell')"
        >
          <span class="mr-2">💸</span>
          Sell Product
        </button>
        <button
          type="button"
          class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          @click="goToRoute('categories')"
        >
          <span class="mr-2">🏷️</span>
          Manage Categories
        </button>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Stock Movements</h2>
        <div v-if="recentMovements.length === 0" class="text-sm text-gray-500">
          No recent movements
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="movement in recentMovements"
            :key="movement.id"
            class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div class="flex items-center space-x-3">
              <span class="text-lg">
                {{ movement.type === 'sale' ? '💸' : '📥' }}
              </span>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ movement.quantityDisplay }}</p>
                <p class="text-xs text-gray-500">{{ movement.date }}</p>
              </div>
            </div>
            <span
              class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
              :class="movement.type === 'sale' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'"
            >
              {{ movement.type }}
            </span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Categories Overview</h2>
        <div v-if="categories.length === 0" class="text-sm text-gray-500">
          No categories found
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="category in categories.slice(0, 5)"
            :key="category.id"
            class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div class="flex items-center space-x-3">
              <span class="text-lg">🏷️</span>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ category.name }}</p>
                <p class="text-xs text-gray-500">{{ category.description }}</p>
              </div>
            </div>
            <span class="text-sm text-gray-500">
              {{ getProductCountByCategory(category.id) }} products
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMockStore } from '../mock/store';

const router = useRouter();
const store = useMockStore();

const shops = ref([]);
const products = ref([]);
const categories = ref([]);
const movements = ref([]);

const stats = computed(() => ({
  totalShops: shops.value.length,
  totalProducts: products.value.length,
  totalCategories: categories.value.length,
  totalMovements: movements.value.length,
}));

const recentMovements = computed(() => movements.value.slice(0, 5));

const fetchData = () => {
  shops.value = store.listShops();
  products.value = store.listProducts();
  categories.value = store.listCategories();
  movements.value = store.listHistory();
};

const getProductCountByCategory = (categoryId) => {
  return products.value.filter(p => p.categoryId === categoryId).length;
};

const goToRoute = (routeName) => {
  router.push({ name: routeName });
};

onMounted(fetchData);
</script>
