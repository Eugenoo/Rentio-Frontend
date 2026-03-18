<script setup>


import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'
import PaymentModal from '@/components/Payment/PaymentModal.vue'
import { useReservationStore } from '@/stores/reservation.js'

const upcomingReservation = ref([]);
const pastReservation = ref([]);
const authStore = useAuthStore();

async function fetchReservation() {
  fetchUpcomingReservations();
  fetchPastReservations();
}

async function fetchUpcomingReservations() {
  const response = await axios.get(import.meta.env.VITE_API_URL+"/api/reservations/my",
    {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      },
      params: {
        type: 'future',
      }
    }
  );
  upcomingReservation.value = response.data.data;
}

async function fetchPastReservations() {
  const response = await axios.get(import.meta.env.VITE_API_URL+"/api/reservations/my",
    {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      },
      params: {
        type: 'history',
      }
    }
  );
  pastReservation.value = response.data.data;
}

const paymentModal = ref(false);
const reservationStore = useReservationStore();

async function showPaymentModal(reservation) {
  reservationStore.id = reservation.id;
  reservationStore.endDate = reservation.end_date;
  reservationStore.startDate = reservation.start_date;
  await axios.get(import.meta.env.VITE_API_URL+`/api/car/${reservation.car.id}`)
    .then(res => {
      reservationStore.dailyPrice = res.data.price_per_day;
    }).catch(err => {
      console.log(err);
    })
  paymentModal.value = true;
}

onMounted(() => {
  fetchReservation();
})

const expandedRow = ref(null)

const toggleAccordion = (id) => {
  expandedRow.value = expandedRow.value === id ? null : id
}
</script>

<template>
  <div class="p-4">
    <div class="p-4 rounded-lg ">
      <!-- ================= UPCOMING ================= -->
      <div class="mb-6 rounded-sm bg-gray-50">
        <p class="text-2xl text-gray-500 mb-2">
          Upcoming Reservations:
        </p>
        <div class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-2xl">
          <table class="w-full text-sm text-left text-body">
            <tbody>

            <template
              v-for="reservation in upcomingReservation"
              :key="'upcoming-' + reservation.id"
            >
              <!-- GŁÓWNY WIERSZ -->
              <tr class="bg-white">

                <th class="px-2 py-3 font-medium text-heading whitespace-nowrap">
                  {{ reservation.car.brand }} {{ reservation.car.model }}
                </th>

                <td class="px-2 sm:px-6 py-4">
                  {{ reservation.start_date }}
                </td>

                <td class="px-2 sm:px-6 py-4">
                  {{ reservation.end_date }}
                </td>

                <!-- MOBILE ARROW -->
                <td class="px-2 py-4 sm:hidden">
                  <button @click="toggleAccordion(reservation.id)">
                    <svg
                      class="size-6 transition-transform duration-300"
                      :class="{ 'rotate-180': expandedRow === reservation.id }"
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
                <td class="hidden sm:table-cell px-6 py-4">
                  {{ reservation.total_price }}
                </td>

                <td class="hidden sm:table-cell px-6 py-4">
                  {{ reservation.status }}
                </td>

                <td class="hidden sm:table-cell px-6 py-4">
                  Cancel
                </td>

                <td class="hidden sm:table-cell px-6 py-4">
                  Contact
                </td>

                <td class="hidden sm:table-cell px-6 py-4">
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

              <!-- ROZWIJANY MOBILE -->
              <tr v-if="expandedRow === reservation.id" class="sm:hidden bg-white">
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
        </div>
      </div>


      <!-- ================= HISTORY ================= -->
      <div class="rounded-sm bg-gray-50">
        <p class="text-2xl text-gray-500 mb-2">
          History:
        </p>

        <div class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-2xl">
          <table class="w-full text-sm text-left text-body">
            <tbody>

            <template
              v-for="reservation in pastReservation"
              :key="'history-' + reservation.id"
            >
              <!-- GŁÓWNY WIERSZ -->
              <tr class="bg-white">

                <th class="px-2 py-3 font-medium text-heading whitespace-nowrap">
                  {{ reservation.car.brand }} {{ reservation.car.model }}
                </th>

                <td class="px-2 sm:px-6 py-4">
                  {{ reservation.start_date }}
                </td>

                <td class="px-2 sm:px-6 py-4">
                  {{ reservation.end_date }}
                </td>

                <!-- MOBILE -->
                <td class="px-2 py-4 sm:hidden">
                  <button @click="toggleAccordion(reservation.id)">
                    <svg
                      class="size-6 transition-transform duration-300"
                      :class="{ 'rotate-180': expandedRow === reservation.id }"
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
                <td class="hidden sm:table-cell px-6 py-4">
                  {{ reservation.total_price }}
                </td>

                <td class="hidden sm:table-cell px-6 py-4">
                  {{ reservation.status }}
                </td>

                <td class="hidden sm:table-cell px-6 py-4">
                  Cancel
                </td>

                <td class="hidden sm:table-cell px-6 py-4">
                  Contact
                </td>

                <td class="hidden sm:table-cell px-6 py-4">
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

              <!-- ROZWIJANY MOBILE -->
              <tr v-if="expandedRow === reservation.id" class="sm:hidden bg-white">
                <td colspan="100%" class="p-4">
                  <div class="space-y-2 text-sm">
                    <p><strong>Total:</strong> {{ reservation.total_price }}</p>
                    <p><strong>Status:</strong> {{ reservation.status }}</p>
                  </div>
                </td>
              </tr>

            </template>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <PaymentModal v-if="paymentModal" />
  </div>
</template>

<style scoped>

</style>
