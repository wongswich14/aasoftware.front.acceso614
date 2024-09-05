export interface UserCreateDto {
    name: string;
    lastName: string;
    email: string;
    password: string;
    emailConfirmed: boolean
    residentialId: string
    profileId: string
    homeId: string
    isPrincipal: boolean
}