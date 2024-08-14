export interface UserCreateDto {
    name: string;
    lastName: string;
    email: string;
    password: string;
    emailConfirmed: boolean
    companyId: string;
}