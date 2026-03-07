import type { ModuleQueryParams } from "@/features/modules/types/modules.types";
import type { PagesQueryParams } from "@/features/pages/composables/queries/use-pages";

export const QUERY_KEYS = {
    MODULES: (params?: ModuleQueryParams) => ['modules', params],
    MODULE: (id: number) => ['modules', id],
    AVAILABLE_MODULES: (params?: ModuleQueryParams) => ['available-modules', params],
    PAGES: (params?: PagesQueryParams) => ['pages', params],
    PAGE: (id: number) => ['page', id],
    ENROLLMENTS: () => ['enrollments'],
    MODULE_ENROLLMENTS: (moduleId: number) => ['module-enrollments', moduleId],
    ACTIVITIES: (pageId: number) => ['activities', pageId],
    AI_CONFIG: () => ['ai-config'],
    TEACHERS_EMAILS: () => ['teachers-emails'],
}