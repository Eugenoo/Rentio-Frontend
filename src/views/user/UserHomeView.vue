<template>
  <div class="flex flex-col pt-16 min-h-screen">
    <!-- Navbar -->
    <nav-bar></nav-bar>

    <!-- Content -->
    <div class="flex flex-1">
      <!-- Aside -->
      <aside-component
        v-if="user"
        class="fixed top-16 w-16 sm:w-48 shrink-0"
      ></aside-component>

      <!-- Main content -->
      <main class="flex-1 bg-gray-50 ml-12 sm:ml-64">
<!--        overflow-x-hidden-->
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import AsideComponent from '@/components/User/Navigation/asideComponent.vue'
import NavBar from '@/components/Navigation/NavBar.vue'
import { useUserStore } from '@/stores/user.js'

const user = useUserStore();
</script>

<style scoped>

</style>
