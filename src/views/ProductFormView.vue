<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        {{ isEdit ? 'Edit Product' : 'Create New Product' }}
      </h1>
      <p class="text-gray-600">
        {{ isEdit ? 'Update product information and settings' : 'Add a new product to your inventory catalog' }}
      </p>
    </div>

    <ErrorBanner v-if="error" :message="error" />

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Basic Information Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div class="flex items-center mb-6">
          <div class="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <span class="text-blue-600 font-semibold">📦</span>
          </div>
          <h2 class="text-xl font-semibold text-gray-900">Basic Information</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            id="name"
            label="Product Name"
            v-model="product.name"
            placeholder="e.g., Premium Coffee Beans"
            required
          />

          <div>
            <label for="category" class="block text-sm font-medium text-gray-900 mb-2">
              Category
            </label>
            <select
              id="category"
              v-model="product.categoryId"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select a category</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Units & Measurement Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div class="flex items-center mb-6">
          <div class="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <span class="text-green-600 font-semibold">📏</span>
          </div>
          <h2 class="text-xl font-semibold text-gray-900">Units & Measurement</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <FormInput
            id="baseUnit"
            label="Base Unit"
            v-model="product.baseUnit"
            placeholder="e.g., bag, bottle, kg"
            :disabled="isEdit"
            required
          />

          <FormInput
            id="min_unit"
            label="Minimum Sellable Unit"
            v-model="product.minSellableUnit"
            placeholder="e.g., 1 bag, 6 bottles"
          />

          <div class="flex items-center pt-6">
            <input
              id="allow_fractional"
              v-model="product.allowFractional"
              type="checkbox"
              class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <label
              for="allow_fractional"
              class="ml-3 text-sm font-medium text-gray-700"
            >
              Allow fractional sales
            </label>
          </div>
        </div>

        <!-- Additional Units -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Additional Units</h3>
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              @click="addUnit"
            >
              <span class="mr-2">+</span>
              Add Unit
            </button>
          </div>

          <div v-if="product.units.length === 0" class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <span class="text-gray-400">No additional units defined</span>
            <p class="text-sm text-gray-400 mt-1">Add units for selling in packages</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(unit, index) in product.units"
              :key="index"
              class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Unit Name</label>
                <input
                  v-model="unit.name"
                  type="text"
                  placeholder="e.g., box, case, 6-pack"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div class="w-32">
                <label class="block text-sm font-medium text-gray-700 mb-1">Multiplier</label>
                <input
                  v-model.number="unit.multiplier"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="e.g., 10"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div class="pt-6">
                <button
                  type="button"
                  class="text-red-600 hover:text-red-800 font-medium text-sm"
                  @click="removeUnit(index)"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          @click="goBack"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="saving"
        >
          <LoadingSpinner v-if="saving" class="mr-2" />
          <span>{{ saving ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product') }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMockStore } from '../mock/store';
import FormInput from '../components/FormInput.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorBanner from '../components/ErrorBanner.vue';

const route = useRoute();
const router = useRouter();
const store = useMockStore();

const product = reactive({
  name: '',
  categoryId: '',
  category: '',
  baseUnit: '',
  allowFractional: false,
  minSellableUnit: '',
  units: [],
});

const categories = ref([]);

const saving = ref(false);
const error = ref('');

const isEdit = computed(() => !!route.params.id);

const fetchCategories = () => {
  categories.value = store.listCategories();
};

const loadProduct = () => {
  if (!isEdit.value) return;
  const existing = store.getProductById(route.params.id);
  if (!existing) {
    error.value = 'Product not found in mock data.';
    return;
  }
  Object.assign(product, {
    name: existing.name,
    categoryId: existing.categoryId || '',
    category: existing.category,
    baseUnit: existing.baseUnit,
    allowFractional: existing.allowFractional,
    minSellableUnit: existing.minSellableUnit,
    units: existing.units ? [...existing.units] : [],
  });
};

const addUnit = () => {
  product.units.push({
    name: '',
    multiplier: 1,
  });
};

const removeUnit = (index) => {
  product.units.splice(index, 1);
};

const handleSubmit = () => {
  saving.value = true;
  error.value = '';

  if (!product.name || !product.baseUnit) {
    error.value = 'Please provide at least a name and base unit.';
    saving.value = false;
    return;
  }

  const selectedCategory = categories.value.find(c => c.id === product.categoryId);
  
  const payload = {
    name: product.name,
    categoryId: product.categoryId,
    category: selectedCategory ? selectedCategory.name : '',
    baseUnit: product.baseUnit,
    allowFractional: product.allowFractional,
    minSellableUnit: product.minSellableUnit,
    units: product.units,
  };

  store.upsertProduct(isEdit.value ? route.params.id : null, payload);

  saving.value = false;
  router.push({ name: 'products' });
};

const goBack = () => {
  router.push({ name: 'products' });
};

onMounted(() => {
  fetchCategories();
  loadProduct();
});
</script>



