// stores/notification.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  function show(message, type = 'success', duration = 4000) {
    const id = Date.now()

    notifications.value.push({
      id,
      message,
      type
    })

    if (duration) {
      setTimeout(() => remove(id), duration)
    }
  }

  function remove(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return {
    notifications,
    show,
    remove
  }
})
