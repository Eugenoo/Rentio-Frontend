import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index.js'
import { useAuthStore } from '@/stores/auth.js'

async function bootstrap() {

  const app = createApp(App)

  const pinia = createPinia()
  app.use(pinia)

  const auth = useAuthStore()

  // restore session before mount
  await auth.initAuth()

  app.use(router)
  app.mount('#app')

}

bootstrap()
