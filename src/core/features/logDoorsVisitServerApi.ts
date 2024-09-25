
import { LogDoorVisitResponse } from "../models/responses/logDoorVisit.response";
import { serverApi } from "../serverApi";
import {LogDoorVisitCreateDto} from "../models/dtos/logDoorVisit/LogDoorVisitCreateDto.ts";
import {LogDoorVisitUpdateDto} from "../models/dtos/logDoorVisit/LogDoorVisitUpdateDto.ts";

export const logDoorVisitServerApi = serverApi.injectEndpoints({
    endpoints: builder => ({
        listLogDoorVisits: builder.query<LogDoorVisitResponse, void>({
            query: () => `logDoorVisit`,
            providesTags: ["LogDoorVisit"]
        }),

        getLogDoorVisit: builder.query<LogDoorVisitResponse, string>({
            query: (id) => `logDoorVisit/${id}`,
        }),

        createLogDoorVisit: builder.mutation<LogDoorVisitResponse, LogDoorVisitCreateDto>({
            query: newLog => ({
                url: '/logDoorVisit',
                method: 'POST',
                body: newLog,
            }),
                invalidatesTags: ["LogDoorVisit"]
        }),

        updateLogDoorVisit: builder.mutation<LogDoorVisitResponse, LogDoorVisitUpdateDto>({
            query: updatedLog => ({
                url: `/logDoorVisit`,
                method: 'PUT',
                body: updatedLog,
            }),
            invalidatesTags: ["LogDoorVisit"]
        }),

        softDeleteLogDoorVisit: builder.mutation<LogDoorVisitResponse, string>({
            query: (id) => ({
                url: `/logDoorVisit/softdelete/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["LogDoorVisit"]
        }),

        hardDeleteLogDoorVisit: builder.mutation<LogDoorVisitResponse, string>({
            query: id => ({
                url: `/logDoorVisit/harddelete/${id}`,
                method: "DELETE"
            }),
        })
    }),
    overrideExisting: false
});

export const {
    useListLogDoorVisitsQuery,
    useGetLogDoorVisitQuery,
    useCreateLogDoorVisitMutation,
    useUpdateLogDoorVisitMutation,
    useSoftDeleteLogDoorVisitMutation,
    useHardDeleteLogDoorVisitMutation
} = logDoorVisitServerApi;
