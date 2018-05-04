export const APP_ROUTES_PROD = {
    '_defaults': {
        'host': 'https://myservice.com/api/v1/',
        'variables': {
        }
    }
};

export const APP_ROUTES_STAGING = {
    '_defaults': {
        'host': 'https://myservice.com/api/v1/',
        'variables': {
        }
    }
};

export const APP_ROUTES_DEV = {
    '_defaults': {
        'host': 'https://myservice.com/api/v1/',
        'variables': {
        }
    }
};

export const APP_CONFIG = {
    urlResolver: {
        dev: APP_ROUTES_DEV,
        'staging:dev': APP_ROUTES_STAGING,
        'prod:dev': APP_ROUTES_PROD,
    },
    backButtonText: '',
    preloadModules: true,
    platforms: {
        android: {
            scrollAssist: true,
            scrollPadding: false,
            autoFocusAssist: true
        },
        ios: {
            scrollAssist: false,
            scrollPadding: true,
            autoFocusAssist: false
        }
    }
};
