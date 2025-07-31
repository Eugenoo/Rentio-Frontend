<template>
  <AdminNavBar></AdminNavBar>
  <admin-home></admin-home>
  <router-view></router-view>
</template>

<script setup>
import AdminHome from "@/components/Admin/AdminHome.vue";
import AdminNavBar from "@/components/Admin/AdminNavBar.vue";

</script>

<style scoped>

</style>
