import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProfileQuery, useUpdateProfileMutation } from "src/core/features/profileServerApi";
import { ProfileUpdateDto } from "src/core/models/dtos/profiles/profileUpdateDto";
import { toast } from "sonner";
import { ProfileDto } from "src/core/models/dtos/profiles/profileDto";
import { useEffect } from "react";

interface UpdateProfileModalProps {
    toggleUpdateModal: () => void
    lazyUploadProfile: (id: string, newItem: ProfileDto) => void
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ toggleUpdateModal, lazyUploadProfile }) => {

    const { id } = useParams<{ id: string }>()
    const { data: profileData, isLoading: profileLoading } = useGetProfileQuery(id ?? '')
    const [updateProfile, { isLoading }] = useUpdateProfileMutation()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<ProfileUpdateDto>();

    const submitForm = async (data: ProfileUpdateDto) => {
        const updateProfilePromise = updateProfile(data).unwrap()

        toast.promise(updateProfilePromise, {
            loading: "Actualizando...",
            success: () => {
                lazyUploadProfile(id!, data)
                navigate(`/profiles`)
                return "Perfil actualizado"
            },
            error: (err) => {
                console.error(err)
                return "Error al actualizar"
            }
        })
    }

    useEffect(() => {
        if (!profileLoading && profileData) {
            console.log(profileData)
        }
        // setValue("id", id!)
    }, [profileLoading, profileData])

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70 ">
            <section className="bg-white rounded-lg p-10 relative min-w-[40%]">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={() => toggleUpdateModal()}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">
                    Editar Perfil
                </h3>

                <form
                    className="flex flex-col mt-5 text-gray-700 text-base"
                    onSubmit={handleSubmit(submitForm)}
                >

                    <div
                        className="input-container"
                    >
                        <label htmlFor="title" className="label-form">Título</label>
                        <input
                            type="text"
                            id="title"
                            className="input-form"
                            {...register("title", {
                                required: "Este campo es obligatorio"
                            })}
                        />
                        {errors.title && <span className="form-error">{errors.title.message}</span>}
                    </div>

                    <div
                        className="input-container"
                    >
                        <label htmlFor="description" className="label-form">Título</label>
                        <textarea
                            id="description"
                            className="input-form resize-none"
                            rows={2}
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

export default UpdateProfileModal