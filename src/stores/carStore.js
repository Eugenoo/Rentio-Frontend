import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'


export const useCarStore = defineStore('car', () => {

    const cars = ref([])
    const loading = ref(false)
    const loaded = ref(false)


  const fetchCars = async (force = false) => {
    if (loaded.value && !force) return
    try {
      loading.value = true
      const res = await axios.get(
        import.meta.env.VITE_API_URL + '/api/car'
      )
      cars.value = res.data
      loaded.value = true
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  return {
    cars,
    loading,
    loaded,
    fetchCars,
  }
})
