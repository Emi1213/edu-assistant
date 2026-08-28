import type { ModuleQueryParams } from "@/features/modules/types/modules.types";
import type { LearningObjectsQueryParams } from "@/features/learning-objects/types";
import type { StudentsQueryParams } from "@/features/users/types";
import type { VideoFiltersDto } from "@/features/videos/types/video.types";

export const QUERY_KEYS = {
    // Modules
    MODULES: (params?: ModuleQueryParams) => params ? ['modules', params] : ['modules'],
    MODULE: (id: number) => ['modules', id],
    AVAILABLE_MODULES: (params?: ModuleQueryParams) => params ? ['available-modules', params] : ['available-modules'],

    // Learning Objects (formerly Pages)
    LEARNING_OBJECTS: (params?: LearningObjectsQueryParams) => params ? ['learning-objects', params.moduleId, params] : ['learning-objects'],
    LEARNING_OBJECT: (id: number) => ['learning-object', id],
    LEARNING_OBJECT_PUBLIC: (id: number) => ['learning-object', 'public', id],
    LEARNING_OBJECT_TYPES: () => ['learning-object-types'],


    // Users / enrollments
    STUDENTS: (params?: StudentsQueryParams) => params ? ['students', params] : ['students'],
    ENROLLMENTS: () => ['enrollments'],
    MODULE_ENROLLMENTS: (moduleId?: number) =>
        moduleId != null ? ['module-enrollments', moduleId] : ['module-enrollments'],

    // Other
    ACTIVITIES: (learningObjectId: number) => ['activities', learningObjectId],
    AI_CONFIG: () => ['ai-config'],
    TEACHERS_EMAILS: () => ['teachers-emails'],

    CHAT_SESSIONS: (learningObjectId: number) => ['chat-sessions', learningObjectId],
    CHAT_MESSAGES: (sessionId: number) => ['chat-messages', sessionId],

    // Progress
    LO_PROGRESS: (learningObjectId: number) => ['lo-progress', learningObjectId],

    // Videos
    VIDEOS_BY_MODULE: (params: { moduleId: number; filters?: VideoFiltersDto }) =>
        params.filters ? ['videos', 'module', params.moduleId, params.filters] : ['videos', 'module', params.moduleId],
    VIDEO_DETAIL: (id: number) => ['videos', 'detail', id],
    VIDEO_STATUS: (id: number) => ['videos', 'status', id],
}
