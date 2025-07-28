<template>
  <main>
    <div class="h-screen">
      <CarComponent v-for="car in cars" :key="car.id" :car="car" ></CarComponent>
    </div>
  </main>
</template>


<script setup>
import CarComponent from "@/components/CarComponent.vue";
import { onMounted } from 'vue'
import axios from 'axios'
import { ref } from 'vue'

const cars = ref();

onMounted(async() => {

  try {
    const res = await axios.get('http://127.0.0.1:8000/api/car')
    cars.value = res.data
    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
})

</script>
