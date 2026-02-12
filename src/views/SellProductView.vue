<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Sell Products</h1>
          <p class="text-gray-600">Process sales and manage inventory reductions for customer orders</p>
        </div>
        <div class="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
          <span class="text-white text-xl font-semibold">💰</span>
        </div>
      </div>
    </div>

    <ErrorBanner v-if="error" :message="error" />

    <!-- Main Form Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Product Selection -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              Select Product to Sell
            </label>
            <select
              v-model="selectedProductId"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              @change="loadUnits"
            >
              <option value="">Choose a product to sell...</option>
              <option
                v-for="p in products"
                :key="p.id"
                :value="p.id"
              >
                {{ p.name }} ({{ p.category || 'Uncategorized' }}) - Stock: {{ p.currentStockDisplay }}
              </option>
            </select>
          </div>

          <!-- Current Stock Display -->
          <div v-if="selectedProduct" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="text-blue-600 mr-2">📊</span>
                <span class="text-sm font-medium text-gray-700">Current Stock:</span>
              </div>
              <span class="text-sm font-semibold text-gray-900">
                {{ selectedProduct.currentStockDisplay }}
              </span>
            </div>
          </div>

          <!-- Unit Selection -->
          <div v-if="selectedProductId" class="space-y-2">
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              Select Unit for Sale
            </label>
            <select
              v-model="selectedUnit"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            >
              <option value="">Choose a unit...</option>
              <option
                v-for="unit in units"
                :key="unit.name"
                :value="unit.name"
              >
                {{ unit.name }} {{ unit.multiplier ? `(${unit.multiplier}x ${selectedProduct?.baseUnit || 'base unit'})` : '(base unit)' }}
              </option>
            </select>
          </div>

          <!-- Quantity Input -->
          <div v-if="selectedUnit" class="space-y-2">
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              Sale Quantity
            </label>
            <div class="relative">
              <input
                v-model="quantity"
                type="number"
                step="any"
                placeholder="Enter quantity to sell..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-400 text-sm">{{ selectedUnit }}</span>
              </div>
            </div>
          </div>

          <!-- Sale Preview -->
          <div v-if="preview && quantity" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start">
              <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span class="text-blue-600 text-sm font-semibold">💰</span>
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-semibold text-blue-900 mb-1">Sale Preview</h4>
                <p class="text-sm text-blue-700">
                  Selling {{ quantity }} {{ selectedUnit }} 
                  <span v-if="preview.baseQuantity && preview.baseUnit">
                    ({{ preview.baseQuantity }} {{ preview.baseUnit }})
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              @click="resetForm"
            >
              Clear Form
            </button>
            <button
              type="submit"
              class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-60"
              :disabled="submitting || !selectedProductId || !selectedUnit || !quantity"
            >
              <LoadingSpinner v-if="submitting" class="mr-2" />
              <span>{{ submitting ? 'Processing Sale...' : 'Process Sale' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Result -->
    <div v-if="result" class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
      <div class="flex items-start">
        <div class="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
          <span class="text-blue-600 text-lg font-semibold">✅</span>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-blue-900 mb-2">Sale Processed Successfully!</h3>
          <div class="bg-white rounded-lg p-4 border border-blue-200">
            <p class="text-sm text-gray-600 mb-1">Remaining Stock:</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ result.remainingStockDisplay }}
            </p>
            <p v-if="result.message" class="text-sm text-gray-500 mt-2">
              {{ result.message }}
            </p>
          </div>
          <div class="mt-4 flex space-x-3">
            <button
              type="button"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              @click="resetForm"
            >
              Process Another Sale
            </button>
            <button
              type="button"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              @click="goToProducts"
            >
              View Products
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="products.length === 0" class="text-center py-12">
      <div class="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="text-3xl">💰</span>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No Products Available</h3>
      <p class="text-gray-600 mb-6">You need to create products before you can process sales.</p>
      <button
        type="button"
        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        @click="goToProducts"
      >
        <span class="mr-2">+</span>
        Create First Product
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

const products = ref([]);
const units = ref([]);
const selectedProductId = ref('');
const selectedUnit = ref('');
const quantity = ref('');
const error = ref('');
const submitting = ref(false);
const preview = ref(null);
const result = ref(null);

const selectedProduct = computed(() =>
  products.value.find((p) => p.id === selectedProductId.value) || null
);

const fetchProducts = () => {
  products.value = store.listProducts();
};

const loadUnits = () => {
  preview.value = null;
  units.value = [];
  selectedUnit.value = '';
  quantity.value = '';
  if (!selectedProductId.value) return;
  units.value = selectedProduct.value?.units || [];
};

const resetForm = () => {
  selectedProductId.value = '';
  selectedUnit.value = '';
  quantity.value = '';
  preview.value = null;
  result.value = null;
  error.value = '';
  units.value = [];
};

const goToProducts = () => {
  router.push({ name: 'products' });
};

const handleSubmit = () => {
  error.value = '';
  submitting.value = true;
  preview.value = null;
  result.value = null;

  if (!selectedProductId.value || !selectedUnit.value || !quantity.value) {
    error.value = 'Please choose a product, unit, and quantity.';
    submitting.value = false;
    return;
  }

  preview.value = {
    baseQuantity: quantity.value,
    baseUnit: selectedUnit.value,
  };

  const { product } = store.recordMovement({
    productId: selectedProductId.value,
    type: 'sale',
    unit: selectedUnit.value,
    quantity: quantity.value,
  });

  result.value = {
    remainingStockDisplay: product?.currentStockDisplay || 'Updated (simulated)',
    message: 'Sale processed in mock store (no real stock deducted).',
  };

  submitting.value = false;
};

onMounted(fetchProducts);
</script>



