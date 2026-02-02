<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

defineProps<{
  visible: boolean;
  title?: string;
  message?: string;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const closeDialog = () => {
  emit("cancel");
};

const handleOpenChange = (open: boolean) => {
  if (!open) {
    emit("cancel");
  }
};
</script>

<template>
  <Dialog :open="visible" @update:open="handleOpenChange">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title || "Confirmar acción" }}</DialogTitle>
        <DialogDescription>
          {{ message || "¿Estás seguro de que quieres continuar?" }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          type="button"
          @click="closeDialog"
          variant="ghost"
          data-testid="cancel-button"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          @click="$emit('confirm')"
          variant="default"
          data-testid="confirm-button"
        >
          Confirmar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>