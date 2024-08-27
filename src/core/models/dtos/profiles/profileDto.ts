import { PermissionDto } from "../permissions/permissionDto"

export interface ProfileDto {
    id: string
    title: string
    description: string,
    permissions: PermissionDto[]
}