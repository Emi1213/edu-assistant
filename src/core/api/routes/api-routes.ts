const AR_KEYS = {
    AUTH: '/auth',
    MODULES: '/modules',
    LEARNING_OBJECTS: '/learning-objects',
    LEARNING_OBJECT_TYPES: '/learning-object-types',
    ACTIVITIES: '/activities',
    ENROLLMENTS: '/enrollments',
    USERS: '/users',
    FILES: '/files',
    CONTENT_GENERATION: '/content',
    AI_CONFIG: '/ai/config',
    PAGES: '/pages',
    LEARNING_OBJECT_FEEDBACKS: '/learning-object-feedbacks',
    CHAT: '/sessions',
}

export const API_ROUTES = {
    AUTH: {
        MICROSOFT_LOGIN: `${AR_KEYS.AUTH}/microsoft`,
        ME: `${AR_KEYS.AUTH}/profile`,
        TEACHERS_EMAILS: `${AR_KEYS.AUTH}/config/teachers/emails`,
    },
    AI_CONFIG: {
        GET: AR_KEYS.AI_CONFIG,
        PATCH: AR_KEYS.AI_CONFIG,
        MODELS_RESPONSES: `${AR_KEYS.AI_CONFIG}/models/responses`,
        MODELS_EMBEDDINGS: `${AR_KEYS.AI_CONFIG}/models/embeddings`,
        MODELS_IMAGES: `${AR_KEYS.AI_CONFIG}/models/images`,
    },
    MODULES: {
        CREATE: `${AR_KEYS.MODULES}`,
        GET_ALL: `${AR_KEYS.MODULES}`,
        GET_AVAILABLE: `${AR_KEYS.MODULES}/available`,
        GET_BY_ID: (id: number) => `${AR_KEYS.MODULES}/${id}`,
        UPDATE: (id: number) => `${AR_KEYS.MODULES}/${id}`,
    },
    LEARNING_OBJECT_TYPES: {
        GET_ALL: AR_KEYS.LEARNING_OBJECT_TYPES,
    },
    LEARNING_OBJECTS: {
        CREATE: `${AR_KEYS.LEARNING_OBJECTS}`,
        REORDER: `${AR_KEYS.LEARNING_OBJECTS}/reorder`,
        GET_BY_MODULE_ID: (moduleId: number) => `${AR_KEYS.LEARNING_OBJECTS}/module/${moduleId}`,
        GET_BY_ID: (id: number) => `${AR_KEYS.LEARNING_OBJECTS}/${id}`,
        UPDATE: (id: number) => `${AR_KEYS.LEARNING_OBJECTS}/${id}`,
        UPDATE_CONTENT: (id: number) => `${AR_KEYS.LEARNING_OBJECTS}/${id}/content`,
        CREATE_CONCEPT: (learningObjectId: number) => `${AR_KEYS.LEARNING_OBJECTS}/${learningObjectId}/concepts`,
        NOTES: {
            CREATE: `${AR_KEYS.LEARNING_OBJECTS}/notes`,
            UPDATE: (noteId: number) => `${AR_KEYS.LEARNING_OBJECTS}/notes/${noteId}`,
            DELETE: (noteId: number) => `${AR_KEYS.LEARNING_OBJECTS}/notes/${noteId}`,
        },
        STUDENT_QUESTIONS: {
            CREATE: `${AR_KEYS.PAGES}/student-questions`,
            UPDATE: (id: number) => `${AR_KEYS.PAGES}/student-questions/${id}`,
            DELETE: (id: number) => `${AR_KEYS.PAGES}/student-questions/${id}`,
        },
        QUESTION_REPLIES: {
            CREATE: `${AR_KEYS.PAGES}/question-replies`,
            UPDATE: (id: number) => `${AR_KEYS.PAGES}/question-replies/${id}`,
            DELETE: (id: number) => `${AR_KEYS.PAGES}/question-replies/${id}`,
        },
        FEEDBACKS: {
            CREATE: `${AR_KEYS.LEARNING_OBJECT_FEEDBACKS}`,
            UPDATE: (feedbackId: number) => `${AR_KEYS.LEARNING_OBJECT_FEEDBACKS}/${feedbackId}`,
            DELETE: (feedbackId: number) => `${AR_KEYS.LEARNING_OBJECT_FEEDBACKS}/${feedbackId}`,
        },
        ACTIVITIES: {
            LIST: (learningObjectId: number) => `${AR_KEYS.LEARNING_OBJECTS}/${learningObjectId}/activities`,
            CREATE: (learningObjectId: number) => `${AR_KEYS.LEARNING_OBJECTS}/${learningObjectId}/activities`,
            BY_ID: (learningObjectId: number, activityId: number) => `${AR_KEYS.LEARNING_OBJECTS}/${learningObjectId}/activities/${activityId}`,
        },
        SESSIONS: {
            CREATE_OR_GET: (learningObjectId: number) => `${AR_KEYS.LEARNING_OBJECTS}/${learningObjectId}/sessions`,
        },
    },
    CHAT: {
        SESSIONS: {
            LIST_MESSAGES: (sessionId: number) => `${AR_KEYS.CHAT}/${sessionId}/messages`,
            SEND_MESSAGE: (sessionId: number) => `${AR_KEYS.CHAT}/${sessionId}/messages`,
        },
    },
    ACTIVITIES: {
        ATTEMPTS: (activityId: number) => `${AR_KEYS.ACTIVITIES}/${activityId}/attempts`,
    },
    ENROLLMENTS: {
        SELF_ENROLL: `${AR_KEYS.ENROLLMENTS}/self`,
        BULK_ENROLL: `${AR_KEYS.ENROLLMENTS}/bulk`,
        GET_MODULE_ENROLLMENTS: (moduleId: number) => `${AR_KEYS.ENROLLMENTS}/module/${moduleId}`,
        UPDATE: (id: number) => `${AR_KEYS.ENROLLMENTS}/${id}`,
        SELF_UNENROLL: (moduleId: number) => `${AR_KEYS.ENROLLMENTS}/self/${moduleId}`,
        REMOVE: (id: number) => `${AR_KEYS.ENROLLMENTS}/${id}`,
    },
    USERS: {
        STUDENTS: `${AR_KEYS.USERS}/students`,
    },
    FILES: {
        UPLOAD: `${AR_KEYS.FILES}/upload`,
    },
    CONTENT_GENERATION: {
        GENERATE: `${AR_KEYS.CONTENT_GENERATION}/generate-content`,
        REGENERATE_CONTENT: `${AR_KEYS.CONTENT_GENERATION}/regenerate-content`,
        GENERATE_IMAGE: `${AR_KEYS.CONTENT_GENERATION}/generate-image`,
        GENERATE_ACTIVITY: `${AR_KEYS.CONTENT_GENERATION}/generate-activity`,
        EXTRACT_CONCEPTS: `${AR_KEYS.CONTENT_GENERATION}/extract-concepts`,
        EXTRACT_RELATIONS: `${AR_KEYS.CONTENT_GENERATION}/generate-relations`,
        GENERATE_CONCEPT: `${AR_KEYS.CONTENT_GENERATION}/generate-concept`,
    },
}
