export interface ProfileUpdateDto {
    id: string
    title: string
    description: string,
    permissions: PermissionAddToProfileDto[]
}

interface PermissionAddToProfileDto {
    permissionId: string
    scopeId?: string
}