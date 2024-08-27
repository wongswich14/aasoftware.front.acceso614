export interface UserData {
    id: string
    name: string
    lastName: string
    email: string
    token: string
    profileName: string
}

export interface AuthState {
    userData: UserData | null
    isAuthenticated: boolean | null
}
