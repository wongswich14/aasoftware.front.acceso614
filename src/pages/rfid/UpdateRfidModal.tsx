import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { IoClose } from "react-icons/io5"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { useListHousesQuery } from "src/core/features/houseServerApi"
import { useGetRfidQuery, useUpdateRfidMutation } from "src/core/features/rfidServerApi"
import { HouseDto } from "src/core/models/dtos/houses/houseDto"
import { RfidDto } from "src/core/models/dtos/rfids/rfidDto"
import { RfidUpdateDto } from "src/core/models/dtos/rfids/rfidUpdateDto"
import { selectUserData } from "src/core/slices/auth/authSlice"
import LoaderBig from "src/shared/components/LoaderBig"

interface UpdateRfidModalProps {
    toggleModal : () => void
}

const UpdateRfidModal: React.FC<UpdateRfidModalProps> = ({ toggleModal }) => {

    const [homes, setHomes] = useState<HouseDto[]>()
    const [rfid, setRfid] = useState<RfidDto>()

    const navigate = useNavigate()
    const userData = useSelector(selectUserData)
    const { id } = useParams<{ id: string }>()

    const { data: homesData, isFetching: homesIsFetching, isLoading: homesIsLoading } = useListHousesQuery()
    const { data: rfidData, isFetching: rfidIsFetching, isLoading: rfidIsLoading } = useGetRfidQuery(id!, { skip: !id })

    const [updateRfid] = useUpdateRfidMutation()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<RfidUpdateDto>()

    const submitForm = (data: RfidUpdateDto) => {
        const createRfidPromise = updateRfid(data).unwrap()

        toast.promise(createRfidPromise, {
            loading: "Creando RFID...",
            success: () => {
                navigate("/rfid")

                return "RFID creado"
            },
            error: (err) => {
                console.error(err)
                return "Error al crear RFID"
            }
        })
    }

    useEffect(() => {
        if (homesData && !homesIsFetching) {
            setHomes(homesData.listDataObject)
        }
    }, [homesData, homesIsFetching])

    useEffect(() => {
        setValue("userCreatedId", userData?.id!)
    }, [userData])

    useEffect(() => {
        if (rfidData && !rfidIsLoading && homes && !homesIsLoading) {
            setValue("folio", rfidData.dataObject!.folio)
            setValue("homeId", rfidData.dataObject!.home!.id)
            setValue("comments", rfidData.dataObject!.comments)
        }
    }, [rfidData, rfidIsLoading, homes, homesIsLoading])

    if (homesIsLoading || rfidIsLoading ) return <LoaderBig message="Cargando..." />

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%] max-h-[80svh] overflow-y-auto">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={() => toggleModal()}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">
                    Actualizar RFID
                </h3>

                <form
                    className="flex flex-col mt-5 text-gray-700 text-base"
                    onSubmit={handleSubmit(submitForm)}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                        <div className="input-container">
                            <label htmlFor="folio" className="label-form">Folio</label>
                            <input
                                type="text"
                                id="folio"
                                className="input-form"
                                {...register("folio", {
                                    required: "Este campo es obligatorio"
                                })}
                            />
                            {errors.folio && <span className="form-error">{errors.folio.message}</span>}
                        </div>

                        <div className="input-container">
                            <label htmlFor="homeId" className="label-form">Vivienda</label>
                            <select
                                className="input-form h-full"
                                id="homeId"
                                {...register("homeId", {
                                    required: "Este campo es obligatorio"
                                })}
                            >
                                <option value="" >-- Seleccione una --</option>
                                {homes && homes.map(home => (
                                    <option key={home.id} value={home.id}>{home.name}</option>
                                ))}
                            </select>
                            {errors.homeId && <span className="form-error">{errors.homeId.message}</span>}
                        </div>
                    </div>

                    <div className="input-container">
                        <label htmlFor="comments" className="label-form">Comentarios</label>
                        <textarea
                            id="comments"
                            className="input-form"
                            {...register("comments", {
                                required: "Este campo es obligatorio"
                            })}
                        />
                        {errors.comments && <span className="form-error">{errors.comments.message}</span>}
                    </div>

                    <div className="flex justify-end gap-5">
                        <button
                            type="submit"
                            className="submit-button"
                        >
                            Guardar
                        </button>

                        <button
                            type="button"
                            onClick={() => toggleModal()}
                            className="cancel-button"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </section>
        </article>
    );
}

export default UpdateRfidModal;