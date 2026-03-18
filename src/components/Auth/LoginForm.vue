<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.js'
import axios from '@/plugins/axios.js'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const loginData = ref({})
const errorValue = ref()
const router = useRouter()

const userStore = useUserStore()
const authStore = useAuthStore()

function onSubmit() {
  axios
    .post(`${import.meta.env.VITE_API_URL}`+`/api/login`, loginData.value, { withCredentials: true })
    .then(function (response) {
      const token = response.data.access_token
      const user = response.data.user

      //save token to store
      authStore.setToken(token)
      userStore.setUser(user)

      switch (user.role) {
        case 'admin':
          router.push('/admin/dashboard') // ścieżka dla admina
          break
        case 'user':
          if (user.name === null) {
            router.push('/user/completeProfile');
            break
          }
          router.push('/user') // ścieżka dla zwykłego usera
          break
        default:
          console.warn('Unknown role, redirecting to home')
          router.push('/') // fallback
      }
    })
    .catch(function (error) {
      console.log(error)
      errorValue.value = error.response.data
      console.log(error.response.data)
    })
}
</script>

<template>
  <div
    class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0"
  >
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl "
      >
        Sign in to your account
      </h1>
      <!--  Error    -->
      <div
        v-if="errorValue"
        class="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        {{errorValue.message}}
      </div>
      <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
        <div>
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900"
            >Your email</label
          >
          <input
            v-model="loginData.email"
            type="email"
            name="email"
            id="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="name@company.com"
            required=""
          />
        </div>
        <div>
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 "
            >Password</label
          >
          <input
            v-model="loginData.password"
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
            required=""
          />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                v-model="loginData.remember"
                aria-describedby="remember"
                type="checkbox"
                class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="remember" class="text-gray-500 ">Remember me</label>
            </div>
          </div>
          <a
            @click="$emit('forgotPassword')"
            class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
            >Forgot password?</a
          >
        </div>
        <button
          type="submit"
          class="w-full cursor-pointer bg-blue-800 text-white hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Sign in
        </button>
        <p class="text-sm font-light text-gray-500">
          Don’t have an account yet?
          <a
            @click="$emit('register')"
            class="font-medium text-primary-600 hover:underline"
            >Sign up</a
          >
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
