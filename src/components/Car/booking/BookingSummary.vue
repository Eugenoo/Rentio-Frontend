<template>
  <div class="fixed inset-0 z-70 flex items-center justify-center">
    <!-- overlay -->
    <div
      class="absolute inset-0 bg-black/50"
      @click="$emit('close')"
    ></div>

    <!-- modal -->
    <div v-if="!user" class="relative z-80 bg-white p-6 rounded-xl w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Thank you for your booking!</h2>
      <div>
        You will receive the details of your rental at the provided email address.
        If you haven’t received the email, please check whether the email address you entered is correct.
      </div>
      <button
        class="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        @click="homePage()"
      >
        Close
      </button>
    </div>

    <!-- logged user modal -->
    <!-- Overlay -->
    <div
      v-if="user"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
    >
      <!-- Modal -->
      <div
        class="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-8 transform transition-all scale-100"
      >
        <!-- Header -->
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">
            Thank you for your booking!
          </h2>
          <p class="text-gray-500 text-sm mt-1">
            Here are your rental details.
          </p>
        </div>

        <!-- Details -->
        <div class="space-y-3 bg-gray-50 rounded-xl p-4 mb-6">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">From:</span>
            <span class="font-semibold text-gray-800">
          {{ reservationStore.startDate }}
        </span>
          </div>

          <div class="flex justify-between text-sm">
            <span class="text-gray-500">To:</span>
            <span class="font-semibold text-gray-800">
          {{ reservationStore.endDate }}
        </span>
          </div>

          <div class="flex justify-between text-sm border-t pt-3">
            <span class="text-gray-600 font-medium">Amount:</span>
            <span class="font-bold text-cyan-700 text-lg">
          {{ reservationStore.totalPrice }} zł
        </span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col gap-3">
          <button
            @click="rent"
            class="w-full gradient-border py-3  font-semibold"
          >
            Rent
          </button>

          <button
            @click="homePage()"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition duration-200"
          >
            Close
          </button>
        </div>
        <!-- Info -->
        <p class="text-xs text-gray-400 text-center mt-6 leading-relaxed">
          The details of your rental will be sent to the provided email address.
          If you don’t see the message, please check your spam folder or verify that the email address is correct.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter} from 'vue-router'
import { useReservationStore } from '@/stores/reservation.js'
import { useUserStore } from '@/stores/user.js'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'
import { useFormDraftStore } from '@/stores/formDraft.js'

const router = useRouter();
const user = useUserStore();
const auth = useAuthStore();
const reservationStore = useReservationStore();
const formStore = useFormDraftStore();

const emit = defineEmits(['rentUser', 'rentGuest', 'close'])

function rent(){

  //if user is logged in reservationStore set user
  if (user.user) {
    reservationStore.setEmail(user.user.email);
  } else {
    reservationStore.setEmail(formStore.form.email);
  }

  const payload = {
    user_id: auth.accessToken ? (user.user.id || null) : null,
    car_id: reservationStore.car,
    guest_first_name: formStore.form.firstName,
    guest_last_name: formStore.form.lastName,
    guest_email: reservationStore.email,
    guest_phone: formStore.form.phoneNumber,
    total_price: reservationStore.totalPrice,
    start_date: reservationStore.startDate,
    end_date: reservationStore.endDate,
    status: 'pending',
  }

  if (auth.accessToken) {
    axios.post(import.meta.env.VITE_API_URL+'/api/reservation',
      payload,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((res) => {
        reservationStore.id = res.data.reservation.id

        const payload2 = {
          reservation_id: res.data.reservation.id,
          email: reservationStore.email,
        }

        axios.post(`${import.meta.env.VITE_API_URL}`+ '/api/send-reservation-mail', payload2)
          .then(res => {
            console.log(res)
          }).catch(e => {
            console.log(e)
          })
        emit('rentUser', true)
        emit('close')
      })
      .catch((err) => {
        console.log(err)
      })
  } else if(auth.accessToken === null) {
    axios.post(`${import.meta.env.VITE_API_URL}`+'/api/guestreservation',
      payload,
      {
        withCredentials: true,
      })
      .then((res) => {
        reservationStore.id = res.data.reservation.id

        const payload2 = {
          reservation_id: res.data.reservation.id,
          email: reservationStore.email,
        }

        axios.post(`${import.meta.env.VITE_API_URL}`+'/api/send-reservation-mail', payload2)
          .then(res => {
            console.log(res)
          }).catch(e => {
          console.log(e)
        })

        emit('rentUser', false)
        emit('close')
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    emit('close')
  }
}

function homePage(){
  router.push('/');
}

</script>

<style scoped>
.gradient-border {
  position: relative;
  padding: 12px 40px;
  border-radius: 50px;
  background: white;
  border: 2px solid transparent;
}

/* Gradient border */
.gradient-border::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 4px;
  border-radius: inherit;
  background: linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6);
  background-size: 300% 300%;
  animation: gradientMove 4s linear infinite;

  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;

  pointer-events: none;
  transition: background 0.4s ease;
}

/* HOVER – zmiana gradientu */
.gradient-border:hover::before {
  background: linear-gradient(90deg, #22c55e, #06b6d4, #3b82f6);
  background-size: 300% 300%;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}
</style>
