import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  const role = computed(() => user.value?.role ?? 'guest')

  function setUser(data) {
    user.value = data
  }

  function clearUser() {
    user.value = null
  }

  return {
    user,
    role,
    setUser,
    clearUser,
  }
})
