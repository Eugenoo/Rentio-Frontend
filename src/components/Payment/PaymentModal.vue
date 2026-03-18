<script setup>
import { onMounted, ref } from 'vue'
import { useReservationStore } from '@/stores/reservation.js'
import axios from 'axios'
import { useNotify } from '@/composables/UseNotify.js'
import router from '@/router/index.js'
import { usePaymentStore } from '@/stores/payment.js'

const reservationStore = useReservationStore()
const paymentStore = usePaymentStore()

const {notify} = useNotify()

// Stan płatności
const paymentMethod = ref('apple')
const blikCode = ref('')

// Funkcja do przycisku zakładek
const tabClass = (tab) => {
  return [
    'flex-1 py-2 rounded-xl font-medium transition',
    paymentMethod.value === tab
      ? 'bg-black text-white'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  ]}

async function createPayment(provider) {
  const payload = {
    reservation_id: reservationStore.id,
    amount: reservationStore.totalPrice,
    provider: provider,
    status: 'paid',
  }
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}`+'/api/payments', payload) // while await loading
    notify('Payment successful', 'success')
    router.push('/')
    closeModal()
  } catch (e) {
    console.error(e)
    notify('Payment failed', 'error')
  }
}

// Example payment methods
const payWithApple = () => {
  createPayment('apple')
}
const payWithBlik = () => {
  createPayment('blik')
}
const payWithCard = () => {
  createPayment('card')
}

const loading = ref(false)

async function payLater() {
  loading.value = true
  try {
    await sendPaymentLink()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }

  router.push('/');
  closeModal();
  notify('A payment link has been sent to the email address you provided.', 'success');
}

//email handler
async function sendPaymentLink() {

  const payload = {
    "reservation_id" : reservationStore.id,
    "total_value" : reservationStore.totalPrice,
    "email": reservationStore.email,
  }

  await axios.post(`${import.meta.env.VITE_API_URL}`+`/api/payments/email`, payload
  ).catch(e => {
    console.log(e)
  })
}

const closeModal = () => {
  paymentStore.closePayment()
}

</script>

<template>
  <div  v-if="paymentStore.isOpen" class="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        @click="closeModal"
  >
    <div @click.stop class="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Complete Payment</h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 text-xl transition"
        >
          ✕
        </button>
      </div>

      <!-- Amount -->
      <div class="bg-gray-50 rounded-xl p-4 mb-6">
        <div class="flex justify-between items-center">
          <span class="text-gray-500">Amount Due</span>
          <span class="text-xl font-bold text-cyan-700"> {{ reservationStore.totalPrice }} zł</span>
        </div>
      </div>

      <!-- Payment Tabs -->
      <div class="flex gap-2 mb-6">
        <button
          @click="paymentMethod = 'apple'"
          :class="tabClass('apple')"
          class="flex-1 py-2 rounded-xl font-medium transition"
        >
           Apple Pay
        </button>
        <button
          @click="paymentMethod = 'blik'"
          :class="tabClass('blik')"
          class="flex-1 py-2 rounded-xl font-medium transition"
        >
          BLIK
        </button>
        <button
          @click="paymentMethod = 'card'"
          :class="tabClass('card')"
          class="flex-1 py-2 rounded-xl font-medium transition"
        >
          Card
        </button>
      </div>

      <!-- Apple -->
      <div v-if="paymentMethod === 'apple'" class="space-y-4 mb-6">
        <p class="text-center text-gray-600">Pay quickly and securely with Apple Pay.</p>
        <button
          @click="payWithApple"
          class="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
           Pay with Apple Pay
        </button>
      </div>

      <!-- BLIK -->
      <div v-if="paymentMethod === 'blik'" class="space-y-4 mb-6">
        <input
          v-model="blikCode"
          maxlength="6"
          placeholder="000000"
          class="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
        />
        <button
          @click="payWithBlik"
          class="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Pay with BLIK
        </button>
      </div>

      <!-- Card -->
      <div v-if="paymentMethod === 'card'" class="space-y-4 mb-6">
        <input
          placeholder="Numer karty"
          class="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
        />
        <div class="flex gap-3">
          <input
            placeholder="MM/YY"
            class="w-1/2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
          />
          <input
            placeholder="CVC"
            class="w-1/2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
          />
        </div>
        <button
          @click="payWithCard"
          class="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Pay by Card
        </button>
      </div>

      <!-- Footer -->
      <div v-if="paymentStore.showPayLaterButton" class="space-y-4">
        <button
          @click="payLater"
          :disabled="loading"
          class="w-full bg-green-800 text-white py-3 rounded-xl font-semibold
          hover:opacity-90 transition
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Processing...</span>
          <span v-else>Pay Later</span>
        </button>
      </div>

      <p class="text-xs text-gray-400 text-center mt-6">
        Your payment is secured with SSL encryption. 🔒
      </p>
    </div>
  </div>

</template>
