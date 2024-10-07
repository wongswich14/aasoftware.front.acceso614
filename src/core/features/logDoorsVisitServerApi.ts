
import { LogDoorVisitResponse } from "../models/responses/logDoorVisit.response";
import { serverApi } from "../serverApi";
import {LogDoorVisitCreateDto} from "../models/dtos/logDoorVisit/LogDoorVisitCreateDto.ts";
import {LogDoorVisitUpdateDto} from "../models/dtos/logDoorVisit/LogDoorVisitUpdateDto.ts";

export const logDoorVisitServerApi = serverApi.injectEndpoints({
    endpoints: builder => ({
        listLogDoorVisits: builder.query<LogDoorVisitResponse, string|undefined>({
            query: (id) => id ?`LogDoorsVisits?homeId=${id}` : `LogDoorsVisits`,
            providesTags: ["LogDoorVisit"]
        }),

        listLogDoorVisitsByResidential: builder.query<LogDoorVisitResponse, string>({
            query: (id) => `LogDoorsVisits/ResidentialId?residentialId=${id}`,
            providesTags: ["LogDoorVisit"]
        }),

        getLogDoorVisit: builder.query<LogDoorVisitResponse, string>({
            query: (id) => `LogDoorsVisits/${id}`,
        }),

        createLogDoorVisit: builder.mutation<LogDoorVisitResponse, LogDoorVisitCreateDto>({
            query: newLog => ({
                url: '/LogDoorsVisits',
                method: 'POST',
                body: newLog,
            }),
                invalidatesTags: ["LogDoorVisit"]
        }),

        updateLogDoorVisit: builder.mutation<LogDoorVisitResponse, LogDoorVisitUpdateDto>({
            query: updatedLog => ({
                url: `/LogDoorsVisits`,
                method: 'PUT',
                body: updatedLog,
            }),
            invalidatesTags: ["LogDoorVisit"]
        }),

        softDeleteLogDoorVisit: builder.mutation<LogDoorVisitResponse, string>({
            query: (id) => ({
                url: `/LogDoorsVisits/softdelete/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["LogDoorVisit"]
        }),

        hardDeleteLogDoorVisit: builder.mutation<LogDoorVisitResponse, string>({
            query: id => ({
                url: `/LogDoorsVisits/harddelete/${id}`,
                method: "DELETE"
            }),
        })
    }),
    overrideExisting: false
});

export const {
    useListLogDoorVisitsQuery,
    useListLogDoorVisitsByResidentialQuery,
    useGetLogDoorVisitQuery,
    useCreateLogDoorVisitMutation,
    useUpdateLogDoorVisitMutation,
    useSoftDeleteLogDoorVisitMutation,
    useHardDeleteLogDoorVisitMutation
} = logDoorVisitServerApi;
