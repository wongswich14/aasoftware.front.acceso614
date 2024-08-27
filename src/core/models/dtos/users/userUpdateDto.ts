export interface UserUpdateDto {
    id: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    emailConfirmed: boolean;
    residentialId: string;
    profileId: string
    homeId: string
}