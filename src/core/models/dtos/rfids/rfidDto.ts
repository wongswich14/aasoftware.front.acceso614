import { HouseDto } from "../houses/houseDto"
import { UserDto } from "../users/userDto"

export interface RfidDto {
    id: string
    folio: string
    userCreatedBy: UserDto | null
    home: HouseDto | null
    comments: string
}