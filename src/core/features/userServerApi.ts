import { UserCreateDto } from "../models/dtos/users/userCreateDto";
import { UserUpdateDto } from "../models/dtos/users/userUpdateDto";
import { UserResponse } from "../models/responses/user.response";
import { serverApi } from "../serverApi";

export const userServerApi = serverApi.injectEndpoints({
    endpoints: (builder) => ({

        listUsers: builder.query<UserResponse, number>({
            query: (page) => `user?page=${page}`,
            providesTags: ["User"]
        }),

        getUser: builder.query<UserResponse, string>({
            query: (id) => `user/${id}`,
            providesTags: ["User"]
        }),

        createUser: builder.mutation<UserResponse, UserCreateDto>({
            query: (newUser) => ({
                url: `user`,
                method: 'POST',
                body: newUser,
            }),
            invalidatesTags: ["User", "House"]
        }),

        updateUser: builder.mutation<UserResponse, UserUpdateDto>({
            query: (updatedUser) => ({
                url: `/user`,
                method: 'PUT',
                body: updatedUser,
            }),
            invalidatesTags: ["User", "House"]
        }),

        softDeleteUser: builder.mutation<UserResponse, string>({
            query: (id) => ({
                url: `/user/softdelete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["User"]
        }),

    }),
    overrideExisting: false,
})

export const {
    useListUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useSoftDeleteUserMutation,
} = userServerApi
