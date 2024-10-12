
import { LogDoorVisitResponse } from "../models/responses/logDoorVisit.response";
import { serverApi } from "../serverApi";
import {LogDoorVisitCreateDto} from "../models/dtos/logDoorVisit/LogDoorVisitCreateDto.ts";
import {LogDoorVisitUpdateDto} from "../models/dtos/logDoorVisit/LogDoorVisitUpdateDto.ts";
import {VisitResponse} from "../models/responses/visit.response.ts";

export const logDoorVisitServerApi = serverApi.injectEndpoints({
    endpoints: builder => ({
        listLogDoorVisits: builder.query<LogDoorVisitResponse, string|undefined>({
            query: (id) => id ?`doorsvisits?homeId=${id}` : `doorsvisits`,
            providesTags: ["LogDoorVisit"]
        }),

        listHistoryByHome: builder.query<LogDoorVisitResponse, { id: string, page: number }>({
            query: ({ id, page }) => `doorsvisits?homeId=${id}&page=${page}`,
            providesTags: ["LogDoorVisit"]
        }),

        listLogDoorVisitsByResidential: builder.query<LogDoorVisitResponse, { id: string, page: number }>({
            query: ({ id, page }) => `doorsvisits/ResidentialId?residentialId=${id}&page=${page}`,
            providesTags: ["LogDoorVisit"]
        }),

        getLogDoorVisit: builder.query<LogDoorVisitResponse, string>({
            query: (id) => `doorsvisits/${id}`,
        }),

        createLogDoorVisit: builder.mutation<LogDoorVisitResponse, LogDoorVisitCreateDto>({
            query: newLog => ({
                url: '/doorsvisits',
                method: 'POST',
                body: newLog,
            }),
                invalidatesTags: ["LogDoorVisit"]
        }),

        updateLogDoorVisit: builder.mutation<LogDoorVisitResponse, LogDoorVisitUpdateDto>({
            query: updatedLog => ({
                url: `/doorsvisits`,
                method: 'PUT',
                body: updatedLog,
            }),
            invalidatesTags: ["LogDoorVisit"]
        }),

        readQrCode: builder.query<VisitResponse, string>({
            query: id => `doorsvisits/read-qr?id=${id}`
        }),

        // softDeleteLogDoorVisit: builder.mutation<LogDoorVisitResponse, string>({
        //     query: (id) => `/doorsvisits/read-qr?id=${id}`,
        //     invalidatesTags: ["LogDoorVisit"]
        // }),

        hardDeleteLogDoorVisit: builder.mutation<LogDoorVisitResponse, string>({
            query: id => ({
                url: `/doorsvisits/harddelete/${id}`,
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
    useListHistoryByHomeQuery,
    useCreateLogDoorVisitMutation,
    useUpdateLogDoorVisitMutation,
    useReadQrCodeQuery,
    // useSoftDeleteLogDoorVisitMutation,
    useHardDeleteLogDoorVisitMutation
} = logDoorVisitServerApi;
