<template>
  <div class="min-h-screen bg-slate-50 flex">
    <Sidebar
      class="hidden md:block"
      :active-route-name="route.name"
      @logout="handleLogout"
    />

    <div class="flex-1 flex flex-col">
      <TopNav
        :current-shop="currentShop"
        @logout="handleLogout"
      />

      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <div class="max-w-6xl mx-auto">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';
import TopNav from '../components/TopNav.vue';

const route = useRoute();
const router = useRouter();

// Active shop info could come from a simple provide/inject or a composable.
// For now, read from localStorage as a placeholder source of truth.
// TODO: replace with a proper shop context once backend contract is clear.
const currentShop = computed(() => {
  try {
    const raw = window.localStorage.getItem('active_shop');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
});

const handleLogout = () => {
  window.localStorage.removeItem('auth_token');
  // TODO: clear any other auth-related local state when defined.
  router.push({ name: 'login' });
};
</script>



