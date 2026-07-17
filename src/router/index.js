import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue"
import AboutView from "@/views/AboutView.vue"
import CarView from '@/views/car/CarView.vue'
import AdminHomeView from "@/views/admin/AdminHomeView.vue";
import AdminManageView from "@/views/admin/AdminManageView.vue";
import Products from '@/components/Admin/Panel/Products/Products.vue'
import Categories from '@/components/Admin/Panel/Categories/Categories.vue'
import EditProductModal from '@/components/Admin/Panel/Products/EditProductModal.vue'
import Reservations from '@/components/Admin/Panel/Reservations/Reservations.vue'
import UserHomeView from '@/views/user/UserHomeView.vue'
import UserReservation from '@/components/User/Reservations/ReservationComponent.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import UserDashboard from '@/components/User/Dashboard/UserDashboard.vue'
import UserProfile from '@/components/User/Profile/UserProfile.vue'
import UserCalendar from '@/components/User/Callendar/UserCalendar.vue'
import UserDocuments from '@/components/User/Documents/UserDocuments.vue'
import UserPayments from '@/components/User/Payments/UserPayments.vue'
import Profile from '@/components/Admin/Panel/Profile/Profile.vue'
import EditCategoryModal from '@/components/Admin/Panel/Categories/EditCategoryModal.vue'
import { useAuthStore } from '@/stores/auth.js'
import { useUserStore } from "@/stores/user.js";
import CompleteProfile from '@/components/User/CompleteProfile/CompleteProfile.vue'
import Users from '@/components/Admin/Panel/Users/Users.vue'
import Dashboard from '@/components/Admin/Panel/Dashboard/Dashboard.vue'
import PaymentCompleteComponent from '@/components/Payment/PaymentCompleteComponent.vue'

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
      path: '/admin',
      name: 'admin',
      redirect: '/admin/dashboard',
      component: AdminHomeView,
      meta: {requiresAuth: true, roles: ['admin', 'demo_admin']},
      children: [
        {
          path: 'products',
          component: Products,
          children: [
            {
              path: 'productDetails/:slug',
              component: EditProductModal,
              name: 'item-details'
            }
          ]
        },
        {
          path: 'categories',
          component: Categories,
          children: [
            {
              path: 'categoryDetails/:slug',
              component: EditCategoryModal,
            }
          ]
        },
        {
          path: 'reservations',
          name: 'admin.reservations',
          component: Reservations
        },
        {
          path: 'profile',
          name: 'admin.profile',
          component: Profile
        },
        {
          path: 'users',
          name: 'admin.users',
          component: Users,
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard
        }
      ]
    },
    {
      path: '/admin/manage',
      name: 'adminManage',
      component: AdminManageView,
      meta: {requiresAuth: true}
    },
    {
      path: '/user',
      name: 'user',
      component: UserHomeView,
      meta: {requiresAuth: true, roles: ['user']},
      redirect: '/user/panel',
      children: [
        {
          path: 'panel',
          name: 'panel',
          component: UserDashboard,
        },
        {
          path: 'reservations',
          name: 'reservationDetails',
          component: UserReservation,
        },
        {
          path: 'documents',
          name: 'documentDetails',
          component: UserDocuments,
        },
        {
          path: 'payments',
          name: 'paymentDetails',
          component: UserPayments,
        },
        {
          path: 'profile',
          name: 'user.profile',
          component: UserProfile,
        },
        {
          path: 'calendar',
          name: 'calendarDetails',
          component: UserCalendar,
        },
        // {
        //   path: 'completeProfile',
        //   name: 'completeProfile',
        //   component: CompleteProfile,
        // }
      ]
    },
    {
      path: '/reset-password/:token',
      component: ResetPasswordView
    },
    {
      path: '/user/completeProfile',
      name: 'completeProfile',
      component: CompleteProfile,
    },
    {
      path: '/payment/complete',
      name: 'payment.complete',
      component: PaymentCompleteComponent
    }
  ],

})

router.beforeEach((to) => {
  const authStore = useAuthStore();
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !authStore.accessToken) {
    return { name: 'login' };
  }

  if (to.meta.roles && !to.meta.roles.includes(userStore.role)) {
    return { name: 'login' };
  }
  if (
    userStore.user &&
    !userStore.user.profile_completed &&
    to.name !== 'completeProfile'
  ) {
    return { name: 'completeProfile' };
  }
});

export default router
