export interface ProfileCreateDto {
    title: string
    description: string,
    permissions: PermissionAddToProfileDto[]
}

interface PermissionAddToProfileDto {
    permissionId: string
    scopeId?: string
}