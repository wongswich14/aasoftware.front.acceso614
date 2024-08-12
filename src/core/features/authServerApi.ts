import { LoginRequest } from '../models/auth/login.request'
import { serverApi } from '../serverApi'

export const authServerApi = serverApi.injectEndpoints({ 
    endpoints: (builder) => ({
        // createUser: builder.mutation({
        //     query: (credentials) => ({
        //         url: '/Auth',
        //         method: 'POST',
        //         body: credentials,
        //     }),
        // }),
        login: builder.mutation({
            query: (credentials: LoginRequest) => ({
                url: '/Auth',
                method: 'POST',
                body: credentials,
            }),
        })
    }),
    overrideExisting: false,
})

export const {useLoginMutation} = authServerApi