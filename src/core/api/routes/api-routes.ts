const AR_KEYS = {
    AUTH: '/auth',
    MODULES: '/modules',
    LEARNING_OBJECTS: '/learning-objects',
    ACTIVITIES: '/activities',
    ENROLLMENTS: '/enrollments',
    USERS: '/users',
    FILES: '/files',
    CONTENT_GENERATION: '/content',
    AI_CONFIG: '/ai/config',
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
    LEARNING_OBJECTS: {
        CREATE: `${AR_KEYS.LEARNING_OBJECTS}`,
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
            CREATE: `/pages/student-questions`,
            UPDATE: (id: number) => `/pages/student-questions/${id}`,
            DELETE: (id: number) => `/pages/student-questions/${id}`,
        },
        QUESTION_REPLIES: {
            CREATE: `/pages/question-replies`,
            UPDATE: (id: number) => `/pages/question-replies/${id}`,
            DELETE: (id: number) => `/pages/question-replies/${id}`,
        },
        FEEDBACKS: {
            CREATE: `/learning-object-feedbacks`,
            UPDATE: (feedbackId: number) => `/learning-object-feedbacks/${feedbackId}`,
            DELETE: (feedbackId: number) => `/learning-object-feedbacks/${feedbackId}`,
        },
        ACTIVITIES: {
            LIST: (learningObjectId: number) => `${AR_KEYS.LEARNING_OBJECTS}/${learningObjectId}/activities`,
            CREATE: (learningObjectId: number) => `${AR_KEYS.LEARNING_OBJECTS}/${learningObjectId}/activities`,
            BY_ID: (learningObjectId: number, activityId: number) => `${AR_KEYS.LEARNING_OBJECTS}/${learningObjectId}/activities/${activityId}`,
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
        GENERATE_IMAGE: `${AR_KEYS.CONTENT_GENERATION}/generate-image`,
        GENERATE_ACTIVITY: `${AR_KEYS.CONTENT_GENERATION}/generate-activity`,
        EXTRACT_CONCEPTS: `${AR_KEYS.CONTENT_GENERATION}/extract-concepts`,
        EXTRACT_RELATIONS: `${AR_KEYS.CONTENT_GENERATION}/generate-relations`,
    },
}
