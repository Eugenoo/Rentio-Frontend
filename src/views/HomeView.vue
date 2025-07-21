<template>
  <main>
    <div class="h-screen">
      <CarComponent v-for="car in cars" :key="car.id" :car="car" ></CarComponent>
    </div>
  </main>
</template>


<script setup>
import CarComponent from "@/components/CarComponent.vue";



const cars = [
    { id:1, brand: 'Hyundai', model: 'Ioniq 5', slug: 'ioniq-5', current: true, route: '/' },
    { id:2, brand: 'Hyundai', model: 'Santa Fe', slug: 'santa-fe', current: true, route: '/' },
    { id:3, brand: 'Hyundai', model: 'Ioniq 6', slug: 'ioniq-6', current: true, route: '/' },
  ]
</script>
