import type { ModuleQueryParams } from "@/features/modules/types/modules.types";
import type { PagesQueryParams } from "@/features/pages/composables/queries/use-pages";

export const QUERY_KEYS = {
    MODULES: (params?: ModuleQueryParams) => ['modules', params],
    AVAILABLE_MODULES: (params?: ModuleQueryParams) => ['available-modules', params],
    PAGES: (params?: PagesQueryParams) => ['pages', params],
}