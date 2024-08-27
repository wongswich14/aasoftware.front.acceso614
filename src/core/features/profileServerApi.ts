import { ProfileCreateDto } from "../models/dtos/profiles/profileCreateDto";
import { ProfileUpdateDto } from "../models/dtos/profiles/profileUpdateDto";
import { PermissionResponse } from "../models/responses/permission.response";
import { ProfileResponse } from "../models/responses/profile.response";
import { serverApi } from "../serverApi";

export const profileServerApi = serverApi.injectEndpoints({
    endpoints: (builder) => ({

        listProfiles: builder.query<ProfileResponse, void>({
            query: () => `profile`
        }),

        getProfile: builder.query<ProfileResponse, string>({
            query: (id) => `profile/${id}`
        }),
        
        createProfile: builder.mutation<ProfileResponse, ProfileCreateDto>({
            query: (newProfile) => ({
                url: '/profile',
                method: 'POST',
                body: newProfile,
            }),
        }),

        updateProfile: builder.mutation<ProfileResponse, ProfileUpdateDto>({
            query: (updatedProfile) => ({
                url: `/profile`,
                method: 'PUT',
                body: updatedProfile,
            }),
        }),

        softDeleteProfile: builder.mutation<ProfileResponse, string>({
            query: (id) => ({
                url: `/profile/softdelete/${id}`,
                method: 'DELETE',
            }),
        }),

        listPermissions: builder.query<PermissionResponse, void>({
            query: () => `/permission`
        })
    
    }),
    overrideExisting: false,
})

export const {
    useListProfilesQuery,
    useGetProfileQuery,
    useCreateProfileMutation,
    useUpdateProfileMutation,
    useSoftDeleteProfileMutation,
    useListPermissionsQuery
} = profileServerApi