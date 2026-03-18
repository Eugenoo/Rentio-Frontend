<template>
  <div class="fixed top-18 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 items-center">
    <div
      v-for="n in notifications"
      :key="n.id"
      :class="[
        'px-4 py-3 rounded-lg text-white font-medium shadow-md',
        n.type === 'success' && 'bg-green-500',
        n.type === 'error' && 'bg-red-500',
        n.type === 'warning' && 'bg-yellow-500'
      ]"
    >
      {{ n.message }}
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notification'

const store = useNotificationStore()
const { notifications } = storeToRefs(store)
</script>

<style>

</style>
