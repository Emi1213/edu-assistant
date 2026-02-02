<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

const props = defineProps<{
  isOpen: boolean
  title: string
  onClose: () => void
}>()

const isMobile = useMediaQuery('(max-width: 768px)')

const handleOpenChange = (open: boolean) => {
  if (!open) {
    props.onClose()
  }
}
</script>

<template>
  <Dialog v-if="!isMobile" :open="isOpen" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>
      <slot />
    </DialogContent>
  </Dialog>

  <Drawer v-else :open="isOpen" @update:open="handleOpenChange">
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>{{ title }}</DrawerTitle>
      </DrawerHeader>
      <div class="px-4 pb-6">
        <slot />
      </div>
    </DrawerContent>
  </Drawer>
</template>
