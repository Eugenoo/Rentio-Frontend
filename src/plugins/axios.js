import axios from 'axios';
import {useAuthStore} from '@/stores/auth'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  //withCredentials: true,    //Uncomment if youre using cookies
})

//Add Authorization Header
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  if (authStore.token){
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  return config;
});

export default api;
