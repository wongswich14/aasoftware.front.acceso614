import { serverApi } from "../serverApi";
import {LogDoorVisitResponse} from "../models/responses/logDoorVisit.response.ts";

export const visitServerApi = serverApi.injectEndpoints({
    endpoints: builder => ({
        listLogDoorVisits: builder.query<LogDoorVisitResponse, void>({
            query: () => `visits`,
            providesTags: ["Visit"]
        }),

        getLogDoorVisit: builder.query<LogDoorVisitResponse, string>({
            query: (id) => `visits/${id}`,
        }),

        // createLogDoorVisit: builder.mutation<LogDoorVisitResponse, VisitCreateDto>({
        //     query: newVisit => ({
        //         url: '/visits',
        //         method: 'POST',
        //         body: newVisit,
        //     }),
        //     invalidatesTags: ["Visit"]
        // }),
        //
        // updateLogDoorVisit: builder.mutation<LogDoorVisitResponse, VisitUpdateDto>({
        //     query: updatedVisit => ({
        //         url: `/visits`,
        //         method: 'PUT',
        //         body: updatedVisit,
        //     }),
        //     invalidatesTags: ["Visit"]
        // }),

        softDeleteLogDoorVisit: builder.mutation<LogDoorVisitResponse, string>({
            query: (id) => ({
                url: `/visits/softdelete/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Visit"]
        }),

        hardDeleteLogDoorVisit: builder.mutation<LogDoorVisitResponse, string>({
            query: id => ({
                url: `/visits/harddelete/${id}`,
                method: "DELETE"
            }),
        })
    }),
    overrideExisting: false
});

export const {
    useListLogDoorVisitsQuery,
    useGetLogDoorVisitQuery,
    // useCreateLogDoorVisitMutation,
    // useUpdateLogDoorVisitMutation,
    useSoftDeleteLogDoorVisitMutation,
    useHardDeleteLogDoorVisitMutation
} = visitServerApi;
