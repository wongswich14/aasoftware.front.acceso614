import { ResidentialDto } from "../residentials/ResidentialDto";
import { RfidDto } from "../rfids/rfidDto";
import { UserDto } from "../users/userDto";

export interface HouseDto {
  id: string;
  residentialId: string;
  residential?: ResidentialDto;
  users?: UserDto[]
  rfids?: RfidDto[]
  principal?: UserDto
  name: string
  personContactId: string
  phoneContact: string
  street: string
  streetDetail: string
  number: string
  zip:string
  enabled: boolean
  isDeleted: boolean
}
