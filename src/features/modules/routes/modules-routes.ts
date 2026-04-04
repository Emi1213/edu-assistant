import type { RouteRecordRaw } from 'vue-router';

export const modulesRoutes: RouteRecordRaw[] = [
  {
    path: '/modules',
    component: () => import('@/core/layout/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'modules',
        component: () => import('../presentation/containers/modules-list-container.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
          roles: ['TEACHER', 'STUDENT'],
        },
      },
      {
        path: ':id/wiki',
        name: 'module-wiki',
        component: () => import('../presentation/views/module-wiki-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
          roles: ['TEACHER', 'STUDENT'],
        },
      },
      {
        path: ':id/students',
        name: 'module-students',
        component: () => import('@/features/enrollments/presentation/views/module-students-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
          roles: ['TEACHER'],
        },
      },
      {
        path: ':id/learning-objects/:learningObjectId',
        name: 'learning-object-detail',
        component: () => import('@/features/learning-objects/presentation/views/learning-object-detail-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
          roles: ['TEACHER', 'STUDENT'],
        },
      },
      {
        path: ':id/learning-objects/:learningObjectId/activities',
        name: 'learning-object-activities',
        component: () => import('@/features/activities/presentation/views/learning-object-activities-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
          roles: ['TEACHER', 'STUDENT'],
        },
      },
      {
        path: ':id/learning-objects/:learningObjectId/edit',
        name: 'learning-object-edit',
        component: () => import('@/features/learning-objects/presentation/views/learning-object-editor-view.vue'),
        meta: {
          layout: 'minimal',
          requiresAuth: true,
          roles: ['TEACHER'], 
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
          roles: ['STUDENT'], 
        },
      }
    ]
  }
]
