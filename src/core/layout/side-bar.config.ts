/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookOpen, Home } from 'lucide-vue-next'

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
    label: 'Modulos',
    route: '/modules',
    icon: BookOpen,
  },
]
