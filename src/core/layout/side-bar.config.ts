/* eslint-disable @typescript-eslint/no-explicit-any */
import { Home } from 'lucide-vue-next'

export interface SidebarItem {
  label: string
  route: string
  icon?: any
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: 'Inicio',
    route: '/',
    icon: Home,
  },
]
