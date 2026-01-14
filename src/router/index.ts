import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from '@/features/auth/routes/auth-routes'
import { authGuard } from '@/features/auth/guards/auth-guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes,
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/HomeView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach(authGuard)

export default router
