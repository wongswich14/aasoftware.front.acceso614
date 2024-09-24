import { HouseDto } from "../houses/houseDto"

export interface ResidentialDto {
    id: string
    name: string
    description: string
    homes: HouseDto[]
}