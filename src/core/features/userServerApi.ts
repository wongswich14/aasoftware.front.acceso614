import { AppendUserToHomeDto } from "../models/dtos/users/appendUserToHomeDto";
import { AppendUserToResidentialDto } from "../models/dtos/users/appendUserToResidentialDto";
import { UserCreateDto } from "../models/dtos/users/userCreateDto";
import { UserDto } from "../models/dtos/users/userDto";
import { UserUpdateDto } from "../models/dtos/users/userUpdateDto";
import { UserResponse } from "../models/responses/user.response";
import { serverApi } from "../serverApi";

export const userServerApi = serverApi.injectEndpoints({
    endpoints: (builder) => ({

        listUsers: builder.query<UserResponse, void>({
            query: () => `user`,
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
            invalidatesTags: ["User"]
        }),

        updateUser: builder.mutation<UserResponse, UserUpdateDto>({
            query: (updatedUser) => ({
                url: `/user`,
                method: 'PUT',
                body: updatedUser,
            }),
            invalidatesTags: ["User"]
        }),

        softDeleteUser: builder.mutation<UserResponse, string>({
            query: (id) => ({
                url: `/user/softdelete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["User"]
        }),

        appendUserToHome: builder.mutation<void, AppendUserToHomeDto>({
            query: (appendUserToHome) => ({
                url: `/homeuser/appendusertohouse`,
                method: 'POST',
                body: appendUserToHome,
            }),
            invalidatesTags: ["User"]
        }),

        appendUserToResidential: builder.mutation<void, AppendUserToResidentialDto>({
            query: (appendUserToResidential) => ({
                url: `/homeuser/appendusertoresidential`,
                method: 'POST',
                body: appendUserToResidential,
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
    useAppendUserToResidentialMutation,
    useAppendUserToHomeMutation
} = userServerApi
