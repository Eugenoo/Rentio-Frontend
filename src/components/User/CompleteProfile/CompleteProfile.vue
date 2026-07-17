<template>
  <nav-bar></nav-bar>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white rounded-xl shadow p-6">
      <h1 class="text-2xl font-semibold mb-6 text-gray-800">
        Uzupełnij swoje dane
      </h1>

      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Imię
          </label>
          <input
            v-model.trim="form.name"
            type="text"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Last name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nazwisko
          </label>
          <input
            v-model.trim="form.last_name"
            type="text"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Telefon
          </label>
          <input
            v-model.trim="form.phone"
            type="tel"
            placeholder="+48 123 456 789"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full mt-2 rounded-lg bg-indigo-600 px-4 py-2
                 font-semibold text-white transition
                 hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ isSubmitting ? 'Zapisywanie...' : 'Zapisz i przejdź dalej' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios'
import { useUserStore } from '@/stores/user.js'
import { useAuthStore } from '@/stores/auth.js'
import router from '@/router/index.js'
import { useNotify } from '@/composables/UseNotify.js'
import NavBar from '@/components/Navigation/NavBar.vue'

const userStore = useUserStore();
const authStore = useAuthStore();

const form = reactive({
  id: userStore.user.id,
  name: '',
  last_name: '',
  phone: '',
});

const {notify} = useNotify();

const isSubmitting = ref(false);

async function updateData() {
  await  axios.patch(`${import.meta.env.VITE_API_URL}`+'/api/me/complete-profile', form, {
      headers: {
        Authorization: `bearer ${authStore.accessToken}`,
      },
    }
  ).then(response => {
    userStore.setUser(response.data.user);
    const msg = response.data.message
    notify(msg, 'success')
    router.push({ name: 'user' });
  }).catch(err => {
    const msg = err.response?.data?.message
    notify(msg, 'error')
    console.log(err);
  });
}

function submitForm() {
  isSubmitting.value = true;

  // TODO: API call
  updateData();

  setTimeout(() => {
    isSubmitting.value = false;
    // router.push('/dashboard')
  }, 800);
}
</script>
