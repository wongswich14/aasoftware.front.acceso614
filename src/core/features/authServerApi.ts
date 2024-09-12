import { LoginDto } from '../models/dtos/auth/loginDto'
import { serverApi } from '../serverApi'
import { AuthResponse } from "../models/responses/auth.response"
import { RegisterDto } from '../models/dtos/auth/registerDto'
import { RecoveryPasswordDto } from '../models/dtos/auth/recoveryPasswordDto'

export const authServerApi = serverApi.injectEndpoints({ 
    endpoints: (builder) => ({

        registerUser: builder.mutation<AuthResponse, RegisterDto>({
            query: (newUser) => ({
                url: '/Auth/Register',
                method: 'POST',
                body: newUser,
            }),
        }),

        login: builder.mutation<AuthResponse, LoginDto>({
            query: (credentials) => ({
                url: '/Auth/SignIn',
                method: 'POST',
                body: credentials,
            }),
        }),

        token: builder.query<AuthResponse, void>({
            query: () => `Auth/Token`
        }),

        sendMailRecovery: builder.mutation<AuthResponse, string>({
            query: (to) => ({
                url: `email/send`,
                method: "POST",
                body: {to}
            })
        }),

        changePassword: builder.mutation<AuthResponse, RecoveryPasswordDto>({
            query: data => ({
                url: `auth/recoveruser/${data.email}/${data.token}`,
                method: "POST",
                body: data.body
            })
        })
    }),
    overrideExisting: false,
})
export const {
    useLoginMutation,
    useRegisterUserMutation,
    useTokenQuery,
    useSendMailRecoveryMutation,
    useChangePasswordMutation} = authServerApi
