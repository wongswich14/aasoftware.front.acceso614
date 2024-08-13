import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import { serverApi } from "./serverApi";

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

export default store;