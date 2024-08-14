import { UserCreateDto } from "../models/dtos/users/userCreateDto";
import { UserUpdateDto } from "../models/dtos/users/userUpdateDto";
import { UserResponse } from "../models/responses/user.response";
import { serverApi } from "../serverApi";

export const userServerApi = serverApi.injectEndpoints({
    endpoints: (builder) => ({

        listUsers: builder.query<UserResponse, void>({
            query: () => `user`
        }),

        getUser: builder.query<UserResponse, string>({
            query: (id) => `user/${id}`
        }),

        createUser: builder.mutation<UserResponse, UserCreateDto>({
            query: (newUser) => ({
                url: '/user',
                method: 'POST',
                body: newUser,
            }),
        }),

        updateUser: builder.mutation<UserResponse, UserUpdateDto>({
            query: (updatedUser) => ({
                url: `/user/${updatedUser.id}`,
                method: 'PUT',
                body: updatedUser,
            }),
        }),

        softDeleteUser: builder.mutation<UserResponse, string>({
            query: (id) => ({
                url: `/user/${id}`,
                method: 'DELETE',
            }),
        }),

    }),
    overrideExisting: false,
})

export const {
    useListUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useSoftDeleteUserMutation
} = userServerApi
