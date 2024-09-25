import { HouseCreateDto } from "../models/dtos/houses/houseCreateDto";
import { HouseUpdateDto } from "../models/dtos/houses/houseUpdateDto";
import { HouseResponse } from "../models/responses/house.response";
import { serverApi } from "../serverApi";

export const houseServerApi = serverApi.injectEndpoints({
    endpoints: builder => ({
        listHouses: builder.query<HouseResponse, void>({
            query: () => `home`,
            providesTags: ["House"]
        }),

        getHouse: builder.query<HouseResponse, string>({
            query: (id) => `home/${id}`,
            providesTags: ["House"]
        }),

        listHousesByResidential: builder.query<HouseResponse, string>({
            query: (residentialId) => `home/residential/${residentialId}`,
            providesTags: ["House"]
        }),

        createHouse: builder.mutation<HouseResponse, HouseCreateDto>({
            query: newHouse => ({
                url: '/home',
                method: 'POST',
                body: newHouse,
            }),
            invalidatesTags: ["House"]
        }),

        updateHouse: builder.mutation<HouseResponse, HouseUpdateDto>({
            query: updatedHouse => ({
                url: `/home`,
                method: 'PUT',
                body: updatedHouse,
            }),
            invalidatesTags: ["House"]
        }),

        softDeleteHouse: builder.mutation<HouseResponse, string>({
            query: (id) => ({
                url: `/home/softdelete/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["House"]
        }),

        hardDeleteHouse: builder.mutation<HouseResponse, string>({
            query: id => ({
                url: `/home/harddelete/${id}`,
                method: "DELETE"
            }),

        })
    }),
    overrideExisting: false
})

export const {
    useListHousesQuery,
    useGetHouseQuery,
    useListHousesByResidentialQuery,
    useCreateHouseMutation,
    useUpdateHouseMutation,
    useSoftDeleteHouseMutation,
    useHardDeleteHouseMutation
} = houseServerApi