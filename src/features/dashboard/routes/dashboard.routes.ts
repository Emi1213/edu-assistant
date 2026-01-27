import type { RouteRecordRaw } from 'vue-router'

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: () => import('@/core/layout/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/features/dashboard/presentation/views/DashboardView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true },
      },
    ],
  },
]
