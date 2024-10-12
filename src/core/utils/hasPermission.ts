import {extractPermissions} from "./extractPermissions.ts";

export const hasPermission = (permission: string, scope?: string) => {
    const permissions = extractPermissions(JSON.parse(localStorage.getItem('auth') || ""));

    // Verificar si el permiso existe
    if (!(permission in permissions)) {
        return false; // El permiso no existe
    }

    // Si no se pasa un scope, aceptar todos los scopes
    if (!scope) {
        return true; // El permiso existe y no se requiere un scope específico
    }

    // Verificar si el scope es el correcto
    return permissions[permission] === scope;
};
