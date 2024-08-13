export interface UserData {
    id: string
    name: string
    lastName: string
    email: string
    token: string
}

export interface AuthState {
    userData: UserData | null
    isAuthenticated: boolean | null
}
