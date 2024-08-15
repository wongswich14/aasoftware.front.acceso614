import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import { serverApi } from "./serverApi";
import { useDispatch } from "react-redux";

const store = configureStore({
    reducer: {
        auth: authReducer,
        [serverApi.reducerPath]: serverApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(serverApi.middleware)
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export default store;