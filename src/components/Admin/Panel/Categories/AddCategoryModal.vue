<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'
import InputOverlap from '@/components/Form/InputOverlap.vue'
import FileInputOverlap from '@/components/Form/FileInputOverlap.vue'

const authStore = useAuthStore()

const emit = defineEmits(['close', 'create'])

const formData = ref({
  name: '',
  description: '',
})

const imageFile = ref(null)

async function createCategory() {
  try {
    const data = new FormData()

    data.append('name', formData.value.name)
    data.append('description', formData.value.description)

    if (imageFile.value) {
      data.append('photo', imageFile.value)
    }

    await axios.post(
      `${import.meta.env.VITE_API_URL}`+'/api/carcategory',
      data,
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        }
      }
    )

    emit('create')
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
      <h2 class="text-xl font-bold mb-4">Add Category</h2>

      <form @submit.prevent="createCategory">
        <InputOverlap
          v-model="formData.name"
          label="Category Name"
          id="name"
        />
        <InputOverlap
          v-model="formData.description"
          label="Category description"
          id="description"
        />

        <FileInputOverlap
          v-model="imageFile"
          label="Photo"
          id="photo"
        />

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
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
