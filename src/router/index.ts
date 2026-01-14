import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from '@/features/auth/routes/auth-routes'
import { authGuard } from '@/features/auth/guards/auth-guard'
import { dashboardRoutes } from '@/features/dashboard/routes/dashboard.routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        return { name: 'dashboard' }
      },
      meta: { requiresAuth: true },
    },
    ...authRoutes,
    ...dashboardRoutes,
  ],
})

router.beforeEach(authGuard)

export default router
