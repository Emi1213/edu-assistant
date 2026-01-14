<script setup lang="ts">
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
import { RouterLink } from 'vue-router'
import { SIDEBAR_ITEMS } from './side-bar.config'
import NavUser from './NavUser.vue'
</script>

<template>
  <Sidebar>
    <SidebarHeader>
      <div class="px-4 py-3 font-semibold text-sm">Edu Assistant</div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem v-for="item in SIDEBAR_ITEMS" :key="item.route">
          <SidebarMenuButton as-child>
            <RouterLink :to="item.route">
              <component v-if="item.icon" :is="item.icon" />
              <span>{{ item.label }}</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
    <SidebarRail />
    <SidebarFooter>
      <NavUser />
    </SidebarFooter>
  </Sidebar>
</template>
