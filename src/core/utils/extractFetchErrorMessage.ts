import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

const extractFetchErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined): string => {
    if (!error) return 'Error desconocido';

    if ('status' in error) {
        switch (error.status) {
            case 'FETCH_ERROR':
                return error.error || 'Error en la conexión';
            case 'PARSING_ERROR':
                return 'Error al parsear la respuesta del servidor';
            case 'TIMEOUT_ERROR':
                return 'Tiempo de espera excedido';
            default:
                if (error.data && typeof error.data === 'string') {
                    return error.data;
                }
                return 'Error en el servidor';
        }
    } else if ('message' in error) {
        return error.message || 'Error desconocido';
    }

    return 'Error desconocido';
};

export { extractFetchErrorMessage };