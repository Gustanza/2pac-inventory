<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md space-y-6">
      <h2 class="text-center text-2xl font-bold tracking-tight text-gray-900">
        Create your account
      </h2>

      <ErrorBanner v-if="error" :message="error" />

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <FormInput
          id="name"
          label="Name"
          type="text"
          autocomplete="name"
          v-model="name"
          required
        />

        <FormInput
          id="email"
          label="Email"
          type="email"
          autocomplete="email"
          v-model="email"
          required
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          autocomplete="new-password"
          v-model="password"
          required
        />

        <button
          type="submit"
          class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          <LoadingSpinner v-if="loading" class="mr-2" />
          <span>{{ loading ? 'Creating account...' : 'Register' }}</span>
        </button>
      </form>

      <p class="text-center text-sm text-gray-600">
        Already have an account?
        <button
          type="button"
          class="font-semibold text-indigo-600 hover:text-indigo-500"
          @click="goLogin"
        >
          Sign in
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

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  // Frontend-only simulation: do not actually call backend.
  // In a real app, this must be replaced with a real API request.
  loading.value = true;
  error.value = '';

  if (!name.value || !email.value || !password.value) {
    error.value = 'Please fill in all fields.';
    loading.value = false;
    return;
  }

  // Simulate "register then auto-login" by storing fake user + token.
  window.localStorage.setItem('auth_token', 'fake-dev-token');
  window.localStorage.setItem(
    'auth_user',
    JSON.stringify({ name: name.value, email: email.value })
  );

  loading.value = false;
  router.push({ name: 'shops' });
};

const goLogin = () => {
  router.push({ name: 'login' });
};
</script>


