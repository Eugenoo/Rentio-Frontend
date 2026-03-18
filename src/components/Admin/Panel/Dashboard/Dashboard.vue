<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const data = ref({
  stats: {
    users: 0,
    cars: 0,
    active_reservations: 0,
    monthly_revenue: 0
  },
  latest_users: [],
  latest_reservations: []
})


const loading = ref(true)

async function fetchDashboard() {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}`+'/api/admin/dashboard',
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        }
      }
    )

    data.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboard)
</script>

<template>
  <div class="p-8 mt-4 md:mt-16 bg-gray-50 min-h-screen">

    <!-- HEADER -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <p class="text-gray-500 mt-1">Overview of your system</p>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-gray-500">
      Loading dashboard...
    </div>

    <div v-else class="space-y-8">

      <!-- 🔥 KPI CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <p class="text-sm text-gray-500">Total Users</p>
          <h2 class="text-3xl font-bold text-gray-800 mt-2">
            {{ data.stats.users }}
          </h2>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <p class="text-sm text-gray-500">Total Cars</p>
          <h2 class="text-3xl font-bold text-gray-800 mt-2">
            {{ data.stats.cars }}
          </h2>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <p class="text-sm text-gray-500">Active Reservations</p>
          <h2 class="text-3xl font-bold text-gray-800 mt-2">
            {{ data.stats.active_reservations }}
          </h2>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <p class="text-sm text-gray-500">Revenue (this month)</p>
          <h2 class="text-3xl font-bold text-green-600 mt-2">
            {{ data.stats.monthly_revenue }} zł
          </h2>
        </div>

      </div>

      <!-- 📋 TABLES -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <!-- Latest Users -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            Latest Users
          </h3>

          <div v-if="data.latest_users.length === 0" class="text-gray-400 text-sm">
            No users found
          </div>

          <div
            v-for="user in data.latest_users"
            :key="user.id"
            class="flex justify-between items-center py-2 border-b last:border-none"
          >
            <div>
              <p class="font-medium text-gray-800">
                {{ user.name }} {{ user.last_name }}
              </p>
              <p class="text-sm text-gray-500">
                {{ user.email }}
              </p>
            </div>

            <span
              class="text-xs px-2 py-1 rounded-full"
              :class="user.email_verified_at
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'"
            >
              {{ user.email_verified_at ? 'Verified' : 'Unverified' }}
            </span>
          </div>
        </div>

        <!-- Latest Reservations -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            Latest Reservations
          </h3>

          <div v-if="data.latest_reservations.length === 0" class="text-gray-400 text-sm">
            No reservations found
          </div>

          <div
            v-for="reservation in data.latest_reservations"
            :key="reservation.id"
            class="py-3 border-b last:border-none"
          >
            <p class="font-medium text-gray-800">
              {{
                reservation.user
                  ? reservation.user.name + ' ' + reservation.user.last_name
                  : reservation.guest_first_name + ' ' + reservation.guest_last_name
              }}
              →
              {{ reservation.car.brand }} {{ reservation.car.model }}
            </p>

            <p class="text-sm text-gray-500">
              {{ reservation.start_date }} - {{ reservation.end_date }}
            </p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
