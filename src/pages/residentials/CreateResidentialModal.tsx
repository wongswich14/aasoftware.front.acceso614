import React from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateResidentialMutation } from "src/core/features/residentialServerApi";
import { RegisterDto } from "src/core/models/dtos/auth/registerDto";
import { ResidentialCreateDto } from "src/core/models/dtos/residentials/ResidentialCreateDto";
import { ResidentialDto } from "src/core/models/dtos/residentials/ResidentialDto";

interface CreateResidentialModalProps {
    toggleCreateModal: () => void
    lazyAddResidential: (newItem: ResidentialDto) => void
}

const CreateResidentialModal: React.FC<CreateResidentialModalProps> = ({ toggleCreateModal, lazyAddResidential }) => {

    const [createResidential, { isLoading }] = useCreateResidentialMutation()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<ResidentialCreateDto>();

    const submitForm = async (data: ResidentialCreateDto) => {
        const createResidentialPromise = createResidential(data).unwrap()

        toast.promise(createResidentialPromise, {
            loading: "Creando...",
            success: (res) => {
                lazyAddResidential({
                    id: res.dataObject?.id || "",
                    name: data.name || "",
                    description: data.description || "",
                    homes: []
                })
                navigate(`/residentials`)
                return "Residencial creada"
            },
            error: (err) => {
                console.error(err)
                return "Error al crear residencial"
            }
        })
    }
    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70 ">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%]">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={() => toggleCreateModal()}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">
                    Crear Residencial
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
                            onClick={() => toggleCreateModal()}
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

export default CreateResidentialModal;