<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
</script>

<template>
  <SidebarProvider>
    <Sidebar />
    <SidebarInset>
      <div class="flex flex-1 flex-col gap-4 p-4 bg-background">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
