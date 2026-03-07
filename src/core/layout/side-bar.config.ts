/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraduationCap, Library, Settings } from 'lucide-vue-next'
import type { Role } from '@/features/auth/types/roles.enum'

export interface SidebarItem {
  label: string
  route: string
  icon?: any
  roles?: Role[]
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: 'Mis Módulos',
    route: '/modules',
    icon: GraduationCap,
  },
  {
    label: 'Módulos disponibles',
    route: '/all-modules',
    icon: Library,
    roles: ['STUDENT'],
  },
  {
    label: 'Configuración',
    route: '/admin',
    icon: Settings,
    roles: ['ADMIN'],
  },
]
