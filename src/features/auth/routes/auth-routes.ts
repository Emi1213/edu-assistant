export const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../presentation/views/login-view.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/auth/success',
    name: 'auth-success',
    component: () => import('../presentation/views/auth-success-view.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/auth/google/callback',
    name: 'google-auth-callback',
    component: () => import('../presentation/views/google-auth-callback-view.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/auth/error',
    name: 'auth-error',
    component: () => import('../presentation/views/auth-error-view.vue'),
    meta: {
      requiresAuth: false,
    },
  },
]
