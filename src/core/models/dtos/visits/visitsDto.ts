import {UserDto} from "../users/userDto.ts";
import {HouseDto} from "../houses/houseDto.ts";

export interface VisitsDto {
    id: string;
    home: HouseDto;
    userWhoCreated: UserDto;
    name: string;
    lastName: string;
    entries: number;
    qrString: string;
    createdDate: Date; // Usar Date para manejar fechas
    limitDate: Date;
}