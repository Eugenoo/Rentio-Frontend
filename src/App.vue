<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import Notification from '@/components/Notification/Notification.vue'
import PaymentModal from '@/components/Payment/PaymentModal.vue'


onMounted(() => {
  useAuthStore().initAuth()
})
</script>

<template>
  <RouterView />
  <Notification />
  <PaymentModal />
</template>

<style scoped>

</style>
