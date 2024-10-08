import {HouseCreateDto} from "../models/dtos/houses/houseCreateDto";
import {HouseUpdateDto} from "../models/dtos/houses/houseUpdateDto";
import {HouseResponse} from "../models/responses/house.response";
import {serverApi} from "../serverApi";

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
            invalidatesTags: ["House", "Residential"]
        }),

        updateHouse: builder.mutation<HouseResponse, HouseUpdateDto>({
            query: updatedHouse => ({
                url: `/home`,
                method: 'PUT',
                body: updatedHouse,
            }),
            invalidatesTags: ["House", "Residential"]
        }),

        disableHouse: builder.mutation<HouseResponse, string>({
            query: id => ({
                url: `/home/disable/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["House", "Residential"]
        }),

        enableHouse: builder.mutation<HouseResponse, string>({
           query: id => ({
               url: `/home/enable/${id}`,
               method: 'PUT'
           }),
            invalidatesTags: ["House", "Residential"]
        }),

        confirmPayment: builder.mutation<HouseResponse, string>({
           query: id => ({
               url: `/home/pay/${id}`,
               method: "POST",
           }),
            invalidatesTags: ["House", "Residential"]
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
            invalidatesTags: ["House", "Residential"]
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
    useConfirmPaymentMutation,
    useDisableHouseMutation,
    useEnableHouseMutation,
    useSoftDeleteHouseMutation,
    useHardDeleteHouseMutation
} = houseServerApi