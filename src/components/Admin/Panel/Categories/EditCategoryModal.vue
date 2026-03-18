<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'
import InputOverlap from '@/components/Form/InputOverlap.vue'
import FileInputOverlap from '@/components/Form/FileInputOverlap.vue'

const authStore = useAuthStore()

const imageFile = ref(null)
const preview = ref(null)
const photoChange = ref(false)

const emit = defineEmits(['close', 'update'])

const props = defineProps({
  editCategory: {
    type: Object,
    required: true
  }
})

const formData = ref({
  id: props.editCategory.id,
  name: props.editCategory.name || '',
  description: props.editCategory.description || '',
})

function onImageChange(e) {
  const file = e.target.files[0]
  if (!file || !file.type.startsWith('image/')) return

  imageFile.value = file
  preview.value = URL.createObjectURL(file)
}

async function updateCategory() {
  try {
    const res = await axios.put(`${import.meta.env.VITE_API_URL}`+`/api/carcategory`, formData.value,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        }
      },
    )
    emit('update', res.data.category);
    emit('close');
  } catch (error) {
    console.error(error);
  }
}

async function updatePhoto() {
  try {
    const data = new FormData()
    data.append('photo', imageFile.value)

    await axios.post(
      `${import.meta.env.VITE_API_URL}`+`/api/categories/${formData.value.id}/editphoto`,
      data,
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        }
      }
    )
    emit('update')
    closePhoto()
  } catch (e) {
    console.error(e)
  }
}

function openPhoto() {
  photoChange.value = true
}

function closePhoto() {
  photoChange.value = false
  preview.value = props.editCategory.photo
}

onMounted(() => {
  preview.value = props.editCategory.photo
})
</script>

<template>
  <!-- MAIN MODAL -->
  <div class="fixed inset-0 z-40 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />

    <div class="relative bg-white p-6 rounded-xl w-full max-w-md z-40">
      <h2 class="text-xl font-bold mb-4">Edit Category</h2>

      <form @submit.prevent="updateCategory" class="space-y-3">
        <InputOverlap
          v-model="formData.name"
          label="Category Name"
          id="name"
        />

        <InputOverlap
          v-model="formData.description"
          label="Category Description"
          id="description"
        />

        <div>
          <label class="text-sm font-medium">Photo:</label>
          <div class="flex justify-center">
            <img
              v-if="preview"
              :src="preview"
              class="h-32 mt-2 rounded object-cover"
            />
          </div>
          <div class="flex justify-center">
            <button
              type="button"
              @click="openPhoto"
              class="mt-2 text-sm bg-gray-200 px-3 py-1 rounded"
            >
              Change photo
            </button>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- PHOTO MODAL -->
  <div v-if="photoChange" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50" @click="closePhoto" />

    <div class="relative bg-white p-6 rounded-xl w-full max-w-md z-50">
      <h2 class="text-xl font-bold mb-4">Change Category Photo</h2>

      <form @submit.prevent="updatePhoto" class="space-y-3">
        <input type="file" accept="image/*" @change="onImageChange" />
        <img v-if="preview" :src="preview" class="h-32 rounded object-cover" />

        <div class="flex justify-end gap-2">
          <button type="button" @click="closePhoto" class="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
