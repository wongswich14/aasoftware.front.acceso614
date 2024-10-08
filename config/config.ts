export enum Environment {
    PROD = 'prod',
    DEV = 'dev',
    LOCAL = 'local'
}

export const CONFIG = {
    environment: Environment.LOCAL,
    prod: {
        location: "http://prod-acceso614.aasoftware.mx",
        baseUrl: 'http://api-v2-acceso614.gruporosanegra.com/api',
    },
    dev: {
        location: "http://dev-acceso614.aasoftware.mx",
        baseUrl: 'http://api-dev-acceso614.gruporosanegra.com/api',
    },
    local: {
        location: "http://localhost:5173",
        baseUrl: 'http://localhost:5188/api',
    }
}