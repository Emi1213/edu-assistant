<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
</script>

<template>
  <SidebarProvider>
    <Sidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <div class="flex-1"></div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
