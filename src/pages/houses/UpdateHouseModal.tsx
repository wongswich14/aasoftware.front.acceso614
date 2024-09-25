import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { IoClose } from "react-icons/io5"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { useGetHouseQuery, useUpdateHouseMutation } from "src/core/features/houseServerApi"
import { useListResidentialsQuery } from "src/core/features/residentialServerApi"
import { useListUsersQuery } from "src/core/features/userServerApi"
import { HouseDto } from "src/core/models/dtos/houses/houseDto"
import { HouseUpdateDto } from "src/core/models/dtos/houses/houseUpdateDto"
import { ResidentialDto } from "src/core/models/dtos/residentials/ResidentialDto"
import { UserDto } from "src/core/models/dtos/users/userDto"
import LoaderBig from "src/shared/components/LoaderBig"
import Switcher from "src/shared/components/Switcher"

interface UpdateHouseModalProps {
    toggleUpdateModal: () => void
        lazyUpdateHouse?: (id: string, newItem: HouseDto) => void
}

const UpdateHouseModal: React.FC<UpdateHouseModalProps> = ({ toggleUpdateModal, lazyUpdateHouse }) => {

    const [residentials, setResidentials] = useState<ResidentialDto[]>()
    const [users, setUsers] = useState<UserDto[]>()
    const { id } = useParams<{ id: string }>()

    const {
        data: residentialsData,
        isLoading: residentialsIsLoading
    } = useListResidentialsQuery()

    const {
        data: usersData,
        isLoading: usersIsLoading
    } = useListUsersQuery()

    const {
        data: houseData,
        isLoading: houseLoading
    } = useGetHouseQuery(id!, { skip: !id })
    const [updateHouse, { isLoading }] = useUpdateHouseMutation()

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<HouseUpdateDto>();


    const submitForm = async (data: HouseUpdateDto) => {
        const updateHousePromise = updateHouse(data).unwrap()

        toast.promise(updateHousePromise, {
            loading: "Actualizando...",
            success: (res) => {
                // lazyUpdateHouse(id!, res.dataObject!)
                navigate(`/houses`)
                return "Vivienda actualizada"
            },
            error: (err) => {
                console.error(err)
                return "Error al actualizar"
            }
        })
    }

    const handleCloseModal = () => {
        reset()
        toggleUpdateModal()
    }

    useEffect(() => {
        if (!houseLoading && houseData && residentials && !residentialsIsLoading && users && !usersIsLoading) {
            if (houseData.dataObject) {
                const serverData = houseData.dataObject
                setValue("id", serverData.id)
                setValue("residentialId", serverData?.residential!.id)
                setValue("name", serverData.name)
                // setValue("personContactId", serverData.personContactId)
                setValue("phoneContact", serverData.phoneContact)
                setValue("street", serverData.street)
                setValue("streetDetail", serverData.streetDetail)
                setValue("number", serverData.number)
                setValue("zip", serverData.zip)
                setValue("enabled", serverData.enabled)
            }
        }
    }, [houseLoading, houseData, residentials, residentialsIsLoading, users, usersIsLoading])

    useEffect(() => {
        if (residentialsData && !residentialsIsLoading) {
            setResidentials(residentialsData.listDataObject)
        }
    }, [residentialsData, residentialsIsLoading])

    useEffect(() => {
        if (usersData && !usersIsLoading)
            setUsers(usersData.listDataObject)
    }, [usersData, usersIsLoading])


    // TODO: Quitarlo cuando se repare
    useEffect(() => {
        setValue("enabled", true)
    }, [])

    useEffect(() => {
        return () => {
            setResidentials([]);
            reset();
        }
    }, []);

    if (residentialsIsLoading || houseLoading) return <LoaderBig message="Cargando datos..." />

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%] overflow-y-auto max-h-[80svh]">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={handleCloseModal}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">Editar Vivienda</h3>

                <form className="flex flex-col mt-5 text-gray-700 text-base" onSubmit={handleSubmit(submitForm)}>

                    <section className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                        <div className="input-container">
                            <label htmlFor="name" className="label-form">Alias</label>
                            <input
                                type="text"
                                id="name"
                                className="input-form"
                                {...register('name', { required: 'Este campo es obligatorio' })}
                            />
                            {errors.name && <span className="form-error">{errors.name.message}</span>}
                        </div>

                        <div className="input-container">
                            <label htmlFor="phoneContact" className="label-form">Teléfono de Contacto</label>
                            <input
                                type="text"
                                id="phoneContact"
                                className="input-form"
                                {...register('phoneContact', { required: 'Este campo es obligatorio' })}
                            />
                            {errors.phoneContact && <span className="form-error">{errors.phoneContact.message}</span>}
                        </div>
                    </section>


                    <div className="input-container">
                        <label htmlFor="residentialId" className="label-form">Residencial</label>
                        <select
                            id="residentialId"
                            className="input-form"
                            {...register('residentialId', { required: 'Este campo es obligatorio' })}
                        >
                            <option value="">-- Seleccione una opción --</option>
                            {residentials && residentials.map(residential => (
                                <option key={residential.id} value={residential.id}>{residential.name}</option>
                            ))}
                        </select>
                        {errors.residentialId && <span className="form-error">{errors.residentialId.message}</span>}
                    </div>

                    <section className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                        <div className="input-container">
                            <label htmlFor="street" className="label-form">Calle</label>
                            <input
                                type="text"
                                id="street"
                                className="input-form"
                                {...register('street', { required: 'Este campo es obligatorio' })}
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
                                {...register('number', { required: 'Este campo es obligatorio' })}
                            />
                            {errors.number && <span className="form-error">{errors.number.message}</span>}
                        </div>

                        <div className="input-container">
                            <label htmlFor="zip" className="label-form">Código Postal</label>
                            <input
                                type="text"
                                id="zip"
                                className="input-form"
                                {...register('zip', { required: 'Este campo es obligatorio' })}
                            />
                            {errors.zip && <span className="form-error">{errors.zip.message}</span>}
                        </div>
                    </section>

                    <div className="flex justify-end gap-5">
                        <button type="submit" className="submit-button">Guardar</button>

                        <button type="button" onClick={handleCloseModal} className="cancel-button">Cancelar</button>
                    </div>
                </form>
            </section>
        </article>
    )
}

export default UpdateHouseModal