import { useNotificationStore } from '@/stores/notification.js'

export function useNotify() {
  const store = useNotificationStore()

  return {
    notify: store.show
  }
}
