<script setup>
import axios from 'axios'
import { useUserStore } from '@/stores/user.js'
import { useAuthStore } from '@/stores/auth.js'
import { useNotify } from '@/composables/UseNotify.js'

const authStore = useAuthStore();


const props = defineProps({
  deleteProduct: {
    type: Object,
    required: true
  }
})

const {notify} = useNotify()

const emit = defineEmits(['close','update']);

async function destroyProduct() {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}`+`/api/car`,
      {
        data: { id: props.deleteProduct.id },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        }
      },
    )
    emit("delete");
    emit('close');
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
    <div class="relative bg-white p-6 rounded-xl w-full max-w-md z-10">
      <h2 class="text-xl font-bold mb-4">Delete Product</h2>

      <form @submit.prevent="destroyProduct">
        Are you sure you want to delete this product?
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" @click="$emit('close')" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button type="submit" class="bg-red-700 text-white px-4 py-2 rounded">Delete</button>
        </div>
      </form>
    </div>
  </div>
</template>


<style scoped></style>
