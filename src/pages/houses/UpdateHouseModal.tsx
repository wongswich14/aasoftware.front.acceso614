import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { IoClose } from "react-icons/io5"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { useGetHouseQuery, useUpdateHouseMutation } from "src/core/features/houseServerApi"
import { useListResidentialsQuery } from "src/core/features/residentialServerApi"
import { HouseDto } from "src/core/models/dtos/houses/houseDto"
import { HouseUpdateDto } from "src/core/models/dtos/houses/houseUpdateDto"
import { ResidentialDto } from "src/core/models/dtos/residentials/ResidentialDto"
import LoaderBig from "src/shared/components/LoaderBig"
import Switcher from "src/shared/components/Switcher"

interface UpdateHouseModalProps {
    toggleUpdateModal: () => void
    lazyUpdateHouse: (id: string, newItem: HouseDto) => void
}

const UpdateHouseModal: React.FC<UpdateHouseModalProps> = ({ toggleUpdateModal, lazyUpdateHouse }) => {

    const [residentials, setResidentials] = useState<ResidentialDto[]>()
    const { id } = useParams<{ id: string }>()

    const { data: houseData, isLoading: houseLoading } = useGetHouseQuery(id ?? '')
    const [updateHouse, { isLoading }] = useUpdateHouseMutation()
    const navigate = useNavigate()

    const {
        data: residentialsData,
        isLoading: residentialsIsLoading
    } = useListResidentialsQuery()

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
                lazyUpdateHouse(id!, res.dataObject!)
                navigate(`/houses`)
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
                setValue("residentialId", serverData.residentialId)
                setValue("name", serverData.name)
                setValue("address.street", serverData.address.street)
                setValue("address.streetDetail", serverData.address.streetDetail)
                setValue("address.number", serverData.address.number)
                setValue("address.zip", serverData.address.zip)
                setValue("address.isPrincipal", serverData.address.isPrincipal)
                setValue("enabled", serverData.enabled)
                setValue("personContact", serverData.personContact)
                setValue("phoneContact", serverData.phoneContact)
            }
        }
    }, [houseLoading, houseData])

    useEffect(() => {
        if (residentialsData && !residentialsIsLoading) {
            setResidentials(residentialsData.listDataObject)
        }
    }, [residentialsData, residentialsIsLoading])


    // TODO: Quitarlo cuando se repare
    useEffect(() => {
        setValue("address.reference", "")
        setValue("enabled", true)
    }, [])

    if (residentialsIsLoading || houseLoading) return <LoaderBig message="Cargando" />

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%] max-h-[80%] overflow-y-auto scrol">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={() => toggleUpdateModal()}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">Editar Vivienda</h3>

                <form className="flex flex-col mt-5 text-gray-700 text-base" onSubmit={handleSubmit(submitForm)}>
                    <div className="input-container">
                        <label htmlFor="residentialId" className="label-form">Residencial</label>
                        {/* <input
                            type="text"
                            id="residentialId"
                            className="input-form"
                            {...register('residentialId', { required: 'Este campo es obligatorio' })}
                        /> */}
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
                        <label htmlFor="street" className="label-form">Calle</label>
                        <input
                            type="text"
                            id="street"
                            className="input-form"
                            {...register('address.street', { required: 'Este campo es obligatorio' })}
                        />
                        {errors.address?.street && <span className="form-error">{errors.address.street.message}</span>}
                    </div>

                    <div className="input-container">
                        <label htmlFor="streetDetail" className="label-form">Detalles de Calle</label>
                        <input
                            type="text"
                            id="streetDetail"
                            className="input-form"
                            {...register('address.streetDetail')}
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="number" className="label-form">Número</label>
                        <input
                            type="text"
                            id="number"
                            className="input-form"
                            {...register('address.number', { required: 'Este campo es obligatorio' })}
                        />
                        {errors.address?.number && <span className="form-error">{errors.address.number.message}</span>}
                    </div>

                    <div className="input-container">
                        <label htmlFor="zip" className="label-form">Código Postal</label>
                        <input
                            type="text"
                            id="zip"
                            className="input-form"
                            {...register('address.zip', { required: 'Este campo es obligatorio' })}
                        />
                        {errors.address?.zip && <span className="form-error">{errors.address.zip.message}</span>}
                    </div>

                    {/* <div className="input-container">
                        <label htmlFor="reference" className="label-form">Referencia</label>
                        <input
                            type="text"
                            id="reference"
                            className="input-form"
                            {...register('address.reference')}
                        />
                    </div> */}

                    <div className="input-container">
                        <label htmlFor="isPrincipal" className="label-form">¿Es Principal?</label>

                        <Switcher
                            id="isPrincipal" 
                            isChecked={watch('address.isPrincipal')}
                            onChange={() => setValue('address.isPrincipal', !watch('address.isPrincipal'))}
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="personContact" className="label-form">Persona de Contacto</label>
                        <input
                            type="text"
                            id="personContact"
                            className="input-form"
                            {...register('personContact', { required: 'Este campo es obligatorio' })}
                        />
                        {errors.personContact && <span className="form-error">{errors.personContact.message}</span>}
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

                    <div className="flex justify-end gap-5">
                        <button type="submit" className="submit-button">Guardar</button>

                        <button type="button" onClick={() => toggleUpdateModal()} className="cancel-button">Cancelar</button>
                    </div>
                </form>
            </section>
        </article>
    )
} 

export default UpdateHouseModal