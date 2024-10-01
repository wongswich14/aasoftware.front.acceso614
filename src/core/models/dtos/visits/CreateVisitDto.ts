export interface CreateVisitDto {
    homeId: string; // Nullable
    userWhoCreatedId: string;
    typeOfVisitId: string;
    name: string;
    lastName: string;
    entries: number;
    qrString: string;
    createdDate: Date;
    limitDate: Date;
}
