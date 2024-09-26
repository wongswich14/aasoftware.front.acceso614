import { serverApi } from "../serverApi";
import { ResidentialResponse } from "../models/responses/residential.response";
import { ResidentialCreateDto } from "../models/dtos/residentials/ResidentialCreateDto";
import { ResidentialUpdateDto } from "../models/dtos/residentials/ResidentialUpdateDto";

export const residentialServerApi = serverApi.injectEndpoints({
    endpoints: builder => ({

        listResidentials: builder.query<ResidentialResponse, void>({
            query: () => `residential`,
            providesTags: ["Residential"]
        }),

        getResidential: builder.query<ResidentialResponse, string>({
            query: (id) => `residential/${id}`,
            providesTags: ["Residential"]
        }),

        createResidential: builder.mutation<ResidentialResponse, ResidentialCreateDto>({
            query: (newResidential) => ({
                url: '/residential',
                method: 'POST',
                body: newResidential
            }),
            invalidatesTags: ["Residential"]
        }),

        updateResidential: builder.mutation<ResidentialResponse, ResidentialUpdateDto>({
            query: (updatedResidential) => ({
                url: `/residential`,
                method: 'PUT',
                body: updatedResidential,
            }),
            invalidatesTags: ["Residential"]
        }),

        softDeleteResidential: builder.mutation<ResidentialResponse, string>({
            query: (id) => ({
                url: `/residential/softdelete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Residential"]
        }),

        hardDeleteResidential: builder.mutation<ResidentialResponse, string>({
            query: (id) => ({
                url: `/residential/harddelete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Residential"]
        }),

    }),
    overrideExisting: false
})

export const {
    useListResidentialsQuery,
    useGetResidentialQuery,
    useCreateResidentialMutation,
    useUpdateResidentialMutation,
    useSoftDeleteResidentialMutation,
    useHardDeleteResidentialMutation
} = residentialServerApi