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
      },
      {
        path: ':id/wiki',
        name: 'module-wiki',
        component: () => import('../presentation/views/module-wiki-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
        },
      },
      {
        path: ':id/pages/:pageId',
        name: 'page-detail',
        component: () => import('@/features/pages/presentation/views/page-detail-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
        },
      }
    ]
  },
  {
    path: '/all-modules',
    component: () => import('@/core/layout/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'all-modules',
        component: () => import('../presentation/views/available-modules-list-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
        },
      }
    ]
  }
]
