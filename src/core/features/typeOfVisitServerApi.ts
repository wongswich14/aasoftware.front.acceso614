import {serverApi} from "../serverApi.ts";
import {TypeOfVisitResponse} from "../models/responses/typeOfVisit.response.ts";

export const typeOfVisitServerApi = serverApi.injectEndpoints({
    endpoints: builder => ({

        listTypeOfVisits: builder.query<TypeOfVisitResponse, void>({
            query: () => `VisitType`,
            providesTags: ["TypeOfVisit"]
        }),

    }),
    overrideExisting: false
})

export const {
    useListTypeOfVisitsQuery
} = typeOfVisitServerApi;