import type { ModuleQueryParams } from "@/features/modules/types/modules.types";

export const QUERY_KEYS = {
    MODULES: (params?: ModuleQueryParams) => ['modules', params],
}