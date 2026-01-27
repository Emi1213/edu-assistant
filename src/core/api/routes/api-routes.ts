const AR_KEYS = {
    AUTH: '/auth',
    MODULES: '/modules',
    PAGES: '/pages',
}

export const API_ROUTES = {
    AUTH: {
        MICROSOFT_LOGIN: `${AR_KEYS.AUTH}/microsoft`,
        ME: `${AR_KEYS.AUTH}/profile`,
    },
    MODULES: {
        GET_ALL: `${AR_KEYS.MODULES}`,
        GET_AVAILABLE: `${AR_KEYS.MODULES}/available`,
        GET_BY_ID: (id: number) => `${AR_KEYS.MODULES}/${id}`,
    },
    PAGES: {
        GET_BY_MODULE_ID: (moduleId: number) => `${AR_KEYS.PAGES}/module/${moduleId}`,
        GET_BY_ID: (id: number) => `${AR_KEYS.PAGES}/${id}`,
    }
}