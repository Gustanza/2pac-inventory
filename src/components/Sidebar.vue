<template>
  <aside
    class="w-64 bg-white text-slate-900 flex flex-col flex-shrink-0 border-r border-slate-200"
  >
    <!-- Brand -->
    <div class="h-16 flex items-center px-4 border-b border-slate-200">
      <div class="flex items-center space-x-2">
        <div
          class="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm"
        >
          <span class="text-xs font-bold tracking-tight">IM</span>
        </div>
        <div class="leading-tight">
          <p class="text-sm font-semibold tracking-tight text-slate-900">
            Inventory Manager
          </p>
          <p class="text-[11px] text-slate-500">
            Multi-shop dashboard
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="mt-6 px-3 space-y-2">
      <p class="px-2 text-[11px] font-medium uppercase tracking-[0.15em] text-slate-400">
        Main
      </p>
      <button
        v-for="item in mainItems"
        :key="item.name"
        type="button"
        class="group w-full flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors"
        :class="item.routeName === activeRouteName
          ? 'bg-blue-50 text-blue-700 border border-blue-200'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
        @click="go(item.routeName)"
      >
        <span
          class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold"
          :class="item.routeName === activeRouteName
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'"
        >
          {{ item.icon }}
        </span>
        <span class="truncate">
          {{ item.name }}
        </span>
      </button>

      <p class="px-2 text-[11px] font-medium uppercase tracking-[0.15em] text-slate-400 mt-6">
        Advanced Settings
      </p>
      <button
        v-for="item in advancedItems"
        :key="item.name"
        type="button"
        class="group w-full flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors"
        :class="item.routeName === activeRouteName
          ? 'bg-blue-50 text-blue-700 border border-blue-200'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
        @click="go(item.routeName)"
      >
        <span
          class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold"
          :class="item.routeName === activeRouteName
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'"
        >
          {{ item.icon }}
        </span>
        <span class="truncate">
          {{ item.name }}
        </span>
      </button>
    </nav>

    <!-- Bottom actions -->
    <div class="mt-auto px-3 py-4 border-t border-slate-200">
      <button
        type="button"
        class="w-full inline-flex items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
        @click="$emit('logout')"
      >
        <span class="mr-1.5 text-[11px]">⏏</span>
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  activeRouteName: {
    type: String,
    default: '',
  },
});

const router = useRouter();

const items = [
  { name: 'Dashboard', routeName: 'dashboard', icon: '🏠' },
  { name: 'Shops', routeName: 'shops', icon: '🏬' },
  { name: 'Products', routeName: 'products', icon: '📦' },
  { name: 'Categories', routeName: 'categories', icon: '🏷️' },
  { name: 'Add Stock', routeName: 'stock-add', icon: '➕' },
  { name: 'Sell Product', routeName: 'stock-sell', icon: '💸' },
  { name: 'Stock History', routeName: 'stock-history', icon: '📊' },
];

const mainItems = [
  { name: 'Dashboard', routeName: 'dashboard', icon: '🏠' },
  { name: 'Products', routeName: 'products', icon: '📦' },
  { name: 'Categories', routeName: 'categories', icon: '🏷️' },
  { name: 'Add Stock', routeName: 'stock-add', icon: '➕' },
  { name: 'Sell Product', routeName: 'stock-sell', icon: '💸' },
  { name: 'Stock History', routeName: 'stock-history', icon: '📊' },
];

const advancedItems = [
  { name: 'Shops', routeName: 'shops', icon: '🏬' },
];

const go = (routeName) => {
  if (routeName && routeName !== props.activeRouteName) {
    router.push({ name: routeName });
  }
};
</script>



