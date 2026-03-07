import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/core/layout/DashboardLayout.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'] },
    children: [
      {
        path: '',
        name: 'admin',
        component: () => import('../presentation/views/admin-view.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, roles: ['ADMIN'] },
      },
    ],
  },
]
