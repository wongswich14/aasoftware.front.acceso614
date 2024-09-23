import { DoorCreateDto } from "../models/dtos/doors/doorCreateDto";
import { DoorUpdateDto } from "../models/dtos/doors/doorUpdateDto";
import { DoorResponse } from "../models/responses/door.response";
import { serverApi } from "../serverApi";

export const doorServerApi = serverApi.injectEndpoints({
    endpoints: builder => ({
        listDoors: builder.query<DoorResponse, void>({
            query: () => `door`,
            providesTags: ["Door"]
        }),
        
        getDoor: builder.query<DoorResponse, string>({
            query: (id) => `door/${id}`,
        }),

        createDoor: builder.mutation<DoorResponse, DoorCreateDto>({
            query: newDoor => ({
                url: '/door',
                method: 'POST',
                body: newDoor,
            }),
            invalidatesTags: ["Door"]
        }),

        updateDoor: builder.mutation<DoorResponse, DoorUpdateDto>({
            query: updatedDoor => ({
                url: `/door`,
                method: 'PUT',
                body: updatedDoor,
            }),
            invalidatesTags: ["Door"]
        }),

        softDeleteDoor: builder.mutation<DoorResponse, string>({
            query: (id) => ({
                url: `/door/softdelete/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Door"]
        })
    })
})