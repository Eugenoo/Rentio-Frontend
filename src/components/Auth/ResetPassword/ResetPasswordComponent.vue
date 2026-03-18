<script setup>

import { ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/plugins/axios'

const route = useRoute()

const token = route.params.token
const email = route.query.email

const password = ref('')
const password_confirmation = ref('')

async function onSubmit() {
  try {
    const response = await axios.post('/reset-password', {
      token,
      email,
      password: password.value,
      password_confirmation: password_confirmation.value
    });
    console.log(response.data.message);
    alert('Password successfully reset! You can now login.');
    // redirect do login
  } catch (error) {
    console.error(error.response?.data);
    alert('Something went wrong: ' + (error.response?.data?.message || error.message));
  }
}

</script>

<template>
  <section class="bg-gray-50 ">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Reset Your Password
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input v-model="password" type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required="">
            </div>
            <div>
              <label for="password_confirm" class="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
              <input v-model="password_confirmation" type="password" name="password_confirmation" id="password_confirmation" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " required="">
            </div>
            <button type="submit" class="w-full text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save new password</button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
