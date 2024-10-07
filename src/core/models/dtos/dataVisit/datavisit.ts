
export interface VisitsDataDto {
    typeOfVisits: TypeOfVisitsDto[];
    transport: TransportDto[];
}

export interface TypeOfVisitsDto {
    id: string;
    name: string;
}

export interface TransportDto {
    name: string;
}
