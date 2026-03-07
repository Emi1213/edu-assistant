<script setup lang="ts">
import { ChevronDown, LogOut, UserCircle, Sun, Moon, Monitor } from 'lucide-vue-next'
import { computed, ref, onMounted } from 'vue'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/features/auth/context/auth-store'
import { useAuth } from '@/features/auth/composables/use-auth'

type Theme = 'light' | 'dark' | 'system'

const theme = ref<Theme>('system')

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(newTheme: Theme) {
  const root = document.documentElement
  const actualTheme = newTheme === 'system' ? getSystemTheme() : newTheme

  if (actualTheme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

function setTheme(newTheme: Theme) {
  theme.value = newTheme
  localStorage.setItem('theme', newTheme)
  applyTheme(newTheme)
}

onMounted(() => {
  const stored = localStorage.getItem('theme') as Theme | null
  if (stored && ['light', 'dark', 'system'].includes(stored)) {
    theme.value = stored
  }
  applyTheme(theme.value)

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    if (theme.value === 'system') {
      applyTheme('system')
    }
  })
})

const authStore = useAuthStore()
const { logout } = useAuth()

const user = computed(() => authStore.user)

const displayName = computed(() => {
  if (!user.value) return 'Usuario'
  return user.value.displayName || `${user.value.name} ${user.value.lastName}`.trim() || user.value.email || 'Usuario'
})

const email = computed(() => user.value?.email || '')
const avatar = computed(() => user.value?.profilePicture || '')
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted"
      >
        <Avatar class="h-8 w-8 rounded-lg">
          <AvatarImage :src="avatar" :alt="displayName" />
          <AvatarFallback class="rounded-lg text-sm">
            {{ displayName.charAt(0).toUpperCase() }}
          </AvatarFallback>
        </Avatar>
        <div class="hidden text-left sm:block">
          <p class="text-sm font-medium leading-tight truncate max-w-[140px]">
            {{ displayName }}
          </p>
          <p class="text-xs text-muted-foreground truncate max-w-[140px]">
            {{ email }}
          </p>
        </div>
        <ChevronDown class="size-4 shrink-0 text-muted-foreground" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="min-w-56 rounded-lg"
      side="bottom"
      align="end"
      :side-offset="8"
    >
      <DropdownMenuLabel class="p-0 font-normal">
        <div class="flex items-center gap-2 px-2 py-2 text-left text-sm">
          <Avatar class="h-9 w-9 rounded-lg">
            <AvatarImage :src="avatar" :alt="displayName" />
            <AvatarFallback class="rounded-lg">
              {{ displayName.charAt(0).toUpperCase() }}
            </AvatarFallback>
          </Avatar>
          <div class="grid flex-1 text-left text-sm leading-tight min-w-0">
            <span class="truncate font-medium">{{ displayName }}</span>
            <span class="text-muted-foreground truncate text-xs">
              {{ email }}
            </span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <UserCircle class="mr-2 h-4 w-4" />
          <span>Mi Perfil</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuLabel class="px-2 py-1.5 text-xs font-normal text-muted-foreground">
        Tema
      </DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem @click="setTheme('light')">
          <Sun class="mr-2 h-4 w-4" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem @click="setTheme('dark')">
          <Moon class="mr-2 h-4 w-4" />
          <span>Oscuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem @click="setTheme('system')">
          <Monitor class="mr-2 h-4 w-4" />
          <span>Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="logout">
        <LogOut class="mr-2 h-4 w-4" />
        <span>Cerrar Sesión</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
