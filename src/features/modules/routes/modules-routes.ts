import type { RouteRecordRaw } from 'vue-router';

export const MODULES_ROUTES_NAMES = {
  MODULES: 'modules',
  MODULE_WIKI: 'module-wiki',
  MODULE_STUDENTS: 'module-students',
  LEARNING_OBJECT_DETAIL: 'learning-object-detail',
  PAGE_DETAIL: 'page-detail',
  VIDEO_DETAIL: 'video-detail',
  LEARNING_OBJECT_ACTIVITIES: 'learning-object-activities',
  LEARNING_OBJECT_EDIT: 'learning-object-edit',
  MODULE_TEACHER_FEEDBACK: 'module-teacher-feedback',
  MODULE_STUDENT_FEEDBACK: 'module-student-feedback',
  ALL_MODULES: 'all-modules',
} as const;

export const modulesRoutes: RouteRecordRaw[] = [
  {
    path: '/modules',
    component: () => import('@/core/layout/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: MODULES_ROUTES_NAMES.MODULES,
        component: () => import('../presentation/containers/modules-list-container.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
          roles: ['TEACHER', 'STUDENT'],
        },
      },
      {
        path: ':id/wiki',
        name: MODULES_ROUTES_NAMES.MODULE_WIKI,
        component: () => import('../presentation/views/module-wiki-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
          roles: ['TEACHER', 'STUDENT'],
        },
      },
      {
        path: ':id/teacher-feedback',
        name: MODULES_ROUTES_NAMES.MODULE_TEACHER_FEEDBACK,
        component: () => import('@/features/teacher-feedback/presentation/views/module-teacher-feedbacks-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
          roles: ['TEACHER'],
        },
      },
      {
        path: ':id/feedback',
        name: MODULES_ROUTES_NAMES.MODULE_STUDENT_FEEDBACK,
        component: () => import('@/features/student-ai-feedback/presentation/views/module-student-feedbacks-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
          roles: ['STUDENT', 'TEACHER'],
        },
      },
      {
        path: ':id/students',
        name: MODULES_ROUTES_NAMES.MODULE_STUDENTS,
        component: () => import('@/features/enrollments/presentation/views/module-students-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
          roles: ['TEACHER'],
        },
      },
      {
        path: ':id/learning-objects/:learningObjectId',
        name: MODULES_ROUTES_NAMES.LEARNING_OBJECT_DETAIL,
        component: () => import('@/features/learning-objects/presentation/views/learning-object-detail-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
          roles: ['TEACHER', 'STUDENT'],
        },
      },
      {
        path: ':id/pages/:learningObjectId',
        name: MODULES_ROUTES_NAMES.PAGE_DETAIL,
        component: () => import('@/features/learning-objects/presentation/views/learning-object-detail-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
          roles: ['TEACHER', 'STUDENT'],
        },
      },
      {
        path: ':id/videos/:learningObjectId',
        name: MODULES_ROUTES_NAMES.VIDEO_DETAIL,
        component: () => import('@/features/videos/presentation/views/video-detail-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
          roles: ['TEACHER', 'STUDENT'],
        },
      },
      {
        path: ':id/learning-objects/:learningObjectId/activities',
        name: MODULES_ROUTES_NAMES.LEARNING_OBJECT_ACTIVITIES,
        component: () => import('@/features/activities/presentation/views/learning-object-activities-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
          roles: ['TEACHER', 'STUDENT'],
        },
      },
      {
        path: ':id/learning-objects/:learningObjectId/edit',
        name: MODULES_ROUTES_NAMES.LEARNING_OBJECT_EDIT,
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
        name: MODULES_ROUTES_NAMES.ALL_MODULES,
        component: () => import('../presentation/views/available-modules-list-view.vue'),
        meta: {
          layout: 'dashboard',
          requiresAuth: true,
          roles: ['STUDENT', 'TEACHER'], 
        },
      }
    ]
  }
]
