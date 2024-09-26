// VisitDto.ts
export interface VisitsUpdateDto {
    id: string;                     // ID de la visita (Guid)
    homeId: string;                 // ID de la casa (Guid)
    userWhoCreatedId: string;       // ID del usuario que creó la visita (Guid)
    typeOfVisitId: string;          // ID del tipo de visita (Guid)
    name: string;                   // Nombre del visitante
    lastName: string;               // Apellido del visitante
    entries: number;                // Número de entradas
    qrString: string;               // Cadena QR asociada
    createdDate: Date;              // Fecha de creación
    limitDate: Date;                // Fecha límite
}
