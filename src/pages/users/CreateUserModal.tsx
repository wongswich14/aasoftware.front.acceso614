import { useForm } from "react-hook-form"
import { IoClose } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useCreateUserMutation } from "src/core/features/userServerApi"
import { UserCreateDto } from "src/core/models/dtos/users/userCreateDto"

interface CreateUserModalProps {
    toggleCreateModal: () => void
    refetchUsers: () => void
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ toggleCreateModal, refetchUsers }) => {

    const [createUser, { isLoading }] = useCreateUserMutation()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<UserCreateDto>();

    const submitForm = async (data: UserCreateDto) => {
        const createUserPromise = createUser(data).unwrap()

        toast.promise(createUserPromise, {
            loading: "Creando...",
            success: () => {
                // lazyUploadUser(id!, data)
                refetchUsers()
                navigate(`/users`)
                return "Perfil creado"
            },
            error: (err) => {
                console.error(err)
                return "Error al crear perfil"
            }
        })
    }

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70 ">
            <section className="bg-white rounded-lg p-10 relative min-w-[40%]">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={() => toggleCreateModal()}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">
                    Crear Usuario
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

                    <div className="input-container">
                        <label htmlFor="companyId" className="label-form">Empresa</label>
                        <input
                            id="companyId"
                            className="input-form"
                            type="text"
                            {...register("companyId", {
                                required: "Este campo es obligatorio"
                            })}
                        />
                        {errors.companyId && <span className="form-error">{errors.companyId.message}</span>}
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
    );
}

export default CreateUserModal;