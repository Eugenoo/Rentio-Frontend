<script setup lang="ts">
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'
import { useNotify } from '@/composables/UseNotify.js'


const authStore = useAuthStore()

const props = defineProps({
  deleteUser: {
    type: Object,
    required: true
  }
})

const {notify} = useNotify()

const emit = defineEmits(['close', 'delete'])

async function destroyUser() {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/user`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      },
      data: { id: props.deleteUser.id }
    })
    emit('delete')   // powiadamiamy parent, że usunięto
    emit('close')    // zamykamy modal
  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message
    notify(msg, 'warning')
    emit('close');
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- overlay -->
    <div
      class="absolute inset-0 bg-black/50"
      @click="$emit('close')"
    ></div>

    <!-- modal -->
    <div class="relative bg-white p-6 rounded-xl w-full max-w-md z-10 shadow-lg">
      <h2 class="text-xl font-bold mb-4 text-gray-800">Delete User</h2>

      <p>Are you sure you want to delete <span class="font-semibold">{{ deleteUser.name }} {{ deleteUser.last_name }}</span>?</p>

      <div class="flex justify-end gap-2 mt-6">
        <button
          type="button"
          @click="$emit('close')"
          class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="destroyUser"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Opcjonalna animacja wchodzenia */
</style>

