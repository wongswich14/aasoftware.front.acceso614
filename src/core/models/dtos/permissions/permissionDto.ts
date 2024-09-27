import {ScopeDto} from "../scopes/scopeDto.ts";

export interface PermissionDto {
    id: string
    title: string
    resource: string
    translation: string
    scope: ScopeDto
}