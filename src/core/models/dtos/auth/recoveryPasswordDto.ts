export interface RecoveryPasswordDto {
    token: string
    email: string
    body: {
        password: string
        validatePassword: string
    }
}