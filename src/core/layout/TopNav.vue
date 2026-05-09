<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { SIDEBAR_ITEMS } from './side-bar.config'
import HeaderUser from './HeaderUser.vue'
import { useRoles } from '@/features/auth/composables/use-roles'

const route = useRoute()
const { canAccess } = useRoles()

const visibleNavItems = computed(() => {
  return SIDEBAR_ITEMS.filter(item => canAccess(item.roles))
})

function isActiveRoute(itemRoute: string): boolean {
  return route.path === itemRoute || route.path.startsWith(itemRoute + '/')
}
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
  >
    <div class="flex h-14 items-center gap-4 px-4 sm:px-6">
      <RouterLink
        to="/modules"
        class="flex items-center gap-3 shrink-0 rounded-lg transition-opacity hover:opacity-90"
      >
        <div class="flex h-10 w-10 items-center justify-center rounded-lg p-1 shadow-sm">
          <img
            src="/images/logo2.png"
            alt="UTA Logo"
            class="h-full w-full rounded object-contain"
          />
        </div>
      </RouterLink>

      <!-- Navegación central -->
      <nav class="flex flex-1 items-center justify-center gap-1">
        <RouterLink
          v-for="item in visibleNavItems"
          :key="item.route"
          :to="item.route"
          class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="isActiveRoute(item.route)
            ? 'bg-[#233a83]/10 text-[#233a83] dark:bg-[#233a83]/20 dark:text-[#9fb3ff]'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
        >
          <component
            v-if="item.icon"
            :is="item.icon"
            class="size-4 shrink-0"
          />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- Usuario -->
      <div class="shrink-0">
        <HeaderUser />
      </div>
    </div>
  </header>
</template>
