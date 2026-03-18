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
          <p class="text-2xl text-gray-500 ">
              Upcoming Reservations:
          </p>
            <div class="relative overflow-x-auto bg-neutral-primary-soft rounded-2xl shadow-sm">
              <table class="w-full text-sm text-left rtl:text-right text-body">
                <tbody>
                <template
                  v-for="reservation in upcomingReservation"
                  :key="reservation.id"
                >

                  <!-- GŁÓWNY WIERSZ -->
                  <tr class="bg-white rounded-2xl">

                    <th class="px-2 py-2 font-medium text-heading whitespace-nowrap">
                      {{ reservation.car.brand }} {{ reservation.car.model }}
                    </th>

                    <td class="px-2 sm:px-6 py-4">
                      {{ reservation.start_date }}
                    </td>

                    <td class="px-2 sm:px-6 py-4">
                      {{ reservation.end_date }}
                    </td>

                    <!-- STRZAŁKA -->
                    <td class="px-2 sm:px-6 py-4 md:hidden">
                      <button @click="toggleAccordion(reservation.id)">
                        <svg
                          class="size-6 transition-transform duration-300"
                          :class="{ 'rotate-180': expandedRow === reservation.id }"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round"
                                d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                    </td>

                    <!-- DESKTOP -->
                    <td class="px-2 sm:px-6 py-4 hidden sm:table-cell">
                      {{ reservation.total_price }}
                    </td>

                    <td class="px-6 py-4 hidden sm:table-cell">
                      {{ reservation.status }}
                    </td>

                    <td class="px-6 py-4 hidden sm:table-cell">
                      Cancell
                    </td>

                    <td class="px-6 py-4 hidden sm:table-cell">
                      Contact
                    </td>

                    <td class="px-6 py-4 hidden sm:table-cell">
                    <span v-if="reservation.latest_payment">
                      <router-link to="payments">Paid</router-link>
                    </span>
                      <button
                        v-else
                        class="text-blue-600 hover:underline"
                        @click="showPaymentModal(reservation)"
                      >
                        Pay
                      </button>
                    </td>
                  </tr>
                  <!-- ROZWIJANY WIERSZ (MOBILE) -->
                  <tr
                    v-if="expandedRow === reservation.id"
                    class="bg-white sm:hidden"
                  >
                    <td colspan="100%" class="p-4">
                      <div class="space-y-2 text-sm">
                        <p><strong>Total:</strong> {{ reservation.total_price }}</p>
                        <p><strong>Status:</strong> {{ reservation.status }}</p>
                        <div>
                        <span v-if="reservation.latest_payment">
                          <router-link to="payments">Paid</router-link>
                        </span>
                          <button
                            v-else
                            class="text-blue-600"
                            @click="showPaymentModal(reservation)"
                          >
                            Pay
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
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

          <div class="relative overflow-x-auto bg-neutral-primary-soft shadow-sm rounded-2xl">
            <table class="w-full text-sm text-left rtl:text-right text-body">
              <tbody>

              <template
                v-for="reservation in newestReservations"
                :key="reservation.id"
              >

                <!-- GŁÓWNY WIERSZ -->
                <tr class="bg-white">

                  <th class="px-2 py-2 font-medium text-heading whitespace-nowrap">
                    {{ reservation.car.brand }} {{ reservation.car.model }}
                  </th>

                  <td class="px-2 sm:px-6 py-4">
                    {{ reservation.start_date }}
                  </td>

                  <td class="px-2 sm:px-6 py-4">
                    {{ reservation.end_date }}
                  </td>

                  <!-- STRZAŁKA (MOBILE) -->
                  <td class="px-2 sm:px-6 py-4 md:hidden">
                    <button @click="toggleAccordion(reservation.id)">
                      <svg
                        class="size-6 transition-transform duration-300"
                        :class="{ 'rotate-180': expandedRow === reservation.id }"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                  </td>

                  <!-- DESKTOP -->
                  <td class="px-2 sm:px-6 py-4 hidden sm:table-cell">
                    {{ reservation.total_price }}
                  </td>

                  <td class="px-6 py-4 hidden sm:table-cell">
                    {{ reservation.status }}
                  </td>

                  <td class="px-6 py-4 hidden sm:table-cell">
                    Cancell
                  </td>

                  <td class="px-6 py-4 hidden sm:table-cell">
                    Contact
                  </td>

                  <td class="px-6 py-4 hidden sm:table-cell">
            <span v-if="reservation.latest_payment">
              <router-link to="payments">Paid</router-link>
            </span>

                    <button
                      v-else
                      class="text-blue-600 hover:underline"
                      @click="showPaymentModal(reservation)"
                    >
                      Pay
                    </button>
                  </td>
                </tr>

                <!-- ROZWIJANY WIERSZ (MOBILE) -->
                <tr
                  v-if="expandedRow === reservation.id"
                  class="bg-white sm:hidden"
                >
                  <td colspan="100%" class="p-4">
                    <div class="space-y-2 text-sm">
                      <p><strong>Total:</strong> {{ reservation.total_price }}</p>
                      <p><strong>Status:</strong> {{ reservation.status }}</p>

                      <div>
                <span v-if="reservation.latest_payment">
                  <router-link to="payments">Paid</router-link>
                </span>

                        <button
                          v-else
                          class="text-blue-600"
                          @click="showPaymentModal(reservation)"
                        >
                          Pay
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>

              </template>

              </tbody>
            </table>
            <router-link to="reservations" class="font-medium">
              <div class="flex justify-center p-2 hover:bg-gray-100">
                  MORE
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
