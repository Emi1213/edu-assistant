import type { LearningObjectTypeConfig } from '../types/learning-object-type-config.types'
import { FileText, Video } from 'lucide-vue-next'
import { MODULES_ROUTES_NAMES } from '@/features/modules/routes/modules-routes'

export const LEARNING_OBJECT_TYPE_CONFIG: Record<string, LearningObjectTypeConfig> = {
  PAGE: {
    tabLabel: 'Páginas',
    createLabel: 'Página',
    icon: FileText,
    detailRouteName: MODULES_ROUTES_NAMES.PAGE_DETAIL,
  },
  VIDEO: {
    tabLabel: 'Videos',
    createLabel: 'Video',
    icon: Video,
    detailRouteName: MODULES_ROUTES_NAMES.VIDEO_DETAIL,
  },
}

export const FALLBACK_DETAIL_ROUTE_NAME = MODULES_ROUTES_NAMES.LEARNING_OBJECT_DETAIL
