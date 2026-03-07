import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from '@/features/auth/routes/auth-routes'
import { authGuard } from '@/features/auth/guards/auth-guard'
import { dashboardRoutes } from '@/features/dashboard/routes/dashboard.routes'
import { modulesRoutes } from '@/features/modules/routes/modules-routes'
import { adminRoutes } from '@/features/admin/routes/admin.routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        return { name: 'modules' }
      },
      meta: { requiresAuth: true },
    },
    ...authRoutes,
    ...dashboardRoutes,
    ...modulesRoutes,
    ...adminRoutes,
  ],
})

router.beforeEach(authGuard)

export default router
