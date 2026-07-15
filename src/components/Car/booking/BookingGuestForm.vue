<template>
  <div class="fixed inset-0 z-75 flex items-center justify-center">
    <!-- overlay -->
    <div
      class="absolute inset-0 bg-black/50"
      @click="$emit('close')"
    ></div>
    <!-- modal -->
    <div class="relative z-80 bg-white p-6 rounded-xl w-full max-w-md">
      <div>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">
            Rent as a Guest!
          </h2>
          <img src="/icons/close.png"
               @click="$emit('close')"
               class="h-5 cursor-pointer transition-transform duration-300 hover:rotate-90"
          />
        </div>
      </div>

      <div id="content">
        <form class="max-w-md mx-auto" @submit.prevent="onSubmit">
          <div class="grid md:grid-cols-2 md:gap-6">
            <div class="relative z-0 w-full mb-5 group">
              <input v-model="formStore.form.firstName" type="text" name="floating_first_name" id="floating_first_name" class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " required />
              <label for="floating_first_name" class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">First name</label>
            </div>
            <div class="relative z-0 w-full mb-5 group">
              <input v-model="formStore.form.lastName" type="text" name="floating_last_name" id="floating_last_name" class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " required />
              <label for="floating_last_name" class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Last name</label>
            </div>
          </div>
          <div class="relative z-0 w-full mb-5 group">
            <input v-model="formStore.form.email" type="email" name="floating_email" id="floating_email" class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " required />
            <label for="floating_email" class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Email address</label>
          </div>
          <div class="grid md:grid-cols-2 md:gap-6">
            <div class="relative z-0 w-full mb-5 group">
              <input
                v-model="formStore.form.phoneNumber"
                type="tel"
                @input="formStore.form.phoneNumber = formStore.form.phoneNumber.replace(/\D/g, '')"
                class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                placeholder=" "
                required
              />
              <label for="floating_phone" class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Phone number</label>
            </div>
          </div>
          <div class="italic font-bold flex flex-col items-center gap-2 w-full mb-5">
            <div>
              Total Price: {{reservationStore.totalPrice}} PLN
            </div>
            <div>
              From: {{reservationStore.startDate}}
            </div>
            <div>
              To: {{reservationStore.endDate}}
            </div>
          </div>
          <div class="flex flex-col items-center gap-4 w-full">
            <button type="submit" class="gradient-border text-xl italic">Review & Confirm</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useReservationStore } from '@/stores/reservation.js'
import { useFormDraftStore } from '@/stores/formDraft.js'

const reservationStore = useReservationStore();

const emit = defineEmits(['showConfirmation']);

const formStore = useFormDraftStore();

function onSubmit(){
  reservationStore.setEmail(formStore.form.email);
  emit('showConfirmation')
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

