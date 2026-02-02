<script setup lang="ts">
import { computed } from 'vue'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { RouterLink, useRoute } from "vue-router";
import { SIDEBAR_ITEMS } from './side-bar.config';
import NavUser from './NavUser.vue';
import { useRoles } from '@/features/auth/composables/use-roles';

const route = useRoute()
const { canAccess } = useRoles()

const visibleSidebarItems = computed(() => {
  return SIDEBAR_ITEMS.filter(item => canAccess(item.roles))
})

function isActiveRoute(itemRoute: string): boolean {
  if (itemRoute === '/') {
    return route.path === '/' || route.path === '/dashboard'
  }
  return route.path === itemRoute || route.path.startsWith(itemRoute + '/')
}

</script>

<template>
  <Sidebar class="border-r border-sidebar-border">
    <SidebarHeader class="bg-gradient-to-br from-[#C8102E] to-[#E63946] text-white border-b border-[#B00E26]">
      <div class="px-4 py-2">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md p-1.5">
            <img 
              src="/images/logo.jpg" 
              alt="UTA Logo" 
              class="w-full h-full object-contain rounded"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="font-bold text-sm leading-tight truncate">Edu Assistant</h2>
            <p class="text-xs text-white/80 leading-tight truncate">Sistema Educativo</p>
          </div>
        </div>
      </div>
    </SidebarHeader>

    <SidebarContent class="py-4 sidebar-scrollable-content">
      <SidebarMenu class="space-y-1">
        <SidebarMenuItem
          v-for="item in visibleSidebarItems"
          :key="item.route"
        >
          <SidebarMenuButton 
            as-child
            class="group"
          >
            <RouterLink 
              :to="item.route"
              class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out mx-2 group"
              :class="isActiveRoute(item.route)
                ? 'bg-sidebar-accent text-[#C8102E] dark:text-red-400 font-semibold border-l-4 border-[#C8102E] dark:border-red-500' 
                : 'hover:bg-sidebar-accent hover:text-[#C8102E] dark:hover:text-red-400 text-sidebar-foreground hover:translate-x-1'"
            >
              <component 
                v-if="item.icon" 
                :is="item.icon" 
                class="size-5 transition-transform flex-shrink-0"
                :class="isActiveRoute(item.route) 
                  ? 'text-[#C8102E] dark:text-red-400' 
                  : 'text-sidebar-foreground/70 group-hover:text-[#C8102E] dark:group-hover:text-red-400'"
              />
              <span class="text-sm">{{ item.label }}</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
    <SidebarRail />
    <SidebarFooter class="border-t border-sidebar-border pt-2">
      <NavUser />
    </SidebarFooter>
  </Sidebar>
</template>
