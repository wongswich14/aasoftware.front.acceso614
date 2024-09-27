import {serverApi} from "../serverApi.ts";
import {ScopeResponse} from "../models/responses/scope.response.ts";

export const scopeServerApi = serverApi.injectEndpoints({
    endpoints: builder => ({

        listScopes: builder.query<ScopeResponse, void>({
            query: () => `scope`,
            providesTags: ["Scope"]
        }),
    }),
    overrideExisting: false
})

export const {
    useListScopesQuery
} = scopeServerApi