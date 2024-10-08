import { serverApi } from "../serverApi";
import {LogDoorVisitResponse} from "../models/responses/logDoorVisit.response.ts";
import {VisitResponse} from "../models/responses/visit.response.ts";
import {ProfileResponse} from "../models/responses/profile.response.ts";
import {ProfileUpdateDto} from "../models/dtos/profiles/profileUpdateDto.ts";
import {VisitsDto} from "../models/dtos/visits/visitsDto.ts";
import {VisitsUpdateDto} from "../models/dtos/visits/visitsUpdateDto.ts";
import {LogDoorVisitCreateDto} from "../models/dtos/logDoorVisit/LogDoorVisitCreateDto.ts";
import {CreateVisitDto} from "../models/dtos/visits/CreateVisitDto.ts";

export const visitServerApi = serverApi.injectEndpoints({
    endpoints: builder => ({
        listVisits: builder.query<VisitResponse, string|null>({
            query: (id) => id != null ?`visits?homeId=${id}` : `visits`,
            providesTags: ["Visit"]
        }),

        listVisitsByResidential: builder.query<VisitResponse, string>({
            query: (id) => `visits/ByResidentialId?residentialId=${id}`,
            providesTags: ["Visit"]
        }),



        getVisit: builder.query<VisitResponse, string>({
            query: (id) => `visits/${id}`,
        }),

        getFavoriteVisits: builder.query<VisitResponse, string>({
            query: (homeId) => `visits/favorite/${homeId}`,
            providesTags: ["Visit"]
        }),

        createVisit: builder.mutation<VisitsDto, CreateVisitDto>({
            query: newLog => ({
                url: '/visits',
                method: 'POST',
                body: newLog,
            }),
            invalidatesTags: ["LogDoorVisit", "Visit"]
        }),

        updateVisit: builder.mutation<VisitsDto, VisitsUpdateDto>({
            query: (updatedProfile) => ({
                url: `/visits`,
                method: 'PUT',
                body: updatedProfile,
            }),
            invalidatesTags: ["Visit", "LogDoorVisit"]
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
    useCreateVisitMutation,
    useUpdateVisitMutation,
    useSoftDeleteVisitMutation,
    useHardDeleteVisitMutation
} = visitServerApi;
