<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div class="bg-gray-50 ml-6 mt-4 md:mt-16 p-5 sm:ml-0">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Reservations</h1>
      <p class="text-gray-500 mt-1">Manage Reservations</p>
    </div>
    <div class="relative overflow-x-auto bg-neutral-primary-soft shadow-sm rounded-2xl">

    <table class="w-full text-sm text-left text-gray-500">

      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th class="px-6 py-3">Paid</th>
        <th class="px-6 py-3">ID</th>
        <th class="px-6 py-3 hidden sm:table-cell">User</th>
        <th class="px-6 py-3 hidden sm:table-cell">Car</th>
        <th class="px-6 py-3 hidden sm:table-cell">Start</th>
        <th class="px-6 py-3 hidden sm:table-cell">End</th>
        <th class="px-6 py-3 hidden sm:table-cell">Price</th>
        <th class="px-6 py-3 hidden sm:table-cell">Time</th>
        <th class="px-6 py-3">Status</th>
        <th class="px-6 py-3 hidden sm:table-cell">Action</th>
      </tr>
      </thead>

      <tbody>

      <template v-for="reservation in reservations" :key="reservation.id">

        <!-- MAIN ROW -->
        <tr class="bg-white hover:bg-gray-100">

          <!-- PAYMENT -->
          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            <div class="flex items-center gap-2">

              <img
                v-if="reservation.payment?.status"
                :src="statusIconMap[reservation.payment.status]"
                :alt="reservation.payment.status"
                class="h-4 w-auto"
              >

              <img
                v-else
                src="/icons/notPaid.png"
                alt="No payment"
                class="h-4 w-auto"
              >

              {{ reservation.payment?.status || 'No Payment' }}

            </div>
          </td>

          <!-- ID -->
          <td class="px-6 py-4">
            {{ reservation.id }}
          </td>

          <!-- USER -->
          <td class="px-6 py-4 hidden sm:table-cell">
            {{ reservation.display_name }}
          </td>

          <!-- CAR -->
          <td class="px-6 py-4 hidden sm:table-cell">
            {{ reservation.car ? `${reservation.car.brand} ${reservation.car.model}` : '-' }}
          </td>

          <!-- START -->
          <td class="px-6 py-4 hidden sm:table-cell">
            {{ reservation.start_date }}
          </td>

          <!-- END -->
          <td class="px-6 py-4 hidden sm:table-cell">
            {{ reservation.end_date }}
          </td>

          <!-- PRICE -->
          <td class="px-6 py-4 hidden sm:table-cell">
            ${{ reservation.total_price }}
          </td>

          <td class="px-6 py-4 hidden sm:table-cell">
            created_at
          </td>

          <!-- STATUS -->
          <td class="px-6 py-4">
            <span class="px-2 py-1 text-xs rounded-lg bg-gray-100 text-gray-700">
              {{ reservation.status }}
            </span>
          </td>

          <!-- ACTION DESKTOP -->
          <td class="px-6 py-4 hidden sm:table-cell">
            <button
              @click="editInfo(reservation)"
              class="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
            >
              Edit
            </button>
          </td>

          <!-- MOBILE ARROW -->
          <td class="px-6 py-4 sm:hidden flex justify-center">
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
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
              </svg>
            </button>
          </td>

        </tr>

        <!-- MOBILE EXPANDED -->
        <tr v-if="expandedRow === reservation.id" class="bg-white sm:hidden">
          <td colspan="100%" class="p-4">

            <div class="space-y-2 text-sm">

              <p><strong>User:</strong> {{ reservation.display_name }}</p>

              <p>
                <strong>Car:</strong>
                {{ reservation.car ? `${reservation.car.brand} ${reservation.car.model}` : '-' }}
              </p>

              <p><strong>Start:</strong> {{ reservation.start_date }}</p>

              <p><strong>End:</strong> {{ reservation.end_date }}</p>

              <p><strong>Total Price:</strong> ${{ reservation.total_price }}</p>

              <div class="flex gap-2 pt-2">

                <button
                  @click="editInfo(reservation)"
                  class="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm"
                >
                  Edit Status
                </button>

              </div>

            </div>

          </td>
        </tr>

      </template>

      </tbody>

    </table>
    </div>

    <EditInfoModal
      v-if="editReservation"
      :reservation="editReservation"
      @close="closeEditInfoModal"
      @update="updateReservations"
    />

  </div>
</template>
<style scoped></style>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import EditInfoModal from './EditInfoModal.vue'
import { useAuthStore } from '@/stores/auth.js'

const reservations = ref([])
const loading = ref(false)
const error = ref(null)
const authStore = useAuthStore()
const editReservation = ref(null)

function updateReservations() {
  axios
    .get(`${import.meta.env.VITE_API_URL}`+'/api/reservation', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    })
    .then((res) => {
      reservations.value = res.data.data
    })
    .catch((error) => {
      console.log(error)
    })
}

onMounted(async () => {
  updateReservations()
})

function editInfo(reservation) {
  editReservation.value = {
    ...reservation,

    user_id : reservation.user?.id ?? null,

    car_id : reservation.car?.id ?? null,
  }
}

function closeEditInfoModal() {
  editReservation.value = null
}

//temporary icons handler
const statusIconMap = {
  pending: '/icons/load.png',
  paid: '/icons/paid.png',
  failed: '/icons/failed.png',
}

//table accordion
const expandedRow = ref(null)

const toggleAccordion = (id) => {
  console.log(id)
  expandedRow.value = expandedRow.value === id ? null : id
}
</script>
