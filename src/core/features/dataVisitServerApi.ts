
import { serverApi } from "../serverApi";
import {VisitsDataDto} from "../models/dtos/dataVisit/datavisit.ts";

export const DataVisitServerApi = serverApi.injectEndpoints({
    endpoints: builder => ({
        listDataForVisit: builder.query<VisitsDataDto, void>({
            query: () => `VisitsData`,
            providesTags: ["VisitData"]
        })}
    ),

    overrideExisting: false
})

export const {
    useListDataForVisitQuery
} = DataVisitServerApi