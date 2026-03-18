<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.js'
import axios from '@/plugins/axios.js'

const emit = defineEmits(['close']);
const userStore = useUserStore();
const errorValue = ref(null);

function sendResetLink() {
  console.log(userStore.user.email)
  axios.post(`${import.meta.env.VITE_API_URL}`+'/api/password-reset',
    {"email":userStore.user.email}, {withCredentials: true})
    .then(function(response) {
      console.log(response.data);
    }).catch(function(error){
    errorValue.value = error;
  }).finally(() => {
    emit('close');
  })
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
      <h2 class="text-xl font-bold mb-4">Reset Password</h2>

      <p class="mb-6">A link to reset the password will be sent to your email.</p>

      <!-- Przyciski -->
      <div class="flex justify-end gap-3 mt-4">
        <button
          @click="emit('close')"
          type="button"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          @click="sendResetLink()"
          type="button"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Reset
        </button>
      </div>
    </div>

  </div>
</template>


<style scoped></style>


<style scoped>

</style>
