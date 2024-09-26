import { serverApi } from "../serverApi";
import {LogDoorVisitResponse} from "../models/responses/logDoorVisit.response.ts";
import {VisitResponse} from "../models/responses/visit.response.ts";
import {ProfileResponse} from "../models/responses/profile.response.ts";
import {ProfileUpdateDto} from "../models/dtos/profiles/profileUpdateDto.ts";
import {VisitsDto} from "../models/dtos/visits/visitsDto.ts";
import {VisitsUpdateDto} from "../models/dtos/visits/visitsUpdateDto.ts";

export const visitServerApi = serverApi.injectEndpoints({
    endpoints: builder => ({
        listVisits: builder.query<VisitResponse, void>({
            query: () => `visits`,
            providesTags: ["Visit"]
        }),

        listVisitsByResidential: builder.query<VisitResponse, void>({
            query: (id) => `visits/ByResidentialId?residentialId=${id}`,
            providesTags: ["Visit"]
        }),


        getVisit: builder.query<VisitResponse, string>({
            query: (id) => `visits/${id}`,
        }),

        updateVisit: builder.mutation<VisitsDto, VisitsUpdateDto>({
            query: (updatedProfile) => ({
                url: `/visits`,
                method: 'PUT',
                body: updatedProfile,
            }),
        }),

        softDeleteVisit: builder.mutation<VisitResponse, string>({
            query: (id) => ({
                url: `/visits/softdelete/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Visit"]
        }),

        hardDeleteVisit: builder.mutation<VisitResponse, string>({
            query: id => ({
                url: `/visits/harddelete/${id}`,
                method: "DELETE"
            }),
        })
    }),
    overrideExisting: false
});

export const {
    useListVisitsQuery,
    useListVisitsByResidentialQuery,
    useGetVisitQuery,
    useUpdateVisitMutation,
    useSoftDeleteVisitMutation,
    useHardDeleteVisitMutation
} = visitServerApi;
