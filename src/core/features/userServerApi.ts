import { UserCreateDto } from "../models/dtos/users/userCreateDto";
import { UserDto } from "../models/dtos/users/userDto";
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

        createUser: builder.mutation<UserResponse, { newUser:UserCreateDto, residentialId: string }>({
            query: ({ newUser, residentialId }) => ({
                url: `user/residentialid/${residentialId}`,
                method: 'POST',
                body: newUser,
            }),
        }),

        updateUser: builder.mutation<UserResponse, UserUpdateDto>({
            query: (updatedUser) => ({
                url: `/user`,
                method: 'PUT',
                body: updatedUser,
            }),
        }),

        softDeleteUser: builder.mutation<UserResponse, string>({
            query: (id) => ({
                url: `/user/softdelete/${id}`,
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
