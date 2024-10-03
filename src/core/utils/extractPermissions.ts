import {jwtDecode} from "jwt-decode";

export function extractPermissions(token: string): { [key: string]: string | null } {
    const jwt = jwtDecode<Acceso614JwtPayload>(token)
    const permissionsDict: { [key: string]: string | null } = {};

    jwt.permissions.split(',').forEach(permissionStr => {
        const [permission, scope] = permissionStr.split(':');
        permissionsDict[permission.trim()] = scope ? scope.trim() : null;
    });

    return permissionsDict

}

interface Acceso614JwtPayload {
    jti: string;
    sub: string;
    email: string;
    id: string;
    permissions: string;
    exp: number;
    iss: string;
    aud: string;
}