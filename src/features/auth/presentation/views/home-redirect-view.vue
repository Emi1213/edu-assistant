<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../context/auth-store'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  const role = authStore.user?.role
  if (role === 'ADMIN') {
    router.replace({ name: 'admin' })
  } else {
    router.replace({ name: 'modules' })
  }
})
</script>

<template>
  <div class="flex min-h-[40vh] items-center justify-center">
    <p class="text-muted-foreground">Redirigiendo...</p>
  </div>
</template>
