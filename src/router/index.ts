import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from '@/features/auth/routes/auth-routes'
import { authGuard } from '@/features/auth/guards/auth-guard'
import { dashboardRoutes } from '@/features/dashboard/routes/dashboard.routes'
import { modulesRoutes } from '@/features/modules/routes/modules-routes'

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
    ...modulesRoutes,
  ],
})

router.beforeEach(authGuard)

export default router
