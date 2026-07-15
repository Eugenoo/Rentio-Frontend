<template>
  <section class="bg-gray-50 min-h-[calc(100vh-4rem)] items-center justify-center mt-16">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
      <login-form v-if="mode === 'login'" @register="showRegister" @forgotPassword="showForgotPassword"/>
      <register-form v-else-if="mode === 'register'" @loginForm="showLogin" @forgotPassword="showForgotPassword"/>
      <forgot-password-form v-else-if="mode === 'forgotPassword'" @register="showRegister" />
    </div>
  </section>
</template>

<script setup  lang="ts">
  import {ref} from "vue";
  import LoginForm from '@/components/Auth/LoginForm.vue'
  import RegisterForm from '@/components/Auth/RegisterForm.vue'
  import ForgotPasswordForm from '@/components/Auth/ForgotPasswordForm.vue'

  const mode = ref<'login' | 'register' | 'forgotPassword'>('login');

  function showLogin() {
    mode.value = 'login';
  }

  function showRegister() {
    mode.value = 'register';
  }

  function showForgotPassword() {
    mode.value = 'forgotPassword';
  }
</script>

<style scoped>

</style>
