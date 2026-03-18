import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useUserStore } from './user'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  function setToken(token) {
    accessToken.value = token
  }

  function clearAuth() {
    accessToken.value = null
    useUserStore().clearUser()
  }

  async function restoreSession() {
    return initAuth()
  }

  async function initAuth() {
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL+'/api/refresh',
        {},
        { withCredentials: true }
      )

      if (res.data.access_token && res.data.user) {
        setToken(res.data.access_token)
        useUserStore().setUser(res.data.user)
      } else {
        clearAuth()
      }

    } catch (err) {
      clearAuth()
    }
  }

  async function logout() {
    try {
      await axios.post(
        import.meta.env.VITE_API_URL + '/api/logout',
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        }
      )
      clearAuth()
    }  catch (err) {
      console.error(err)
    }
  }

  return {
    restoreSession,
    accessToken,
    isAuthenticated,
    initAuth,
    logout,
    setToken,
  }
})
