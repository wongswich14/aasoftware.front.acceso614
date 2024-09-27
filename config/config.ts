export enum Environment {
    PROD = 'prod',
    DEV = 'dev',
    LOCAL = 'local'
}

export const CONFIG = {
    environment: Environment.LOCAL,
    prod: {
        baseUrl: 'http://api-v2-acceso614.gruporosanegra.com/api',
    },
    dev: {
        baseUrl: 'http://api-dev-acceso614.gruporosanegra.com/api',
    },
    local: {
        baseUrl: 'http://localhost:5188/api',
    }
}