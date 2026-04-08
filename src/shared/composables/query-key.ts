import type { ModuleQueryParams } from "@/features/modules/types/modules.types";
import type { PagesQueryParams } from "@/features/pages/types";
import type { StudentsQueryParams } from "@/features/users/types";

export const QUERY_KEYS = {
    // Modules
    MODULES: (params?: ModuleQueryParams) => params ? ['modules', params] : ['modules'],
    MODULE: (id: number) => ['modules', id],
    AVAILABLE_MODULES: (params?: ModuleQueryParams) => params ? ['available-modules', params] : ['available-modules'],

    // Pages
    PAGES: (params?: PagesQueryParams) => params ? ['pages', params] : ['pages'],
    PAGE: (id: number) => ['page', id],

    // Users / enrollments
    STUDENTS: (params?: StudentsQueryParams) => params ? ['students', params] : ['students'],
    ENROLLMENTS: () => ['enrollments'],
    MODULE_ENROLLMENTS: (moduleId?: number) =>
        moduleId != null ? ['module-enrollments', moduleId] : ['module-enrollments'],

    // Other
    ACTIVITIES: (pageId: number) => ['activities', pageId],
    AI_CONFIG: () => ['ai-config'],
    TEACHERS_EMAILS: () => ['teachers-emails'],
} 