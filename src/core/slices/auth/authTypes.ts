export interface UserData {
    username: string,
    email: string,
    token: string
}

export interface AuthState {
    userData: UserData | null,
    isAuthenticated: boolean
}
