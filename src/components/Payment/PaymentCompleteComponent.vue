<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useReservationStore } from '@/stores/reservation.js'
import { usePaymentStore } from '@/stores/payment'

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

const reservationStore = useReservationStore();
const paymentStore = usePaymentStore();

const isGuest = ref();

async function fetchReservation()
{
  await axios.get(`${import.meta.env.VITE_API_URL}`+`/api/payment/verify-token`, {
    params: { token }
  })
    .then(response => {
      reservationStore.id = response.data.reservation.id
      reservationStore.startDate = response.data.reservation.start_date
      reservationStore.endDate = response.data.reservation.end_date
      isGuest.value = response.data.is_guest
      axios.get(`${import.meta.env.VITE_API_URL}`+`/api/car/${response.data.reservation.car_id}`, {})
      .then(response => {
        reservationStore.dailyPrice =  response.data.price_per_day
      }).catch(error => {
        console.log(error)
      })
    })
    .catch(error => {
      console.error(error);
    });
}

onMounted(() => {
  fetchReservation()
  const payload = {
    mode : 'retry',
    reservationId :reservationStore.id,
    isGuest : isGuest.value,
    canPayLater: false,
  }
  paymentStore.openPayment(payload)
})

</script>

<template>
</template>

<style scoped>

</style>
