import { list } from "postcss";
import { serverApi } from "../serverApi";
import { RfidResponse } from "../models/responses/rfid.response";
import { RfidCreateDto } from "../models/dtos/rfids/rfidCreateDto";
import { RfidUpdateDto } from "../models/dtos/rfids/rfidUpdateDto";

export const rfidServerApi = serverApi.injectEndpoints({
    endpoints: builder => ({
        listRfids: builder.query<RfidResponse, void>({
            query: () => `cardsrfid`,
            providesTags: ["Rfid"]
        }),

        getRfid: builder.query<RfidResponse, string>({
            query: (id) => `cardsrfid/${id}`,
        }),

        createRfid: builder.mutation<RfidResponse, RfidCreateDto>({
            query: newRfid => ({
                url: '/cardsrfid',
                method: 'POST',
                body: newRfid,
            }),
            invalidatesTags: ["Rfid"]
        }),

        updateRfid: builder.mutation<RfidResponse, RfidUpdateDto>({
            query: updatedRfid => ({
                url: `/cardsrfid`,
                method: 'PUT',
                body: updatedRfid,
            }),
            invalidatesTags: ["Rfid"]
        }),

        softDeleteRfid: builder.mutation<RfidResponse, string>({
            query: (id) => ({
                url: `/cardsrfid/softdelete/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Rfid"]
        })
    })
})

export const { useListRfidsQuery, useGetRfidQuery, useCreateRfidMutation, useUpdateRfidMutation, useSoftDeleteRfidMutation } = rfidServerApi;