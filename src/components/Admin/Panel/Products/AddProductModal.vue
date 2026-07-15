<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'
import InputOverlap from '@/components/Form/InputOverlap.vue'
import SelectOverlap from '@/components/Form/SelectOverlap.vue'
import { useNotify } from '@/composables/UseNotify.js'
import FileInputOverlap from '@/components/Form/FileInputOverlap.vue'

const authStore = useAuthStore();

const emit = defineEmits(['close','create']);

const formData = ref({
  brand: '',
  model: '',
  registration_number: '',
  car_category_id: '',
  year: '',
  price_per_day: '',
})

const imageFile = ref(null)
const preview = ref(null)

const categories = ref()

const {notify} = useNotify()


async function createProduct() {
  try {
    const data = new FormData();

    for (const key in formData.value) {
      data.append(key, formData.value[key])
    }

    if (imageFile.value) {
      data.append('photo', imageFile.value)
    }
    console.log(data)

    await axios.post(`${import.meta.env.VITE_API_URL}`+'/api/car', data, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    emit('create');
    emit('close');
  } catch (err) {
    const msg = err.response?.data?.message
    notify(msg, 'error')
    console.error(msg)
  }
}

function onImageChange(event) {
  const file = event.target.files[0];
  if (!file) return
  //validate type
  if(!file.type.startsWith('image/')) {
    alert('Please choose a file.')
    return
  }

  imageFile.value = file;
  preview.value = window.URL.createObjectURL(file)
}

onMounted(()=>{
  axios.get(`${import.meta.env.VITE_API_URL}`+'/api/carcategory', )
    .then(
      res => {
        categories.value = res.data
      }
    ).catch(e => {
    console.log(e)
  })
})


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
      <h2 class="text-xl font-bold mb-4">Add Product</h2>

      <form @submit.prevent="createProduct">
        <InputOverlap
          v-model="formData.brand"
          label="Brand"
          id="brand"
        />
        <InputOverlap
          v-model="formData.model"
          label="Model"
          id="model"
        />
        <InputOverlap
          v-model="formData.registration_number"
          label="Registration Number"
          id="registration_number"
        />
        <div class="flex gap-5 items-end mb-4">
          <SelectOverlap
            v-model="formData.car_category_id"
            label="Category"
            id="category"
            :options="categories"
            class="h-12"
          />
          <router-link to="categories" class="bg-blue-500 text-white px-2 h-12 rounded">Create New Category</router-link>
        </div>

        <InputOverlap
          v-model="formData.year"
          label="Year of Production"
          id="year"
        />

        <InputOverlap
          v-model="formData.price_per_day"
          label="Daily Price"
          id="price_per_day"
        />

        <FileInputOverlap
          v-model="imageFile"
          label="Photo"
          id="photo"
        />

        <div class="flex justify-end gap-2 mt-4">
          <button type="button" @click="$emit('close')" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
        </div>
      </form>
    </div>
  </div>
</template>


<style scoped></style>
