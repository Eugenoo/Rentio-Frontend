<script setup>
  import { ref, watch } from 'vue'
  import axios from 'axios'
  import { useAuthStore } from '@/stores/auth.js'
  import InputOverlap from '@/components/Form/InputOverlap.vue'
  import SelectOverlap from '@/components/Form/SelectOverlap.vue'

  const authStore = useAuthStore();

  const emit = defineEmits(['close', 'update']);

  const props = defineProps({
    reservation: {
      type: Object,
      required: true
    }
  })

  const formData = ref({})

  watch(
    () => props.reservation,
    (r) => {
      if (!r) return
      formData.value.id = r.id
      formData.value.status = r.status
    },
    { immediate: true }
  )

  async function updateReservation() {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}`+`/api/reservation`,formData.value,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`
          }
        }
      );

      emit('update', res.data.reservation);
      emit('close');
    } catch (error) {
      console.error(error);
    }
  }

  const reservationStatus = [
    { value: 'pending', name: 'Pending' },
    { value: 'confirmed', name: 'Confirmed' },
    { value: 'cancelled', name: 'Cancelled' }
  ]

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
      <h2 class="text-xl font-bold mb-4">Edit Reservation</h2>

      <form @submit.prevent="updateReservation">
        <SelectOverlap
          v-if="formData.status !== undefined"
          v-model="formData.status"
          :options="reservationStatus"
          option-value="value"
          option-label="name"
        />

        <div class="flex justify-end gap-2 mt-4">
          <button type="button" @click="$emit('close')" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>
