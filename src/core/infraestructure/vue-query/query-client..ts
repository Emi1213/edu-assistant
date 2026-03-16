import { QueryClient } from '@tanstack/vue-query'

export const vueQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      
    },
  },
})
