import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { UserData, AuthState } from "./authTypes";

const initialState: AuthState = {
    userData: null,
    isAuthenticated: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        saveUserInfo: (state, action: PayloadAction<UserData>) => {
            state.userData = action.payload
        },
        authenticate: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload
        },
        logout: (state) => {
            state.userData = null
            state.isAuthenticated = null
        }
    }
})

export const { saveUserInfo, authenticate, logout } = authSlice.actions

// Selectors
export const selectUserData = (state: RootState ) => state.auth.userData
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated


export default authSlice.reducer