<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const props = defineProps({
  editUser: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])

const formData = ref()

/**
 * Za każdym razem gdy otwierasz modal
 * kopiujemy dane usera do lokalnego formData
 */
watch(
  () => props.editUser,
  (user) => {
    if (user) {
      formData.value = {
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone
      }
    }
  },
  { immediate: true }
)

async function submitForm() {
  try {
     await axios.put(
       `${import.meta.env.VITE_API_URL}/api/user`,
      formData.value,
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        }
      }
    )
    emit('update')
    emit('close')
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">

    <!-- Overlay -->
    <div
      class="absolute inset-0 bg-black/40 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>

    <!-- Modal -->
    <div class="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-8 z-10">

      <h2 class="text-2xl font-semibold text-gray-800 mb-6">
        Edit User
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
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
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
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
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
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
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
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
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
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Save
          </button>
        </div>

      </form>
    </div>
  </div>
</template>
