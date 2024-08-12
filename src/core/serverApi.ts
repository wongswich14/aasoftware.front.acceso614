import { CONFIG } from "@config/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const serverApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.isProduction ? CONFIG.prod.baseUrl : CONFIG.dev.baseUrl,
        prepareHeaders: (headers, { getState }) => {
            headers.set('Access-Control-Allow-Origin', '*');
            headers.set("Content-Type", "application/json");
            headers.set("Accept", "*/*");
        },
    }),
    endpoints: () => ({}),
})