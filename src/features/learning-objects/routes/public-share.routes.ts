import type { RouteRecordRaw } from 'vue-router'

export const SHARED_LEARNING_OBJECT_ROUTE_NAME = 'shared-learning-object' as const

export const publicShareRoutes: RouteRecordRaw[] = [
  {
    path: '/w/:learningObjectId',
    name: SHARED_LEARNING_OBJECT_ROUTE_NAME,
    component: () => import('../presentation/views/public-learning-object-view.vue'),
    meta: {
      requiresAuth: false,
    },
  },
]
