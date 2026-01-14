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
]
