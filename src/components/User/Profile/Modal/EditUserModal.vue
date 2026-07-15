<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'
import { useUserStore } from '@/stores/user.js'

const authStore = useAuthStore()
const userStore = useUserStore()

const emit = defineEmits(['close', 'save'])

const userId = userStore.user.id

const formData = ref({
  id: userId,
})

async function submitForm() {
  try {
    const res = await axios.put(import.meta.env.VITE_API_URL + `/api/user`, formData.value,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        }
      },
    )
    userStore.setUser(res.data.user);
    emit('save', res.data.car);
    emit('close');
  } catch (error) {
    console.error(error);
  }
}

async function fetchUsers() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}`+`/api/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    });
    formData.value = res.data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async function () {
  fetchUsers();
})
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">

    <!-- Overlay -->
    <div
      class="absolute inset-0 bg-black/40 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>

    <!-- Modal -->
    <div class="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-8 z-10 animate-fade-in">

      <h2 class="text-2xl font-semibold text-gray-800 mb-6">
        Complete Your Profile
      </h2>

      <form @submit.prevent="submitForm" class="space-y-4">

        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            First Name
          </label>
          <input
            v-model="formData.name"
            required
            type="text"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
            placeholder="John"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            Last Name
          </label>
          <input
            v-model="formData.last_name"
            required
            type="text"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
            placeholder="Doe"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            Phone
          </label>
          <input
            v-model="formData.phone"
            required
            type="tel"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
            placeholder="+48 123 456 789"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            v-model="formData.email"
            required
            type="email"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
            placeholder="john@example.com"
          />
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Save
          </button>
        </div>

      </form>
    </div>
  </div>
</template>
