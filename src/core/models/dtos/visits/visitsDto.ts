import {UserDto} from "../users/userDto.ts";
import {HouseDto} from "../houses/houseDto.ts";

interface typeOfVisit {
    id: string;
    name: string;
}

export interface VisitsDto {
    id: string;
    home: HouseDto;
    userWhoCreated: UserDto;
    typeOfVisitId : string
    typeOfVisits: typeOfVisit
    name: string;
    lastName: string;
    entries: number;
    qrString: string;
    createdDate: Date; // Usar Date para manejar fechas
    limitDate: Date;
}