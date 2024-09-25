import { DoorCreateDto } from "../models/dtos/doors/doorCreateDto";
                import { DoorUpdateDto } from "../models/dtos/doors/doorUpdateDto";
                import { DoorResponse } from "../models/responses/door.response";
                import { serverApi } from "../serverApi";

                export const doorServerApi = serverApi.injectEndpoints({
                    endpoints: builder => ({
                        listDoors: builder.query<DoorResponse, void>({
                            query: () => `doors`,
                            providesTags: ["Door"]
                        }),

                        getDoor: builder.query<DoorResponse, string>({
                            query: (id) => `doors/${id}`,
        }),

        createDoor: builder.mutation<DoorResponse, DoorCreateDto>({
            query: newDoor => ({
                url: '/doors',
                method: 'POST',
                body: newDoor,
            }),
            invalidatesTags: ["Door"]
        }),

        updateDoor: builder.mutation<DoorResponse, DoorUpdateDto>({
            query: updatedDoor => ({
                url: `/doors`,
                method: 'PUT',
                body: updatedDoor,
            }),
            invalidatesTags: ["Door"]
        }),

        softDeleteDoor: builder.mutation<DoorResponse, string>({
            query: (id) => ({
                url: `/doors/softdelete/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Door"]
        })
    })
})

export const {
    useListDoorsQuery,
    useGetDoorQuery,
    useCreateDoorMutation,
    useUpdateDoorMutation,
    useSoftDeleteDoorMutation,
} = doorServerApi