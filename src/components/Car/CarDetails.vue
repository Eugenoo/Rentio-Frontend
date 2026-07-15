<template>
  <div class="mt-16 min-h-[calc(100dvh-4rem)] flex flex-col">
      <div id="backButton" class="p-6">
        <img src="/icons/back.png" @click="goBack()" class="h-8 cursor-pointer"/>
      </div>

    <div v-if="carRef" class="flex-1 flex flex-col justify-center items-center text-center px-10">
      <h1 class="font-extrabold text-5xl italic">{{carRef.model}}</h1>
      <h1 class="font text-2xl italic">{{carRef.brand}}</h1>
      <img :src="carRef.photo" class="max-h-[40vh] object-contain">
      <div class="flex items-center justify-center">
        <p class="font-extrabold text-3xl italic m-2">{{parseFloat(carRef.price_per_day)}}</p>
        <p>PLN / DAY</p>
      </div>

    </div>
    <div id="buttons" class="justify-center items-center flex mt-auto">
      <button @click="isOpenCallendar()" class="rounded-xl p-5 bg-white px-10 m-10 gradient-border">
        <p class="font-bold italic">RENT!</p>
      </button>
      <img src="/icons/info.png" @click="isOpenInfo()" class="h-6"/>
    </div>
  </div>


  <!-- Modal overlay -->
  <div
    v-if="popup"
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <!-- szare tlo modala -->
    <div class="absolute inset-0 bg-white/50" @click="isClosed()"></div>
    <!-- Modal content -->
    <div class="bg-white p-6 rounded shadow-lg relative z-10">

      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">
          Rent!
        </h2>

        <img src="/icons/close.png"
          @click="isClosed()"
          class="h-5 cursor-pointer transition-transform duration-300 hover:rotate-90"
        />
      </div>


      <!--   bind daily price   -->
      <!-- Calendar -->
      <CalendarComponent v-if="modal.callendar" :daily-price="carRef.price_per_day"></CalendarComponent>
      <!-- Product Info -->
      <ProductInfoComponent v-if="modal.info && carRef" :car="carRef"></ProductInfoComponent>
      <!-- Close Button -->
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue"
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import ProductInfoComponent from '@/components/Car/popup/ProductInfoComponent.vue'
import CalendarComponent from '@/components/Car/popup/CalendarComponent.vue'
import { useReservationStore } from '@/stores/reservation.js'
import AnimatedBorder from '@/components/ui/Button/AnimatedBorder.vue'

const route = useRoute();
const router = useRouter();

const popup = ref();
const modal = ref({
  callendar: false,
  info: false,
});


const reservationStore = useReservationStore();


const carRef = ref();

onMounted(async () => {
  const carId = route.params.carName
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}`+`/api/car/`+ carId ) // ${carId}
    carRef.value = res.data
    reservationStore.car = carRef.value.id
  } catch (error) {
    console.error(error);
  }
})


function goBack(){
  router.back()
}

function isOpenCallendar(){
  popup.value = true;
  modal.value.callendar = true;
  modal.value.info = false;
}

function isOpenInfo(){
  popup.value = true;
  modal.value.info = true;
  modal.value.callendar = false;
}

function isClosed()
{
  popup.value = false;
}

</script>

<style scoped>
.gradient-border {
  position: relative;
  padding: 12px 40px;
  border-radius: 50px;
  background: white;
  border: 2px solid transparent;
}

/* Gradient border */
.gradient-border::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 4px;
  border-radius: inherit;
  background: linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6);
  background-size: 300% 300%;
  animation: gradientMove 4s linear infinite;

  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;

  pointer-events: none;
  transition: background 0.4s ease;
}

/* HOVER – zmiana gradientu */
.gradient-border:hover::before {
  background: linear-gradient(90deg, #22c55e, #06b6d4, #3b82f6);
  background-size: 300% 300%;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}
</style>
