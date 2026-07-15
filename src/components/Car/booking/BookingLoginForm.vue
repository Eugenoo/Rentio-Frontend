<template>
  <div class="fixed inset-0 z-75 flex items-center justify-center">
    <!-- overlay -->
    <div
      class="absolute inset-0 bg-black/50"
      @click="$emit('close')"
    ></div>
    <div class="relative z-80 bg-white p-6 rounded-xl w-full max-w-md">

      <div>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">
            Rent!
          </h2>
          <img src="/icons/close.png"
               @click="$emit('close')"
               class="h-5 cursor-pointer transition-transform duration-300 hover:rotate-90"
          />
        </div>
      </div>


      <div
        v-if="errorValue"
        class="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        {{errorValue.message}}
      </div>
      <form class="max-w-sm mx-auto p-5" @submit.prevent="onSubmit">
        <div class="mb-5">
          <label for="email" class="block mb-2.5 text-sm font-medium text-heading">Your email</label>
          <input v-model="loginData.email" type="email" id="email" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="email" required />
        </div>
        <div class="mb-5">
          <label for="password" class="block mb-2.5 text-sm font-medium text-heading">Your password</label>
          <input v-model="loginData.password" type="password" id="password" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="••••••••" required />
        </div>
        <div class="flex flex-col items-center gap-4 w-full">
          <button type="submit" class="text-white bg-blue-950 bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>

import axios from '@/plugins/axios.js'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useUserStore } from '@/stores/user.js'

const loginData = ref({});
const errorValue = ref();
const emit = defineEmits(['showConfirmation']);
const authStore = useAuthStore();
const userStore = useUserStore();

function onSubmit(){
  axios.post( import.meta.env.VITE_API_URL + '/api/login', loginData.value, {withCredentials: true})
    .then(function(response) {
      const token = response.data.access_token
      const user = response.data.user
      //save token to store
      authStore.setToken(token)
      userStore.setUser(user)
      emit('showConfirmation')
    }).catch(function(error){
    errorValue.value = error;
  })

}
</script>

<style scoped>

</style>
