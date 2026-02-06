const AR_KEYS = {
    AUTH: '/auth',
    MODULES: '/modules',
    PAGES: '/pages',
    ENROLLMENTS: '/enrollments',
    CONTENT_GENERATION: '/content',
}

export const API_ROUTES = {
    AUTH: {
        MICROSOFT_LOGIN: `${AR_KEYS.AUTH}/microsoft`,
        ME: `${AR_KEYS.AUTH}/profile`,
    },
    MODULES: {
        CREATE: `${AR_KEYS.MODULES}`,
        GET_ALL: `${AR_KEYS.MODULES}`,
        GET_AVAILABLE: `${AR_KEYS.MODULES}/available`,
        GET_BY_ID: (id: number) => `${AR_KEYS.MODULES}/${id}`,
        UPDATE: (id: number) => `${AR_KEYS.MODULES}/${id}`,
        DELETE: (id: number) => `${AR_KEYS.MODULES}/${id}`,
    },
    PAGES: {
        CREATE: `${AR_KEYS.PAGES}`,
        GET_BY_MODULE_ID: (moduleId: number) => `${AR_KEYS.PAGES}/module/${moduleId}`,
        GET_BY_ID: (id: number) => `${AR_KEYS.PAGES}/${id}`,
        UPDATE_CONTENT: (id: number) => `${AR_KEYS.PAGES}/${id}/content`,
        NOTES: {
            CREATE: `${AR_KEYS.PAGES}/notes`,
            UPDATE: (noteId: number) => `${AR_KEYS.PAGES}/notes/${noteId}`,
            DELETE: (noteId: number) => `${AR_KEYS.PAGES}/notes/${noteId}`,
        },
        FEEDBACKS: {
            CREATE: `page-feedbacks`,
            UPDATE: (feedbackId: number) => `page-feedbacks/${feedbackId}`,
            DELETE: (feedbackId: number) => `page-feedbacks/${feedbackId}`,
        },
    },
    ENROLLMENTS: {
        SELF_ENROLL: `${AR_KEYS.ENROLLMENTS}/self`,
        BULK_ENROLL: `${AR_KEYS.ENROLLMENTS}/bulk`,
        GET_MODULE_ENROLLMENTS: (moduleId: number) => `${AR_KEYS.ENROLLMENTS}/module/${moduleId}`,
        UPDATE: (id: number) => `${AR_KEYS.ENROLLMENTS}/${id}`,
        SELF_UNENROLL: (moduleId: number) => `${AR_KEYS.ENROLLMENTS}/self/${moduleId}`,
        REMOVE: (id: number) => `${AR_KEYS.ENROLLMENTS}/${id}`,
    },
    CONTENT_GENERATION: {
        GENERATE: `${AR_KEYS.CONTENT_GENERATION}/generate-content`,
        GENERATE_IMAGE: `${AR_KEYS.CONTENT_GENERATION}/generate-image`,
    },
}