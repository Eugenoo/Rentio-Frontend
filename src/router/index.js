import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue"
import AboutView from "@/views/AboutView.vue"
import CarView from '@/views/car/CarView.vue'
import AdminHomeView from "@/views/admin/AdminHomeView.vue";
import AdminManageView from "@/views/admin/AdminManageView.vue";
import {useAuthStore} from "@/stores/auth.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AboutView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/details/:carName',
      name: 'carDetails',
      component: CarView,
    },
    {
      path: '/panel',
      name: 'panel',
      component: AdminHomeView,
      meta: {requiresAuth: true}
    },
    {
      path: '/admin/manage',
      name: 'adminManage',
      component: AdminManageView,
      meta: {requiresAuth: true}
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if(to.meta.requiresAuth && !authStore.token) {
    return next({name: 'login'});
  }
  next();
})

export default router
