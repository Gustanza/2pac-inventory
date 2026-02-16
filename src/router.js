import { createRouter, createWebHistory } from 'vue-router';
import LoginView from './views/LoginView.vue';
import RegisterView from './views/RegisterView.vue';
import DashboardLayout from './layouts/DashboardLayout.vue';
import DashboardView from './views/DashboardView.vue';
import ShopsView from './views/ShopsView.vue';
import ProductsView from './views/ProductsView.vue';
import ProductFormView from './views/ProductFormView.vue';
import CategoriesView from './views/CategoriesView.vue';
import AddStockView from './views/AddStockView.vue';
import SellProductView from './views/SellProductView.vue';
import StockHistoryView from './views/StockHistoryView.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { public: true },
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', redirect: { name: 'dashboard' } },
      { path: 'dashboard', name: 'dashboard', component: DashboardView },
      { path: 'shops', name: 'shops', component: ShopsView },
      { path: 'products', name: 'products', component: ProductsView },
      { path: 'products/new', name: 'product-create', component: ProductFormView },
      { path: 'products/:id/edit', name: 'product-edit', component: ProductFormView, props: true },
      { path: 'categories', name: 'categories', component: CategoriesView },
      { path: 'stock/add', name: 'stock-add', component: AddStockView },
      { path: 'stock/sell', name: 'stock-sell', component: SellProductView },
      { path: 'stock/history', name: 'stock-history', component: StockHistoryView },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('access_token');
  if (!to.meta.public && !token) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;



