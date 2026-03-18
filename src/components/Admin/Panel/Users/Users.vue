<template>
  <div class="bg-gray-50 ml-6 mt-4 md:mt-16 p-5 sm:ml-0">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Users</h1>
      <p class="text-gray-500 mt-1">Users of your system</p>
    </div>
    <div class="relative overflow-x-auto bg-neutral-primary-soft shadow-sm rounded-2xl">
      <table class="w-full text-sm text-left text-gray-500">

        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th class="px-6 py-3">Name</th>
          <th class="px-6 py-3">Last Name</th>
          <th class="px-6 py-3 hidden sm:table-cell">Email</th>
          <th class="px-6 py-3 hidden sm:table-cell">Verified</th>
          <th class="px-6 py-3 hidden sm:table-cell">Phone</th>
          <th class="px-6 py-3 hidden sm:table-cell">Created At</th>
          <th class="px-6 py-3">Action</th>
        </tr>
        </thead>

        <tbody>

        <template v-for="user in users" :key="user.id">

          <!-- GŁÓWNY WIERSZ -->
          <tr class="bg-white">

            <th class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              {{ user.name }}
            </th>

            <td class="px-6 py-4">
              {{ user.last_name }}
            </td>

            <td class="px-6 py-4 hidden sm:table-cell">
              {{ user.email }}
            </td>

            <td class="px-6 py-4 hidden sm:table-cell">
            <span
              :class="user.email_verified_at
                ? 'text-green-600 font-medium'
                : 'text-red-600 font-medium'"
            >
              {{ user.email_verified_at ? '✔ Tak' : '✖ Nie' }}
            </span>
            </td>

            <td class="px-6 py-4 hidden sm:table-cell">
              {{ user.phone || '-' }}
            </td>

            <td class="px-6 py-4 hidden sm:table-cell">
              {{ formatDate(user.created_at) }}
            </td>

            <!-- ACTION (DESKTOP) -->
            <td class="px-6 py-4 hidden sm:table-cell space-x-2">
              <button
                @click="showEditModal(user)"
                class="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
              >
                Edit
              </button>

              <button
                @click="showDeleteModal(user)"
                class="px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition"
              >
                Delete
              </button>
            </td>

            <!-- STRZAŁKA (MOBILE) -->
            <td class="px-6 py-4 md:hidden flex justify-center">
              <button @click="toggleAccordion(user.id)">
                <svg
                  class="size-6 transition-transform duration-300"
                  :class="{ 'rotate-180': expandedRow === user.id }"
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

          </tr>

          <!-- ROZWIJANY WIERSZ (MOBILE) -->
          <tr v-if="expandedRow === user.id" class="bg-white md:hidden">
            <td colspan="100%" class="p-4">
              <div class="space-y-2 text-sm">

                <p><strong>Email:</strong> {{ user.email }}</p>

                <p>
                  <strong>Verified:</strong>
                  <span
                    :class="user.email_verified_at
                    ? 'text-green-600'
                    : 'text-red-600'"
                  >
                  {{ user.email_verified_at ? 'Tak' : 'Nie' }}
                </span>
                </p>

                <p><strong>Phone:</strong> {{ user.phone || '-' }}</p>

                <p><strong>Created:</strong> {{ formatDate(user.created_at) }}</p>

                <div class="flex gap-2 pt-2">
                  <button
                    @click="showEditModal(user)"
                    class="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm"
                  >
                    Edit
                  </button>

                  <button
                    @click="showDeleteModal(user)"
                    class="px-3 py-1 rounded-lg bg-red-600 text-white text-sm"
                  >
                    Delete
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
  <DeleteUser
  v-if="deleteUser"
  :deleteUser=deleteUser
  @close="deleteUser = null"
  @delete="fetchUsers"
  >
  </DeleteUser>
  <EditUser
  v-if="editUser"
  :editUser="editUser"
  @close="editUser = null"
  @update="fetchUsers"
  >
  </EditUser>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'
import DeleteUser from '@/components/Admin/Panel/Users/Modal/DeleteUser.vue'
import EditUser from '@/components/Admin/Panel/Users/Modal/EditUser.vue'

const authStore = useAuthStore()
const users = ref([])
const deleteUser = ref(false);
const editUser = ref(false);

function showEditModal(userId) {
  editUser.value = { ...userId };
}

function showDeleteModal(userId) {
  deleteUser.value = { ...userId };
}


function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

async function fetchUsers() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}`+'/api/user', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    users.value = res.data.data
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchUsers()
})

//table accordion
const expandedRow = ref(null)

const toggleAccordion = (id) => {
  console.log(id)
  expandedRow.value = expandedRow.value === id ? null : id
}
</script>

<style scoped>
tbody tr:hover {
  background-color: #f9fafb;
}
</style>
