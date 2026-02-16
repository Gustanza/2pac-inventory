<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md space-y-6">
      <h2 class="text-center text-2xl font-bold tracking-tight text-gray-900">
        Sign in to your account
      </h2>

      <ErrorBanner v-if="error" :message="error" />

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <FormInput
          id="email"
          label="Email"
          type="email"
          autocomplete="email"
          v-model="user.email"
          required
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          autocomplete="current-password"
          v-model="user.password"
          required
        />

        <button
          type="submit"
          class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          <LoadingSpinner v-if="loading" class="mr-2" />
          <span>{{ loading ? 'Signing in...' : 'Sign in' }}</span>
        </button>
      </form>

      <p class="text-center text-sm text-gray-600">
        Don't have an account?
        <button
          type="button"
          class="font-semibold text-indigo-600 hover:text-indigo-500"
          @click="goRegister"
        >
          Register
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FormInput from '../components/FormInput.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorBanner from '../components/ErrorBanner.vue';
import axiosClient from '../axiosClient';

const router = useRouter();

const user = ref({
  email: '',
  password: '',
  remember: true
});

const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  // Frontend-only simulation: do not actually call backend.
  // In a real app, this must be replaced with a real API request.
  loading.value = true;
  error.value = '';

  axiosClient.post('/login', user.value).then((response) => {
    sessionStorage.setItem('access_token', response.data.token);
    sessionStorage.setItem('current_user', JSON.stringify(response.data.user));
    loading.value = false;
    router.push({ name: 'dashboard' });
  }).catch((error) => {
    loading.value = false;
    error.value = 'Invalid credentials';
  });


};

const goRegister = () => {
  router.push({ name: 'register' });
};
</script>


