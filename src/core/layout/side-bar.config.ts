/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookOpen, Home, GraduationCap, Library } from 'lucide-vue-next'

export interface SidebarItem {
  label: string
  route: string
  icon?: any
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
  },
]
