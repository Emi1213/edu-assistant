<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import ModeToggle from '@/components/ui/mode-toggle.vue'
</script>

<template>
  <SidebarProvider>
    <Sidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card px-4 shadow-sm">
        <SidebarTrigger class="-ml-1 text-foreground hover:text-[#C8102E] transition-colors" />
        <div class="flex-1"></div>
        <div class="flex items-center gap-3">
          <ModeToggle />
          <div class="h-8 w-px bg-border"></div>
          <div class="text-sm text-muted-foreground">
            Universidad Técnica de Ambato
          </div>
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 bg-background">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
