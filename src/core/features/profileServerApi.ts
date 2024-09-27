import { ProfileCreateDto } from "../models/dtos/profiles/profileCreateDto";
import { ProfileUpdateDto } from "../models/dtos/profiles/profileUpdateDto";
import { PermissionResponse } from "../models/responses/permission.response";
import { ProfileResponse } from "../models/responses/profile.response";
import { serverApi } from "../serverApi";

export const profileServerApi = serverApi.injectEndpoints({
    endpoints: (builder) => ({

        listProfiles: builder.query<ProfileResponse, void>({
            query: () => `profile`,
            providesTags: ["Profile"]
        }),

        getProfile: builder.query<ProfileResponse, string>({
            query: (id) => `profile/${id}`,
            providesTags: ["Profile"]
        }),
        
        createProfile: builder.mutation<ProfileResponse, ProfileCreateDto>({
            query: (newProfile) => ({
                url: '/profile',
                method: 'POST',
                body: newProfile,
            }),
            invalidatesTags: ["Profile"]
        }),

        updateProfile: builder.mutation<ProfileResponse, ProfileUpdateDto>({
            query: (updatedProfile) => ({
                url: `/profile`,
                method: 'PUT',
                body: updatedProfile,
            }),
            invalidatesTags: ["Profile"]
        }),

        softDeleteProfile: builder.mutation<ProfileResponse, string>({
            query: (id) => ({
                url: `/profile/softdelete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Profile"]
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