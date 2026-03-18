<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed, ref } from 'vue'
import ResetPasswordModal from '@/components/User/Profile/Modal/ResetPasswordModal.vue'
import EditUserModal from '@/components/User/Profile/Modal/EditUserModal.vue'
import { storeToRefs } from 'pinia'

const editModal = ref()

function showEditModal() {
  editModal.value = true
}

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const avatarUrl = computed(() => `https://ui-avatars.com/api/?name=${user.value.name}+${user.value.last_name}`);

const formattedPhone = computed(() => {
  if (!user.value.phone) return ''
  const digits = user.value.phone.toString().replace(/\D/g, '') // zostawiamy tylko cyfry
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ')          // spacja co 3 cyfry
})

const passwordModal = ref()

function showPasswordModal() {
  passwordModal.value = true
}

</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header profilu -->
    <div class="flex items-center gap-4 mb-6">
      <img
        :src="avatarUrl"
        class="w-20 h-20 rounded-full border border-gray-200 bg-white"
        alt="Avatar"
      />
      <div>
        <h2 class="text-2xl font-semibold text-gray-800">{{ user.name }} {{ user.last_name }}</h2>
        <p class="text-sm text-gray-500">
          {{ user.email }}
          <span v-if="user.email_verified_at" class="ml-2 text-green-600 font-medium">✔ zweryfikowany</span>
        </p>
      </div>
    </div>

    <!-- Grid kart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Dane osobowe -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Dane osobowe</h3>
          <button
            @click="showEditModal"
            class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Edytuj
          </button>
        </div>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Imię i nazwisko</span>
            <span class="font-medium text-gray-700">{{ user.name +' '+ user.last_name }} </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Telefon</span>
            <span class="font-medium text-gray-700"> +48 {{ formattedPhone }} </span>
          </div>
          <div class="flex justify-between items-start">
            <span class="text-gray-500">Adres</span>
            <span class="font-medium text-gray-700 text-right">
              ul. Testowa 12<br />
              00-001 Warszawa
            </span>
          </div>
        </div>
      </div>

      <!-- Bezpieczeństwo -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Bezpieczeństwo</h3>

        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">Hasło</span>
            <button
              @click="showPasswordModal" class="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Zmień hasło
            </button>
          </div>

          <div class="text-sm text-gray-500">
            Ostatnie logowanie:
            <span class="font-medium text-gray-700"> 05.02.2026, 21:37 </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ResetPasswordModal
   v-if="passwordModal"
   @close="passwordModal = false"
  ></ResetPasswordModal>
  <EditUserModal
    v-if="editModal"
    @close="editModal = false"
  >
  </EditUserModal>
</template>

<style scoped></style>
