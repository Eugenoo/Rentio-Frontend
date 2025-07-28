<template>
  car details
  <div v-if="carRef">
    <h1>{{carRef.model}}</h1>
    <h2>{{carRef.slug}}</h2>
    <h1>{{carRef.brand}}</h1>
    <img :src="carRef.photo">
    price is {{carRef.price_per_day}} per day
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue"
import {useRoute} from 'vue-router'
import axios from 'axios'

const route = useRoute();

const carRef = ref();
onMounted(async () => {
  const carId = route.params.carName
  console.log(carId);
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/car/`+ carId ) // ${carId}
    carRef.value = res.data
  } catch (error) {
    console.error(error);
  }
})

</script>

<style scoped>

</style>
