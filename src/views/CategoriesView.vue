<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
          <p class="text-gray-600">Manage product categories for better organization</p>
        </div>
        <button
          type="button"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          @click="showCreateModal = true"
        >
          <span class="mr-2">+</span>
          New Category
        </button>
      </div>
    </div>

    <ErrorBanner v-if="error" :message="error" />

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <LoadingSpinner class="mr-3" />
      <span class="text-gray-600">Loading categories...</span>
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
              placeholder="Search categories..."
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
            <span class="ml-1 font-semibold text-gray-900">{{ categories.length }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-gray-500">Products:</span>
            <span class="ml-1 font-semibold text-gray-900">{{ totalProducts }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div v-if="filteredCategories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
        @click="editCategory(category)"
      >
        <div class="p-4">
          <!-- Top Row: Avatar, Name, and Edit Button -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center flex-1 min-w-0">
              <!-- Avatar -->
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm mr-3 flex-shrink-0">
                <span class="text-white text-lg font-semibold">🏷️</span>
              </div>
              
              <!-- Name Column -->
              <div class="flex-1 min-w-0">
                <h3 class="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-1 truncate">
                  {{ category.name }}
                </h3>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                  Category
                </span>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              <button
                type="button"
                class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                @click.stop="editCategory(category)"
                title="Edit category"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                type="button"
                class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                @click.stop="deleteCategory(category)"
                title="Delete category"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Description -->
          <div v-if="category.description" class="mb-3">
            <p class="text-sm text-gray-600 line-clamp-2">
              {{ category.description }}
            </p>
          </div>

          <!-- Stats Section -->
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm mb-3">
            <!-- Products Count -->
            <div class="flex items-center bg-gray-50 px-3 py-1.5 rounded">
              <span class="text-blue-600 mr-1.5">📦</span>
              <span class="text-gray-600">Products:</span>
              <span class="ml-1 font-semibold text-gray-900">
                {{ getProductCount(category.id) }}
              </span>
            </div>

            <!-- Category ID -->
            <div class="flex items-center bg-gray-50 px-3 py-1.5 rounded">
              <span class="text-gray-600 mr-1.5">🆔</span>
              <span class="text-gray-600">ID:</span>
              <span class="ml-1 font-semibold text-gray-900">
                {{ category.id }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-2">
            <button
              type="button"
              class="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors font-medium text-sm"
              @click.stop="editCategory(category)"
            >
              Edit
            </button>
            <button
              type="button"
              class="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium text-sm"
              @click.stop="viewProducts(category)"
            >
              View Products
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="text-3xl">🏷️</span>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ searchQuery ? 'No categories found' : 'No categories yet' }}
      </h3>
      <p class="text-gray-600 mb-6">
        {{ searchQuery ? 'Try adjusting your search terms' : 'Create your first category to organize products' }}
      </p>
      <button
        v-if="!searchQuery"
        type="button"
        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        @click="showCreateModal = true"
      >
        <span class="mr-2">+</span>
        Create First Category
      </button>
      <button
        v-else
        type="button"
        class="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        @click="searchQuery = ''"
      >
        Clear Search
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingCategory"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-xl rounded-md bg-white"
        @click.stop
      >
        <div class="flex items-center mb-4">
          <div class="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <span class="text-blue-600 font-semibold">🏷️</span>
          </div>
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingCategory ? 'Edit Category' : 'Create Category' }}
          </h3>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <FormInput
            id="name"
            label="Category Name"
            v-model="formData.name"
            placeholder="e.g., Beverages, Electronics"
            required
          />

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="4"
              class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Optional description for this category"
            />
          </div>
          {{ formData }}
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-60"
              :disabled="saving"
            >
              <LoadingSpinner v-if="saving" class="mr-2" />
              <span>{{ saving ? 'Saving...' : 'Save Category' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMockStore } from '../mock/store';
import FormInput from '../components/FormInput.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorBanner from '../components/ErrorBanner.vue';

const router = useRouter();
const store = useMockStore();

// Data
const categories = ref([]);
const products = ref([]);
const loading = ref(false);
const error = ref('');
const saving = ref(false);
const showCreateModal = ref(false);
const editingCategory = ref(null);
const searchQuery = ref('');

const formData = reactive({
  name: '',
  description: '',
});

// Computed properties
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value;
  
  const query = searchQuery.value.toLowerCase();
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(query) ||
    (category.description && category.description.toLowerCase().includes(query))
  );
});

const totalProducts = computed(() => products.value.length);

// Methods
const fetchCategories = () => {
  loading.value = true;
  error.value = '';
  try {
    categories.value = store.listCategories();
    products.value = store.listProducts();
  } catch (err) {
    error.value = 'Failed to load categories';
  } finally {
    loading.value = false;
  }
};

const getProductCount = (categoryId) => {
  return products.value.filter(product => product.categoryId === categoryId).length;
};

const editCategory = (category) => {
  editingCategory.value = category;
  formData.name = category.name;
  formData.description = category.description;
};

const deleteCategory = (category) => {
  const productCount = getProductCount(category.id);
  const confirmMessage = productCount > 0 
    ? `Are you sure you want to delete "${category.name}"? It contains ${productCount} product(s) that will become uncategorized.`
    : `Are you sure you want to delete "${category.name}"?`;
    
  if (confirm(confirmMessage)) {
    try {
      store.deleteCategory(category.id);
      fetchCategories();
    } catch (err) {
      error.value = 'Failed to delete category';
    }
  }
};

const viewProducts = (category) => {
  // Navigate to products page with category filter
  router.push({ 
    name: 'products',
    query: { category: category.id }
  });
};

const handleSubmit = async () => {
  saving.value = true;
  error.value = '';

  try {
    if (editingCategory.value) {
      store.updateCategory(editingCategory.value.id, {
        name: formData.name,
        description: formData.description,
      });
    } else {
      store.createCategory(formData.name, formData.description);
    }
    
    closeModal();
    fetchCategories();
  } catch (err) {
    error.value = 'Failed to save category';
  } finally {
    saving.value = false;
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingCategory.value = null;
  formData.name = '';
  formData.description = '';
};

onMounted(fetchCategories);
</script>
