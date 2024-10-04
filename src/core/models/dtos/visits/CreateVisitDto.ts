export interface CreateVisitDto {
    homeId: string;
    typeOfVisitId: string;
    name: string;
    lastName: string;
    entries: number;
    limitDate: Date;
    vehicleColor?: string
    vehiclePlate?: string
    aditionalInfo?: string
    isFavorite: boolean
}
