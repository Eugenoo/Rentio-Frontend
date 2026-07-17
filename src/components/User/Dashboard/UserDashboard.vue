<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'
import { useReservationStore } from '@/stores/reservation.js'
import { usePaymentStore } from '@/stores/payment.js'

const upcomingReservation = ref();
  const newestReservations = ref([]);
  const auth = useAuthStore();
  const paymentStore = usePaymentStore();

  onMounted(() => {
    fetchReservations();
  })

  async function fetchReservations() {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/api/reservations/my",
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`
          },
          params: {
              type: 'future', // lub 'future', 'history', 'newest'
              limit: 3
          }
        }
      );
      const newest = await axios.get(import.meta.env.VITE_API_URL + "/api/reservations/my",
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`
          },
          params: {
            type: 'newest',
            limit: 3,
          }
        })
      upcomingReservation.value = response.data.data;
      newestReservations.value= newest.data.data;
    }

  const reservationStore = useReservationStore();

  async function showPaymentModal(reservation) {
    reservationStore.endDate = reservation.end_date;
    reservationStore.startDate = reservation.start_date;
    const payload = {
      mode: 'retry',
      reservationId: reservation.id,
      isGuest: false,
      canPayLater: false,
    }
    await axios.get(import.meta.env.VITE_API_URL+`/api/car/${reservation.car.id}`)
      .then(res => {
        reservationStore.dailyPrice = res.data.price_per_day;
      }).catch(err => {
        console.log(err);
      })
    paymentStore.openPayment(payload)
  }

//Table accordion
const expandedRow = ref(null)

const toggleAccordion = (id) => {
    console.log(id)
  expandedRow.value = expandedRow.value === id ? null : id
}

</script>

<template>
  <section class="sm:px-6 lg:px-8">
    <div class="max-w-7xl">
      <div class="p-4 rounded-lg ">
        <div class="items-center justify-center mb-4 rounded-sm bg-gray-50">
          <p class="text-2xl text-gray-500">
            Upcoming Reservations:
          </p>

          <!-- BRAK REZERWACJI -->
          <div
            v-if="!upcomingReservation || upcomingReservation.length === 0"
            class="flex flex-col items-center justify-center py-10 text-center"
          >
            <p class="text-xl text-gray-500 mb-2">
              It’s a bit empty here 👀
            </p>

            <p class="text-gray-400 mb-4">
              Book a car and your upcoming reservations will appear here.
            </p>
            <router-link
              to="/"
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Book Now
            </router-link>
          </div>

          <!-- LISTA REZERWACJI -->
          <div
            v-else
            class="relative overflow-x-auto bg-neutral-primary-soft rounded-2xl shadow-sm"
          >
            <table class="w-full text-sm text-left rtl:text-right text-body">
              <tbody>
              <template
                v-for="reservation in upcomingReservation"
                :key="reservation.id"
              >
                <!-- tutaj zostaje cała Twoja obecna tabela -->
              </template>
              </tbody>
            </table>

            <router-link to="reservations" class="font-medium">
              <div class="flex justify-center p-2 hover:bg-gray-100">
        <span>
          MORE
        </span>
              </div>
            </router-link>
          </div>
        </div>
        <div class="items-center justify-center border-dashed mb-4 rounded-sm bg-gray-50">
          <p class="text-2xl text-gray-400 dark:text-gray-500">
            Newest Reservations:
          </p>

          <!-- BRAK REZERWACJI -->
          <div
            v-if="!newestReservations || newestReservations.length === 0"
            class="flex flex-col items-center justify-center py-10 text-center"
          >

          </div>

          <!-- LISTA REZERWACJI -->
          <div
            v-else
            class="relative overflow-x-auto bg-neutral-primary-soft shadow-sm rounded-2xl"
          >
            <table class="w-full text-sm text-left rtl:text-right text-body">
              <tbody>

              <template
                v-for="reservation in newestReservations"
                :key="reservation.id"
              >

              </template>

              </tbody>
            </table>

            <router-link to="reservations" class="font-medium">
              <div class="flex justify-center p-2 hover:bg-gray-100">
                MORE
              </div>
            </router-link>
          </div>
        </div>      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
