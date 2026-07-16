<template>
  <Disclosure as="nav" class="bg-white border-b border-gray-200 fixed top-0 left-0 w-full h-16 z-50 font-saira" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100  focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
            <XMarkIcon v-else class="block size-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex shrink-0 items-center">
            <RouterLink to="/" class="text-lg font-semibold italic">
              RENT!O
            </RouterLink>
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <router-link active-class="bg-gray-900 text-white -skew-x-12" v-for="item in navLinks" :key="item.name" :to="item.route" class="rounded-md px-3 py-2 text-sm font-medium" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</router-link>
              <button v-if="isAuthenticated" @click="logout()" class='text-gray-300 hover:bg-gray-700 hover:text-white hover:-skew-x-12 rounded-md px-3 py-2 text-sm font-medium'>Logout</button>
            </div>
          </div>
        </div>
        <div v-if="isAuthenticated" class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <Menu as="div" class="relative">
          <MenuButton type="button" class="relative rounded-full  p-1 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
            <span class="absolute -inset-1.5" />
            <span class="sr-only">View notifications</span>
            <span v-if="hasPending" id="red-dot-notification"
              class="absolute top-0 left-0 block h-2 w-2 rounded-full bg-red-500"
            ></span>
            <BellIcon class="size-6" aria-hidden="true" />
          </MenuButton>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden">

                <!-- Admin notification -->
                <MenuItem
                  v-if="role === 'admin' || role === 'demo_admin'"
                  v-slot="{ active }"
                >
                  <router-link
                    :to="{ name: 'admin.reservations' }"
                    :class="[
        active ? 'bg-gray-100 outline-hidden' : '',
        'block px-4 py-2 text-sm text-gray-700'
      ]"
                  >
                    New booking
                  </router-link>
                </MenuItem>


                <!-- User notification -->
                <MenuItem
                  v-else
                  v-slot="{ active }"
                >
                  <router-link
                    :to="{ name: 'reservationDetails' }"
                    :class="[
        active ? 'bg-gray-100 outline-hidden' : '',
        'block px-4 py-2 text-sm text-gray-700'
      ]"
                  >
                    My reservations
                  </router-link>
                </MenuItem>

              </MenuItems>
            </transition>
          </Menu>
          <!-- Profile dropdown -->
          <Menu as="div" class="relative ml-3">
            <div>
              <MenuButton class="relative flex rounded-full bg-gray-800 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800">
                <span class="absolute -inset-1.5" />
                <span class="sr-only">Open user menu</span>
                <img class="size-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
              </MenuButton>
            </div>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden">
                <MenuItem v-slot="{ active }">
                  <router-link  :to="profileRoute" :class="[active ? 'bg-gray-100 outline-hidden' : '', 'block px-4 py-2 text-sm text-gray-700']">Your Profile</router-link>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a @click="logout" :class="[active ? 'bg-gray-100 outline-hidden' : '', 'block px-4 py-2 text-sm text-gray-700']">Sign out</a>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden bg-white border-b border-gray-200 shadow-md">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <router-link
          v-for="item in navLinks"
          :key="item.name"
          :to="item.route"
          class="block rounded-md px-3 py-2 font-medium italic hover:text-gray-300"
        >
            {{ item.name }}
        </router-link>
        <button
          v-if="isAuthenticated"
          @click="logout"
          class="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs} from 'pinia';
import router from '@/router/index.js'
import { useAuthStore } from '@/stores/auth.js'
import { useUserStore } from '@/stores/user.js'
import axios from '@/plugins/axios.js'
import { useRoute } from 'vue-router'

const auth = useAuthStore()
const user = useUserStore();
const { isAuthenticated } = storeToRefs(auth)
const { role } = storeToRefs(user)
const hasPending = ref();
const route = useRoute()

const navigation = [
  { name: 'Home', route: '/', roles: ['guest', 'user', 'admin', 'demo_admin']},
  { name: 'Dashboard', route: '/user', roles: ['user']},
  { name: 'About', route: '/about', roles: ['guest', 'user', 'admin', 'demo_admin']},
  { name: 'Login', route: '/login', roles: ['guest']},
  { name: 'Admin', route: '/admin', roles: ['admin', 'demo_admin']},
];

const navLinks = computed(() =>
  navigation
    .filter(item => item.roles.includes(role.value || 'guest'))
    .map(item => ({
      ...item,
      current: route.path === item.route
    }))
)

onMounted(async () => {
  if(auth.isAuthenticated)
  {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}`+'/api/reservations/has-pending',
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      }
    )
    hasPending.value = res.data.hasPending
  }
})

const profileRoute = computed(() => {
  return user.role === 'admin' || user.role === 'demo_admin'
    ? { name: 'admin.profile' }
    : { name: 'user.profile' };
});

async function logout() {
  try {
    await auth.logout()
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    user.clearUser()
    router.push(`/`)
  }
}

</script>
