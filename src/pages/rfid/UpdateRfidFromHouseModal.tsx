import {IoClose} from "react-icons/io5";
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUserData} from "../../core/slices/auth/authSlice.ts";
import {useGetRfidQuery, useUpdateRfidMutation} from "../../core/features/rfidServerApi.ts";
import {useForm} from "react-hook-form";
import {RfidUpdateDto} from "../../core/models/dtos/rfids/rfidUpdateDto.ts";
import {toast} from "sonner";
import LoaderBig from "../../shared/components/LoaderBig.tsx";

interface UpdateRfidFromHouseModalProps {
    toggleModal: () => void
    rfidId: string
}

const UpdateRfidFromHouseModal: React.FC<UpdateRfidFromHouseModalProps> = ({toggleModal, rfidId}) => {

    const userData = useSelector(selectUserData)

    // Id de house
    const {id} = useParams<{ id: string }>()

    const {data: rfidData, isLoading: rfidIsLoading} = useGetRfidQuery(rfidId)

    const [updateRfid] = useUpdateRfidMutation()

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue
    } = useForm<RfidUpdateDto>()

    const submitForm = (data: RfidUpdateDto) => {
        const createRfidPromise = updateRfid(data).unwrap()

        toast.promise(createRfidPromise, {
            loading: "Actualizando RFID...",
            success: () => {
                toggleModal()
                return "RFID Actualizado"
            },
            error: (err) => {
                console.error(err)
                return "Error al actualizar RFID"
            }
        })
    }

    useEffect(() => {
        if (rfidData && !rfidIsLoading) {
            setValue("folio", rfidData.dataObject!.folio)
            setValue("homeId", id!)
            setValue("comments", rfidData.dataObject!.comments)
            setValue("userCreatedId", userData?.id || "")
            setValue("id", rfidId)
        }
    }, [rfidData, rfidIsLoading])

    if (rfidIsLoading) return <LoaderBig message="Cargando..."/>

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
    )
}

export default UpdateRfidFromHouseModal