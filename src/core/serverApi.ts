import { CONFIG } from "@config/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

export const serverApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.isProduction ? CONFIG.prod.baseUrl : CONFIG.dev.baseUrl,
        prepareHeaders: (headers, { getState }) => {
            headers.set('Access-Control-Allow-Origin', '*');
            headers.set("Content-Type", "application/json");
            headers.set("Accept", "*/*");

            const state = getState() as RootState
            const token: string = state.auth.userData?.token ?? (() => {
                const authData = localStorage.getItem('auth');
                return authData ? JSON.parse(authData) : "";
            })();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    endpoints: () => ({}),
})