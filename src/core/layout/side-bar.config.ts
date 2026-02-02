/* eslint-disable @typescript-eslint/no-explicit-any */
import { Home, GraduationCap, Library } from 'lucide-vue-next'
import type { Role } from '@/features/auth/types/roles.enum'

export interface SidebarItem {
  label: string
  route: string
  icon?: any
  roles?: Role[] 
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: 'Dashboard',
    route: '/',
    icon: Home,
  },
  {
    label: 'Mis Módulos',
    route: '/modules',
    icon: GraduationCap,
  },
  {
    label: 'Módulos',
    route: '/all-modules',
    icon: Library,
    roles: ['STUDENT'], 
  },
]
