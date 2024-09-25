export interface LogDoorVisitCreateDto {
    homeId: string;
    userWhoCreatedId: string;
    name: string;
    lastName: string;
    entries: number;
    qrString: string;
    createdDate: string;
    limitDate: string;
}
