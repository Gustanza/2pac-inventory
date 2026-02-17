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

        

        <div>

          <label class="block text-sm font-medium leading-6 text-gray-900 mb-2">

            Associated Users

          </label>

          <div class="space-y-2">

            <div class="relative">

              <FormInput

                id="user_search"

                label="Search users"

                v-model="userSearchQuery"

                type="text"

                placeholder="Type to search users..."

                @blur="handleSearchBlur"

              />

              <div v-if="showUserDropdown && filteredUsers.length > 0" 

                   class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">

                <div v-for="user in filteredUsers" 

                     :key="user.id"

                     @click="toggleUserSelection(user)"

                     class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">

                  <div>

                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>

                    <div class="text-xs text-gray-500">{{ user.email }}</div>

                  </div>

                  <input
                    type="checkbox"
                    :checked="selectedUsers.some(u => u.id === user.id)"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    @click.stop
                  />

                </div>

                <div class="px-3 py-2 bg-gray-50 border-t border-gray-200">
                  <button
                    type="button"
                    @click="closeUserDropdown"
                    class="w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Done selecting users
                  </button>

                </div>

              </div>

                                 </div>

            

            <div v-if="selectedUsers.length > 0" class="flex flex-wrap gap-2 mt-2">

              <span v-for="user in selectedUsers" 

                    :key="user.id"

                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">

                {{ user.name }}

                <button type="button" 

                        @click="removeUser(user)"

                        class="ml-1 text-indigo-600 hover:text-indigo-800">

                  ×

                </button>

              </span>

            </div>

          </div>

        </div>

        

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

import { onMounted, ref, watch } from 'vue';

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



// User management

const userSearchQuery = ref('');

const selectedUsers = ref([]);

const filteredUsers = ref([]);

const showUserDropdown = ref(false);



// Computed property for filtered users

const updateFilteredUsers = () => {

  filteredUsers.value = store.searchUsers(userSearchQuery.value);

  showUserDropdown.value = userSearchQuery.value.trim() !== '';

};



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

  const userIds = selectedUsers.value.map(user => user.id);

  const created = store.createShop(newShopName.value, userIds);

  shops.value.push(created);

  newShopName.value = '';

  selectedUsers.value = [];

  userSearchQuery.value = '';

  openCreate.value = false;

  creating.value = false;

};


const toggleUserSelection = (user) => {

  const index = selectedUsers.value.findIndex(u => u.id === user.id);

  if (index > -1) {

    selectedUsers.value.splice(index, 1);

  } else {

    selectedUsers.value.push(user);

  }

};



const removeUser = (user) => {

  const index = selectedUsers.value.findIndex(u => u.id === user.id);

  if (index > -1) {

    selectedUsers.value.splice(index, 1);

  }

};



const setActive = (shop) => {

  // Persist active shop selection locally only; backend is still source of truth.

  window.localStorage.setItem('active_shop', JSON.stringify(shop));

};



// Watch user search query

watch(userSearchQuery, updateFilteredUsers);



onMounted(fetchShops);

</script>







