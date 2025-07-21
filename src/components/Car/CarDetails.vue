<template>
  car details
  <div v-if="car">
    <h1>{{car.model}}</h1>
    <h1>{{car.brand}}</h1>
    <img :src="car.photo">
    price is {{car.price_per_day}} per day
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue"
import {useRoute} from 'vue-router'
import axios from 'axios'

const car = ref();

onMounted(async () => {
  //const carId = route.params.carName

  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/car/8`) // ${carId}
    car.value = res.data
  } catch (error) {
    console.error(error);
  }
})

</script>

<style scoped>

</style>
