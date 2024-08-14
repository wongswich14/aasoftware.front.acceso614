export interface UserUpdateDto {
    id: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    emailConfirmed: boolean;
    companyId: string;
}