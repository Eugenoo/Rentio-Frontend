<template>
  Hello World!
  <form @submit.prevent="onSubmit">
    <label>email</label>
    <input v-model="loginData.email"  placeholder="Email me" type="email" class="border rounded-xl">
    <br>
    <label>password</label>
    <input v-model="loginData.password" type="password" class="border rounded-xl">
    <br>
    <p class="text-red-500">{{errorValue}}</p>
    <button class="bg-blue-200 rounded-xl p-2" type="submit">Login</button>
  </form>

</template>

<script setup>
  import {ref} from "vue";
  import { useAuthStore } from "@/stores/auth.js";
  import api from "@/plugins/axios.js";
  import { useRouter} from 'vue-router';

  const loginData = ref({});
  const errorValue = ref();
  const router = useRouter();
  const authStore = useAuthStore();

  function onSubmit() {
    api.post('login', loginData.value)
    .then(function(response) {
      const token = response.data.access_token;
      //save token to store
      authStore.setToken(token);
      router.push('/panel');
    }).catch(function(error){
      console.log(error);
      errorValue.value = error;
    })




    // axios.post('http://127.0.0.1:8000/api/login', loginData.value)
    // .then(function(response) {
    //   console.log(response.data.access_token);
    //
    //   //here we need to implement login logic that state token localy and maybe in store.
    //   //reroute user to admin panel
    //   router.push('/panel');
    // }).catch(function(error){
    //   errorValue.value = error
    // })

  }
</script>

<style scoped>

</style>
