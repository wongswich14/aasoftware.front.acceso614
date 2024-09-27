import {VisitsDto} from "../visits/visitsDto.ts";
import {DoorDto} from "../doors/doorDto.ts";
import {UserDto} from "../users/userDto.ts";

export interface LogDoorVisitDto {
    id: string;
    residentialId: string;
    doorsId: string;
    door: DoorDto;
    securityGrantedAccessId: string| null;
    securityGrantedAccess: UserDto | null;
    visitId: string;
    visit: VisitsDto;
    accessDate: Date;
    accessHour: string;
}
