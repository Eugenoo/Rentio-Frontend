// stores/payment.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePaymentStore = defineStore('payment', () => {

  // ===== STATE =====
  const isOpen = ref(false)
  const mode = ref('checkout')
  // 'checkout' | 'retry' | 'success' | 'error'

  const reservationId = ref(null)
  const isGuest = ref(false)
  const canPayLater = ref(true)

  // ===== GETTERS (computed) =====

  const showPayLaterButton = computed(() => {
    if (mode.value === 'retry') return false
    if (!canPayLater.value) return false
    return true
  })

  // ===== ACTIONS =====

  function openPayment(payload) {
    /*
      payload:
      {
        mode,
        reservationId,
        isGuest,
        canPayLater
      }
    */

    mode.value = payload.mode || 'checkout'
    reservationId.value = payload.reservationId ?? null
    isGuest.value = payload.isGuest ?? false
    canPayLater.value = payload.canPayLater ?? true

    isOpen.value = true
  }

  function closePayment() {
    isOpen.value = false
  }

  function setSuccess() {
    mode.value = 'success'
  }

  function setError() {
    mode.value = 'error'
  }

  return {
    // state
    isOpen,
    mode,
    reservationId,
    isGuest,
    canPayLater,

    // getters
    showPayLaterButton,

    // actions
    openPayment,
    closePayment,
    setSuccess,
    setError
  }

})
