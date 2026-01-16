import type { RouteRecordRaw } from 'vue-router';

export const modulesRoutes: RouteRecordRaw[] = [
  {
    path: '/modules',
    component: () => import('@/core/layout/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'modules',
        component: () => import('../presentation/views/modules-list-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
        },
      }
    ]
  },
]
