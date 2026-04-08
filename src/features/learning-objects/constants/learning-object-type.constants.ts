import type { LearningObjectTypeConfig } from '../types/learning-object-type-config.types'
import { FileText } from 'lucide-vue-next'
import PagesTabContent from '@/features/pages/presentation/components/pages-tab-content.vue'

export const LEARNING_OBJECT_TYPE_CONFIG: Record<string, LearningObjectTypeConfig> = {
  PAGE: { label: 'Páginas', icon: FileText, tabContent: PagesTabContent },
}
