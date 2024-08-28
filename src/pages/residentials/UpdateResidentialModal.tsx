import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGetResidentialQuery, useUpdateResidentialMutation } from "src/core/features/residentialServerApi";
import { ResidentialDto } from "src/core/models/dtos/residentials/ResidentialDto";
import { ResidentialUpdateDto } from "src/core/models/dtos/residentials/ResidentialUpdateDto";
import LoaderBig from "src/shared/components/LoaderBig";


interface UpdateResidentialModalProps {
    toggleUpdateModal: () => void
    lazyUpdateResidential: (id: string, newItem: ResidentialDto) => void
}

const UpdateResidentialModal: React.FC<UpdateResidentialModalProps> = ({ toggleUpdateModal, lazyUpdateResidential }) => {

    const { id } = useParams<{ id: string }>()
    const { data: residentialData, isLoading: residentialLoading } = useGetResidentialQuery(id ?? '')
    const [updateResidential, { isLoading }] = useUpdateResidentialMutation()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<ResidentialUpdateDto>();

    const submitForm = async (data: ResidentialUpdateDto) => {
        const updateResidentialPromise = updateResidential(data).unwrap()

        toast.promise(updateResidentialPromise, {
            loading: "Actualizando...",
            success: () => {
                lazyUpdateResidential(id!, {
                    id: data.id || "",
                    name: data.name || "",
                    description: data.description || "",
                    homes: []
                })
                navigate(`/residentials`)
                return "Residencial actualizada"
            },
            error: (err) => {
                console.error(err)
                return "Error al actualizar"
            }
        })
    }

    useEffect(() => {
        if (!residentialLoading && residentialData) {
            setValue("name", residentialData.dataObject?.name || "")
            setValue("description", residentialData.dataObject?.description || "")
            setValue("id", residentialData.dataObject?.id || "")
        }
    }, [residentialLoading, residentialData])

    if (residentialLoading) return <LoaderBig message="Cargando datos..."/>

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70 ">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%]">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={() => toggleUpdateModal()}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">
                    Editar Residencial
                </h3>

                <form
                    className="flex flex-col mt-5 text-gray-700 text-base"
                    onSubmit={handleSubmit(submitForm)}
                >
                    <div className="input-container">
                        <label htmlFor="name" className="label-form">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            className="input-form"
                            {...register("name", {
                                required: "Este campo es obligatorio"
                            })}
                        />
                        {errors.name && <span className="form-error">{errors.name.message}</span>}
                    </div>

                    <div className="input-container">
                        <label htmlFor="description" className="label-form">Descripción</label>
                        <input
                            id="description"
                            className="input-form"
                            type="text"
                            {...register("description", {
                                required: "Este campo es obligatorio"
                            })}
                        />
                        {errors.description && <span className="form-error">{errors.description.message}</span>}
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
                            onClick={() => toggleUpdateModal()}
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

export default UpdateResidentialModal;