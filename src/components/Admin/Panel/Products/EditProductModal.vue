<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'
import InputOverlap from '@/components/Form/InputOverlap.vue'
import SelectOverlap from '@/components/Form/SelectOverlap.vue'

const authStore = useAuthStore();
const imageFile = ref(null);
const preview = ref(null);
const photoChange = ref(false);

const props = defineProps({
  editProduct: {
    type: Object,
    required: true
  }
})

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

async function photoUpdate() {
  try {
    const data = new FormData();

    if (imageFile.value) {
      data.append('photo', imageFile.value)
    }

    await axios.post(`${import.meta.env.VITE_API_URL}`+`/api/car/${props.editProduct.id}/editphoto`, data, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
  } catch (error) {
    console.error(error);
  }
  fetchPhoto();
  close();
}

const emit = defineEmits(['close','update']);

const formData = ref({
  id: props.editProduct.id || '',
  brand: props.editProduct.brand || '',
  model: props.editProduct.model || '',
  registration_number: props.editProduct.registration_number || '',
  year: props.editProduct.year || '',
  car_category_id: props.editProduct.car_category_id || '',
  price_per_day: props.editProduct.price_per_day || '',
  available: props.editProduct.available || '',
  photo: props.editProduct.photo || ''
})
const categories = ref([])

async function updateProduct() {
  try {
    const res = await axios.put(`${import.meta.env.VITE_API_URL}`+`/api/car/`, formData.value,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        }
      },
    )
    emit('update', res.data.car);
    emit('close');
  } catch (error) {
    console.error(error);
  }
}

async function fetchPhoto(){
  try {
    axios.get(`${import.meta.env.VITE_API_URL}`+`:8000/api/car/` + formData.value.id, {})
      .then(response => {
        imageFile.value = response.data.photo;
        preview.value = response.data.photo;
      }).catch(e => {
      console.error(e);
    })
  } catch (error) {
    console.error(error);
  }
}

async function fetchCategories() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}`+'/api/carcategory')
    categories.value = res.data
  }
  catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  console.log(formData)
  fetchPhoto();
  fetchCategories();
})

function changePhoto() {
  photoChange.value = true;
}

function close() {
  photoChange.value = false;
  preview.value = props.editProduct.photo;
}

</script>

<template>
  <div class="fixed inset-0 z-40 mt-8 flex items-center justify-center">
    <!-- overlay -->
    <div
      class="absolute inset-0 bg-black/50 z-20"
      @click="$emit('close')"
    ></div>

    <!-- modal -->
    <div class="relative bg-white p-6 rounded-xl w-full max-w-md z-40">
      <h2 class="text-xl font-bold mb-4">Edit Product</h2>
      <form @submit.prevent="updateProduct">

        <InputOverlap
          v-model="formData.brand"
          label="Brand"
          id="brand"
        ></InputOverlap>

        <InputOverlap
          v-model="formData.model"
          label="Model"
          id="model"
        ></InputOverlap>

        <InputOverlap
          v-model="formData.registration_number"
          label="Registration Number"
          id="registration_number"
        ></InputOverlap>

        <SelectOverlap
          v-model="formData.car_category_id"
          label="Category"
          id="category"
          :options="categories"
          class="h-12 mb-4"
        />

        <div class="flex">
          <InputOverlap
            v-model="formData.year"
            label="Year"
            id="year"
          ></InputOverlap>
          <InputOverlap
            v-model="formData.price_per_day"
            label="Daily Price"
            id="price_per_day"
          ></InputOverlap>
        </div>

        <label>Photo:</label>
        <img v-if="imageFile" :src="preview" class="h-32 mt-2 object-cover rounded"/>
        <button type="button" @click="changePhoto" class="bg-gray-300 px-4 py-2 rounded">Change Photo</button>
        <br>

        <!--  SWITCH TOOGLE-->
        <label>Avaibility:</label>


        <label class="flex items-center gap-3 cursor-pointer select-none">
          <div class="relative">
            <input
              type="checkbox"
              v-model="formData.available"
              :true-value="1"
              :false-value="0"
              class="sr-only peer"
            />

            <!-- background -->
            <div
              class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition"
            ></div>

            <!-- knob -->
            <div
              class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition peer-checked:translate-x-5"
            ></div>
          </div>
        </label>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" @click="$emit('close')" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  </div>
  <!-- change photo modal -->

  <div v-if="photoChange" class="fixed inset-0 z-50 flex items-center justify-center">
    <div
      class="absolute inset-0 bg-black/50 z-20"
      @click="close"
    ></div>

    <div class="relative bg-white p-6 rounded-xl w-full max-w-md z-50">
      <h2 class="text-xl font-bold mb-4">Change Photo</h2>

      <form @submit.prevent="photoUpdate">
        <label>Select Photo:</label>
        <input required type="file" accept="image/*" @change="onImageChange" class="border p-2 w-full"/>
        <img v-if="imageFile" :src="preview" class="h-32 mt-2 object-cover rounded"/>

        <div class="flex justify-end gap-2 mt-4">
          <button type="button" @click="close" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>


<style scoped></style>
