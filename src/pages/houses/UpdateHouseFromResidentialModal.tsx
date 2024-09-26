import {IoClose} from "react-icons/io5";
import React, {useEffect, useState} from "react";
import {UserDto} from "../../core/models/dtos/users/userDto.ts";
import {useParams} from "react-router-dom";
import {useListUsersQuery} from "../../core/features/userServerApi.ts";
import {useGetHouseQuery, useUpdateHouseMutation} from "../../core/features/houseServerApi.ts";
import {useForm} from "react-hook-form";
import {HouseUpdateDto} from "../../core/models/dtos/houses/houseUpdateDto.ts";
import {toast} from "sonner";
import LoaderBig from "../../shared/components/LoaderBig.tsx";

interface UpdateHouseFromResidentialModalProps {
    toggleModal: () => void
    houseId: string
}

const UpdateHouseFromResidentialModal: React.FC<UpdateHouseFromResidentialModalProps> = ({toggleModal, houseId}) => {

    // Id de la Residencial
    const { id } = useParams<{ id: string }>()

    const {
        data: houseData,
        isLoading: houseLoading
    } = useGetHouseQuery(houseId, { skip: !houseId })

    const [updateHouse] = useUpdateHouseMutation()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<HouseUpdateDto>();


    const submitForm = async (data: HouseUpdateDto) => {
        const updateHousePromise = updateHouse(data).unwrap()

        toast.promise(updateHousePromise, {
            loading: "Actualizando...",
            success: () => {
                toggleModal()
                return "Vivienda actualizada"
            },
            error: (err) => {
                console.error(err)
                return "Error al actualizar"
            }
        })
    }

    useEffect(() => {
        if (!houseLoading && houseData) {
            if (houseData.dataObject) {
                const serverData = houseData.dataObject
                setValue("id", serverData.id)
                setValue("residentialId", id!)
                setValue("name", serverData.name)
                setValue("phoneContact", serverData.phoneContact)
                setValue("street", serverData.street)
                setValue("streetDetail", serverData.streetDetail)
                setValue("number", serverData.number)
                setValue("zip", serverData.zip)
                setValue("enabled", serverData.enabled)
            }
        }
    }, [houseLoading, houseData])

    if (houseLoading) return <LoaderBig />

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%] overflow-y-auto max-h-[80svh]">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={toggleModal}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">Actualizar Vivienda</h3>

                <form className="flex flex-col mt-5 text-gray-700 text-base font-normal" onSubmit={handleSubmit(submitForm)}>

                    <section className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                        <div className="input-container">
                            <label htmlFor="name" className="label-form">Alias</label>
                            <input
                                type="text"
                                id="name"
                                className="input-form"
                                {...register('name', {required: 'Este campo es obligatorio'})}
                            />
                            {errors.name && <span className="form-error">{errors.name.message}</span>}
                        </div>

                        <div className="input-container">
                            <label htmlFor="phoneContact" className="label-form">Teléfono de Contacto</label>
                            <input
                                type="text"
                                id="phoneContact"
                                className="input-form"
                                {...register('phoneContact', {required: 'Este campo es obligatorio'})}
                            />
                            {errors.phoneContact && <span className="form-error">{errors.phoneContact.message}</span>}
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                        <div className="input-container">
                            <label htmlFor="street" className="label-form">Calle</label>
                            <input
                                type="text"
                                id="street"
                                className="input-form"
                                {...register('street', {required: 'Este campo es obligatorio'})}
                            />
                            {errors.street && <span className="form-error">{errors.street.message}</span>}
                        </div>

                        <div className="input-container">
                            <label htmlFor="streetDetail" className="label-form">Detalles de calle</label>
                            <input
                                type="text"
                                id="streetDetail"
                                className="input-form"
                                {...register('streetDetail')}
                            />
                            {errors.streetDetail && <span className="form-error">{errors.streetDetail.message}</span>}
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                        <div className="input-container">
                            <label htmlFor="number" className="label-form">Número de casa</label>
                            <input
                                type="text"
                                id="number"
                                className="input-form"
                                {...register('number', {required: 'Este campo es obligatorio'})}
                            />
                            {errors.number && <span className="form-error">{errors.number.message}</span>}
                        </div>

                        <div className="input-container">
                            <label htmlFor="zip" className="label-form">Código Postal</label>
                            <input
                                type="text"
                                id="zip"
                                className="input-form"
                                {...register('zip', {required: 'Este campo es obligatorio'})}
                            />
                            {errors.zip && <span className="form-error">{errors.zip.message}</span>}
                        </div>
                    </section>

                    <div className="flex justify-end gap-5">
                        <button type="submit" className="submit-button">Guardar</button>

                        <button type="button" onClick={toggleModal} className="cancel-button">Cancelar</button>
                    </div>
                </form>
            </section>
        </article>
    )
}

export default UpdateHouseFromResidentialModal;