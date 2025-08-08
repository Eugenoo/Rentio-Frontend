<template>
  <div id="backButton">
    <button @click="goBack()" class="p-6 bg-red-400 rounded-xl m-6">BACK</button>
  </div>
  <div v-if="carRef" class="p-10">
    <h1>{{carRef.model}}</h1>
    <h1>{{carRef.brand}}</h1>
    <h1>Info</h1>
    <img :src="carRef.photo">
    price is {{carRef.price_per_day}} per day
  </div>
  <div id="buttons" class="justify-center items-center flex">
    <button @click="isOpenCallendar()" class="rounded-xl p-5 bg-green-800 text-white px-10 m-10">RENT!</button>
    <button @click="isOpenInfo()" class="rounded-xl p-5 bg-green-800 text-white">Product !nfo</button>
  </div>

  <ProductInfoComponent class="absolute" >Widoczny po kliknieciu Product Info</ProductInfoComponent>
  <div
    v-if="popup"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <!-- Modal content -->
    <div class="bg-white p-6 rounded shadow-lg max-w-md w-full">
      <h2 class="text-xl font-semibold mb-4">Rent!</h2>

      <CallendarComponent v-if="popup.callendar" ></CallendarComponent>
      <CarInfoComponent v-if="popup.info"></CarInfoComponent>
      <br>
      <button @click="isClosed()" class="bg-red-500 text-white px-4 py-2 rounded">
        Close
      </button>
    </div>
  </div>
  <div
    v-if="popup"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <!-- Modal content -->
    <div class="bg-white p-6 rounded shadow-lg max-w-md w-full">
      <h2 class="text-xl font-semibold mb-4">Rent!</h2>
      <CallendarComponent></CallendarComponent>
      <br>
      <button @click="isClosed()" class="bg-red-500 text-white px-4 py-2 rounded">
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue"
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import ProductInfoComponent from '@/components/Car/ProductInfoComponent.vue'
import CallendarComponent from '@/components/Car/popup/CalendarComponent.vue'

const route = useRoute();
const router = useRouter();

const popup = ref();
const modal = ref(

);

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

function goBack(){
  router.back()
}

function isOpenCallendar(){
  popup.value = true;
  //popup.value.callendar = true;
}

function isOpenInfo(){
  popup.value = true;
  modal.info = true;
}



function isClosed()
{
  popup.value = false;
}
</script>

<style scoped>

</style>
