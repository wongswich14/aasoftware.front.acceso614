import { ResidentialDto } from "../residentials/ResidentialDto"

export interface UserDto {
    id: string
    profileId: string
    profileName: string
    name: string
    lastName: string
    email: string
    emailConfirmed: boolean
    enabled: boolean
    isDeleted: boolean
    createdDate: string
    changedDate: string
    deletedDate?: string
    residentialId: string
    home: Home[]
    residentials: ResidentialDto[]
}

interface Home {
    id: string
    residentialId: string
    
}

