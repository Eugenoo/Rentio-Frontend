<template class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  Manufacturer: {{car.brand}}
  Model: {{car.model}}
  Registration Plates: {{car.registration_number}}
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  car: {
    type: Object,
    required: true,
  },
})

</script>

<style scoped>

</style>


<!--  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">-->
<!--    <div class="bg-white rounded-xl p-8 shadow-lg max-w-lg w-full">-->

