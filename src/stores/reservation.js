import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useReservationStore = defineStore('reservation', () => {
    const car = ref();
    const startDate = ref();
    const endDate = ref();
    const dailyPrice = ref();
    const id = ref();
    const email = ref();

    const days = computed(() => {
      if(!startDate.value || !endDate.value) return 0

      const start = new Date(startDate.value)
      const end = new Date(endDate.value)

      return Math.ceil((end - start) / 86400000 + 1);
    });

    const totalPrice = computed(() => {
      return days.value * dailyPrice.value
    })

    function setEmail(newEmail) {
      email.value = newEmail;
    }

    const clearDates = () => {
      startDate.value = undefined
      endDate.value = undefined
    }

    return { id, car, startDate, endDate, days, dailyPrice, email, setEmail, totalPrice, clearDates }
})
