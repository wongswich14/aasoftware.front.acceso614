import { HouseCreateDto } from "../models/dtos/houses/houseCreateDto";
import { HouseUpdateDto } from "../models/dtos/houses/houseUpdateDto";
import { HouseResponse } from "../models/responses/house.response";
import { serverApi } from "../serverApi";

export const houseServerApi = serverApi.injectEndpoints({
    endpoints: builder => ({
        listHouses: builder.query<HouseResponse, void>({
            query: () => `home`
        }),

        getHouse: builder.query<HouseResponse, string>({
            query: (id) => `home/${id}`
        }),

        createHouse: builder.mutation<HouseResponse, HouseCreateDto>({
            query: newHouse => ({
                url: '/home',
                method: 'POST',
                body: newHouse,
            })
        }),

        updateHouse: builder.mutation<HouseResponse, HouseUpdateDto>({
            query: updatedHouse => ({
                url: `/home`,
                method: 'PUT',
                body: updatedHouse,
            })
        }),

        softDeleteHouse: builder.mutation<HouseResponse, string>({
            query: (id) => ({
                url: `/home/softdelete/${id}`,
                method: "DELETE"
            })
        })
    }),
    overrideExisting: false
})

export const {
    useListHousesQuery,
    useGetHouseQuery,
    useCreateHouseMutation,
    useUpdateHouseMutation,
    useSoftDeleteHouseMutation
} = houseServerApi