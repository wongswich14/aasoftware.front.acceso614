import { ResidentialDto } from "../residentials/ResidentialDto"

export interface DoorDto {
    id: string
    residential?: ResidentialDto
    name: string
}