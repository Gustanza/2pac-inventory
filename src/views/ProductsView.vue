<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p class="text-gray-600">Manage your product catalog and inventory</p>
        </div>
        <button
          type="button"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          @click="goCreate"
        >
          <span class="mr-2">+</span>
          New Product
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div class="md:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            v-model="selectedCategory"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Sort -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            v-model="sortBy"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="category">Category</option>
            <option value="stock">Stock Level</option>
          </select>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="mt-4 flex items-center space-x-2">
        <span class="text-sm text-gray-500">Active filters:</span>
        <span v-if="searchQuery" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Search: "{{ searchQuery }}"
          <button @click="searchQuery = ''" class="ml-2 hover:text-blue-600">×</button>
        </span>
        <span v-if="selectedCategory" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {{ getCategoryName(selectedCategory) }}
          <button @click="selectedCategory = ''" class="ml-2 hover:text-blue-600">×</button>
        </span>
        <button @click="clearFilters" class="text-sm text-blue-600 hover:text-blue-800 font-medium">Clear all</button>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="mb-6 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Showing <span class="font-medium">{{ filteredProducts.length }}</span> of 
        <span class="font-medium">{{ products.length }}</span> products
      </div>
      <div class="text-sm text-gray-600">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <LoadingSpinner class="mr-3" />
      <span class="text-gray-600">Loading products...</span>
    </div>

    <!-- Products Grid -->
    <div v-else-if="paginatedProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
        @click="handleView(product)"
      >
        <div class="p-4">
          <!-- Top Row: Avatar, Name, Category, and Edit Button -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center flex-1 min-w-0">
              <!-- Avatar -->
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm mr-3 flex-shrink-0">
                <span class="text-white text-lg font-semibold">📦</span>
              </div>
              
              <!-- Name and Category Column -->
              <div class="flex-1 min-w-0">
                <h3 class="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-1 truncate">
                  {{ product.name }}
                </h3>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  {{ product.category || 'Uncategorized' }}
                </span>
              </div>
            </div>
            
            <!-- Edit Button -->
            <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              <button
                type="button"
                class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                @click.stop="handleEdit(product)"
                title="Edit product"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Stats Section -->
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm mb-3">
            <!-- Stock Info -->
            <div class="flex items-center bg-gray-50 px-3 py-1.5 rounded">
              <span class="text-green-600 mr-1.5">📊</span>
              <span class="text-gray-600">Stock:</span>
              <span class="ml-1 font-semibold text-gray-900">
                {{ product.currentStockDisplay }}
              </span>
            </div>

            <!-- Unit Info -->
            <div class="flex items-center bg-gray-50 px-3 py-1.5 rounded">
              <span class="text-blue-600 mr-1.5">📏</span>
              <span class="text-gray-600">Unit:</span>
              <span class="ml-1 font-semibold text-gray-900">
                {{ product.baseUnit || 'N/A' }}
              </span>
            </div>

            <!-- Units Count -->
            <div v-if="product.units && product.units.length > 0" class="flex items-center bg-gray-50 px-3 py-1.5 rounded">
              <span class="text-purple-600 mr-1.5">📦</span>
              <span class="text-gray-600">Units:</span>
              <span class="ml-1 font-semibold text-gray-900">
                {{ product.units.length }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-2">
            <button
              type="button"
              class="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors font-medium text-sm"
              @click.stop="handleEdit(product)"
            >
              Edit
            </button>
            <button
              type="button"
              class="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium text-sm"
              @click.stop="handleView(product)"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
      <div class="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="text-3xl">🔍</span>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
      <p class="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
      <button
        type="button"
        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        @click="clearFilters"
      >
        Clear Filters
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Showing {{ startIndex + 1 }}-{{ Math.min(endIndex, filteredProducts.length) }} of {{ filteredProducts.length }} products
      </div>
      <div class="flex items-center space-x-2">
        <button
          type="button"
          class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Previous
        </button>
        
        <div class="flex items-center space-x-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            type="button"
            class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="page === currentPage 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          type="button"
          class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMockStore } from '../mock/store';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorBanner from '../components/ErrorBanner.vue';

const router = useRouter();
const store = useMockStore();

// Data
const products = ref([]);
const categories = ref([]);
const loading = ref(false);
const error = ref('');

// Filters
const searchQuery = ref('');
const selectedCategory = ref('');
const sortBy = ref('name');

// Pagination
const currentPage = ref(1);
const itemsPerPage = 15;

// Computed properties
const filteredProducts = computed(() => {
  let filtered = [...products.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(product => 
      product.categoryId === selectedCategory.value
    );
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'category':
        return (a.category || '').localeCompare(b.category || '');
      case 'stock':
        return (a.currentStockDisplay || '').localeCompare(b.currentStockDisplay || '');
      default:
        return 0;
    }
  });

  return filtered;
});

const totalPages = computed(() => 
  Math.ceil(filteredProducts.value.length / itemsPerPage)
);

const startIndex = computed(() => 
  (currentPage.value - 1) * itemsPerPage
);

const endIndex = computed(() => 
  startIndex.value + itemsPerPage
);

const paginatedProducts = computed(() => 
  filteredProducts.value.slice(startIndex.value, endIndex.value)
);

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 2;
  
  let range = [];
  let rangeWithDots = [];
  
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }
  
  if (current - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }
  
  rangeWithDots.push(...range);
  
  if (current + delta < total - 1) {
    rangeWithDots.push('...', total);
  } else if (total > 1) {
    rangeWithDots.push(total);
  }
  
  return rangeWithDots.filter(page => page !== 1 || total === 1);
});

const hasActiveFilters = computed(() => 
  searchQuery.value || selectedCategory.value
);

// Methods
const fetchProducts = () => {
  loading.value = true;
  error.value = '';
  const list = store.listProducts();
  products.value = list.map((p) => ({
    ...p,
    currentStockDisplay: p.currentStockDisplay || '0 (simulated)',
    baseUnit: p.baseUnit || '',
  }));
  loading.value = false;
};

const fetchCategories = () => {
  categories.value = store.listCategories();
};

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : '';
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  currentPage.value = 1;
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const goCreate = () => {
  router.push({ name: 'product-create' });
};

const handleView = (row) => {
  router.push({ name: 'product-edit', params: { id: row.id } });
};

const handleEdit = (row) => {
  router.push({ name: 'product-edit', params: { id: row.id } });
};

// Watch for filter changes to reset pagination
watch([searchQuery, selectedCategory, sortBy], () => {
  currentPage.value = 1;
});

onMounted(() => {
  fetchProducts();
  fetchCategories();
});
</script>



