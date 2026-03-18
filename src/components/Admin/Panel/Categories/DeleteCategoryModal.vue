<script setup>
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()

const props = defineProps({
  deleteCategory: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'delete'])

async function destroyCategory() {
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}`+`/api/carcategory`,
      {
        data: { id: props.deleteCategory.id },
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        }
      }
    )

    emit('delete')
    emit('close')
  } catch (error) {
    console.error(error)
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
    <div class="relative bg-white p-6 rounded-xl w-full max-w-md z-10">
      <h2 class="text-xl font-bold mb-4">Delete Category</h2>

      <form @submit.prevent="destroyCategory">
        Are you sure you want to delete this category?
        <div class="flex justify-end gap-2 mt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-red-700 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

