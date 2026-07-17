<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useUserStore } from '@/stores/user.js';
import axios from 'axios';
import router from '@/router/index.js'
import { useNotify } from '@/composables/UseNotify.js'

const emit = defineEmits(['login', 'forgotPassword']);


const userStore = useUserStore();
const authStore = useAuthStore();
const {notify} = useNotify();

const registerData = ref({
  email: '',
  password: '',
  password_confirmation: ''
});

const touched = ref({
  email: false,
  password: false,
  password_confirmation: false
});


const emailError = computed(() => {
  if (!registerData.value.email) {
    return 'Email is required';
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(registerData.value.email)) {
    return 'Invalid email format';
  }

  return '';
});


const passwordError = computed(() => {
  if (!registerData.value.password) {
    return 'Password is required';
  }

  if (registerData.value.password.length < 8) {
    return 'Password must contain at least 8 characters';
  }

  return '';
});


const passwordConfirmationError = computed(() => {
  if (!registerData.value.password_confirmation) {
    return 'Password confirmation is required';
  }

  if (
    registerData.value.password !==
    registerData.value.password_confirmation
  ) {
    return 'Passwords do not match';
  }

  return '';
});


const isFormValid = computed(() => {
  return (
    !emailError.value &&
    !passwordError.value &&
    !passwordConfirmationError.value
  );
});


function onSubmit() {

  // oznacz wszystkie pola jako dotknięte
  touched.value.email = true;
  touched.value.password = true;
  touched.value.password_confirmation = true;

  if (!isFormValid.value) {
    return;
  }

  // tutaj Twój axios.post
    axios.post(`${import.meta.env.VITE_API_URL}` + '/api/register', registerData.value, {withCredentials: true})
      .then(function(response) {
        const token = response.data.access_token;
        const user = response.data.user;
        //save token to store
        userStore.setUser(user);
        authStore.setToken(token);
        router.replace('/user')
      }).catch(function(error){
      const errors = error.response.data.errors;
      Object.values(errors).forEach(messages => {
        messages.forEach(message => {
          notify(message, 'error');
        });
      });
    })
}

</script>

<template>
  <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
        Sign up
      </h1>

      <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">

        <!-- Email -->
        <div>
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900">
            Your Email
          </label>

          <input
            v-model="registerData.email"
            @blur="touched.email = true"
            type="email"
            name="email"
            id="email"
            placeholder="name@company.com"
            :class="[
              'bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5',
              touched.email && emailError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-primary-600 focus:border-primary-600'
            ]"
          >

          <p
            v-if="touched.email && emailError"
            class="mt-1 text-sm text-red-600"
          >
            {{ emailError }}
          </p>
        </div>


        <!-- Password -->
        <div>
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900">
            Password
          </label>

          <input
            v-model="registerData.password"
            @blur="touched.password = true"
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            :class="[
              'bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5',
              touched.password && passwordError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-primary-600 focus:border-primary-600'
            ]"
          >

          <p
            v-if="touched.password && passwordError"
            class="mt-1 text-sm text-red-600"
          >
            {{ passwordError }}
          </p>
        </div>


        <!-- Password confirmation -->
        <div>
          <label
            for="password_confirmation"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Password Confirmation
          </label>

          <input
            v-model="registerData.password_confirmation"
            @blur="touched.password_confirmation = true"
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            placeholder="••••••••"
            :class="[
              'bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5',
              touched.password_confirmation && passwordConfirmationError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-primary-600 focus:border-primary-600'
            ]"
          >

          <p
            v-if="touched.password_confirmation && passwordConfirmationError"
            class="mt-1 text-sm text-red-600"
          >
            {{ passwordConfirmationError }}
          </p>
        </div>


        <div class="flex items-center justify-between">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                class="w-4 h-4 border border-gray-300 rounded bg-gray-50"
              >
            </div>

            <div class="ml-3 text-sm">
              <label for="remember" class="text-gray-500">
                Remember me
              </label>
            </div>
          </div>

          <a
            @click="emit('forgotPassword')"
            class="text-sm font-medium text-primary-600 hover:underline cursor-pointer"
          >
            Forgot password?
          </a>
        </div>


        <button
          type="submit"
          :disabled="!isFormValid"
          :class="[
            'w-full text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center',
            !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
          ]"
        >
          Sign Up
        </button>


        <p class="text-sm font-light text-gray-500">
          Already have an account?
          <a
            @click="emit('loginForm')"
            class="font-medium text-primary-600 hover:underline cursor-pointer"
          >
            Sign in
          </a>
        </p>

      </form>
    </div>
  </div>
</template>

<style scoped>

</style>
