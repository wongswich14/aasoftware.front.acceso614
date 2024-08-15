import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGetUserQuery, useUpdateUserMutation } from "src/core/features/userServerApi";
import { UserDto } from "src/core/models/dtos/users/userDto";
import { UserUpdateDto } from "src/core/models/dtos/users/userUpdateDto";

interface UpdateUserModalProps {
    toggleUpdateModal: () => void
    lazyUpdateUser: (id: string, newItem: UserUpdateDto) => void
}


const UpdateUserModal: React.FC<UpdateUserModalProps> = ({lazyUpdateUser, toggleUpdateModal }) => {

    const { id } = useParams<{ id: string }>()
    const { data: userData, isLoading: userLoading } = useGetUserQuery(id ?? '')
    const [updateUser, { isLoading }] = useUpdateUserMutation()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<UserUpdateDto>();

    const submitForm = async (data: UserUpdateDto) => {
        const updateUserPromise = updateUser(data).unwrap()

        toast.promise(updateUserPromise, {
            loading: "Actualizando...",
            success: () => {
                lazyUpdateUser(id!, data)
                navigate(`/users`)
                return "Perfil actualizado"
            },
            error: (err) => {
                console.error(err)
                return "Error al actualizar"
            }
        })
    }

    useEffect(() => {
        if (!userLoading && userData) {
            setValue("id", userData.dataObject?.id || "")
            setValue("name", userData.dataObject?.name || "")
            setValue("lastName", userData.dataObject?.lastName || "")
            setValue("email", userData.dataObject?.email || "")
            // setValue("companyId", userData.dataObject?.companyId || "")
        }
    }, [userLoading, userData])

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
                        <label htmlFor="lastName" className="label-form">Apellido</label>
                        <input
                            id="lastName"
                            className="input-form"
                            type="text"
                            {...register("lastName", {
                                required: "Este campo es obligatorio"
                            })}
                        />
                        {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
                    </div>

                    <div className="input-container">
                        <label htmlFor="email" className="label-form">Correo Electrónico</label>
                        <input
                            id="email"
                            className="input-form"
                            type="email"
                            {...register("email", {
                                required: "Este campo es obligatorio",
                                pattern: {
                                    value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                                    message: "Correo electrónico no válido"
                                }
                            })}
                        />
                        {errors.email && <span className="form-error">{errors.email.message}</span>}
                    </div>

                    <div className="input-container">
                        <label htmlFor="password" className="label-form">Contraseña</label>
                        <input
                            id="password"
                            className="input-form"
                            type="password"
                            {...register("password", {
                                required: "Este campo es obligatorio",
                                minLength: {
                                    value: 6,
                                    message: "La contraseña debe tener al menos 6 caracteres"
                                }
                            })}
                        />
                        {errors.password && <span className="form-error">{errors.password.message}</span>}
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
    );
}

export default UpdateUserModal;