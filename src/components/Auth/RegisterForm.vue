<script setup>
import {ref} from "vue";
import { useUserStore } from "@/stores/user.js";
import axios from "@/plugins/axios.js";
import { useRouter} from 'vue-router';
import { useAuthStore } from '@/stores/auth.js'

const registerData = ref({});
const errorValue = ref();
const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();

const emit = defineEmits(['login', 'forgotPassword']);

function onSubmit() {
  axios.post(`${import.meta.env.VITE_API_URL}` + '/api/register', registerData.value, {withCredentials: true})
    .then(function(response) {
      const token = response.data.access_token;
      const user = response.data.user;
      //save token to store
      userStore.setUser(user);
      authStore.setToken(token);
      router.replace('/user')
    }).catch(function(error){
    errorValue.value = error;
  })
}
</script>

<template>
  <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
        Sign up
      </h1>
      <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
        <div>
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Your Email</label>
          <input v-model="registerData.email" type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com" required="">
        </div>
        <div>
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
          <input v-model="registerData.password" type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required="">
        </div>
        <div>
          <label for="password_confirmation" class="block mb-2 text-sm font-medium text-gray-900">Password Confirmation</label>
          <input v-model="registerData.password_confirmation" type="password" name="password_confirmation" id="password_confirmation" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required="">
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800">
            </div>
            <div class="ml-3 text-sm">
              <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
            </div>
          </div>
          <a @click="emit('forgotPassword')" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
        </div>
        <button type="submit" class="w-full text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign Up</button>
        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
          Already have an account? <a @click="emit('loginForm')" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</a>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>
