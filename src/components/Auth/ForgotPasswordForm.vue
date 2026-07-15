<script setup>
import {ref, defineEmits} from "vue";
import axios from "@/plugins/axios.js";
import { useNotify } from '@/composables/UseNotify.js'


const loginData = ref({});
const errorValue = ref();

const {notify} = useNotify();

const emit = defineEmits(['register']);
const showModal = ref(false);

function showPasswordResetModal()
{
  showModal.value = true;
}

function onSubmit() {
  showPasswordResetModal();
  axios.post(`${import.meta.env.VITE_API_URL}`+'/api/password-reset', loginData.value, {withCredentials: true})
    .then(() => {
      notify('an email has been send, check and follow instructions', 'success')
    }).catch(function(error){
      errorValue.value = error;
      notify('an error has occurred: '+ error, 'error')
  })
}
</script>

<template>
  <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
        Forgot Password?
      </h1>
      <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
        <div>
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
          <input v-model="loginData.email" type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com" required="">
        </div>
        <button type="submit" class="w-full text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Reset Password</button>
        <p class="text-sm font-light text-gray-500">
          Don’t have an account yet? <a @click="emit('register')" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sing Up</a>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>
