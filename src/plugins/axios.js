import axios from 'axios';
import {useUserStore} from '@/stores/user.js'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  //withCredentials: true,    //Uncomment if youre using cookies
})

//Add Authorization Header
api.interceptors.request.use((config) => {
  const authStore = useUserStore();

  if (authStore.token){
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  return config;
});

export default api;
