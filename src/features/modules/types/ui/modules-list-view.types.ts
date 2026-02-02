import type { Module } from '../modules.types'

export interface IModulesListViewProps {
  modules: Module[]
  loading: boolean
  searchQuery: string
  onEdit: (module: Module) => void
  onDelete: (module: Module) => void
  onAdd: () => void
  onClick?: (module: Module) => void
  onUpdateSearch: (query: string) => void
  onClearFilters: () => void
}
