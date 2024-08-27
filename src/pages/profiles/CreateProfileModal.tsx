import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateProfileMutation, useListPermissionsQuery } from "src/core/features/profileServerApi";
import { PermissionDto } from "src/core/models/dtos/permissions/permissionDto";
import { ProfileCreateDto } from "src/core/models/dtos/profiles/profileCreateDto";
import { ProfileDto } from "src/core/models/dtos/profiles/profileDto";
import Switcher from "src/shared/components/Switcher";

interface CreateProfileModalProps {
    toggleCreateModal: () => void
    lazyAddProfile: (newItem: ProfileDto) => void
    refetchProfiles?: () => void
}

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ toggleCreateModal, lazyAddProfile, refetchProfiles }) => {

    const [createProfile, { isLoading }] = useCreateProfileMutation()
    const [permissions, setPermissions] = useState<PermissionDto[]>()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<ProfileCreateDto>();

    const permissionsId = watch('permissionsId', []);

    const {
        data: permissionData,
        isLoading: permissionIsLoading
    } = useListPermissionsQuery()

    const submitForm = async (data: ProfileCreateDto) => {
        // console.log(data)
        const createProfilePromise = createProfile(data).unwrap()
    
        toast.promise(createProfilePromise, {
            loading: "Creando...",
            success: (res) => {
                refetchProfiles && refetchProfiles()
                navigate(`/profiles`)
                return "Perfil creado"
            },
            error: (err) => {
                console.error(err)
                return "Error al crear perfil"
            }
        })
    }

    useEffect(() => {
        if (permissionData && !permissionIsLoading) {
            setPermissions(permissionData.listDataObject || [])
        }
    }, [permissionData, permissionIsLoading])

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70 ">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%] max-h-[80%] overflow-y-auto scrol">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={() => toggleCreateModal()}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">
                    Crear Perfil
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
                        <label htmlFor="description" className="label-form">Descripción</label>
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

                    <div
                        className="input-container"
                    >
                        <label htmlFor="permissions" className="label-form">Permisos</label>
    
                        <div className="flex flex-col gap-3">
                        {permissions && permissions.map((permission) => {
                                const isChecked = permissionsId.includes(permission.id);
                                return (
                                    <div key={permission.id} className="flex items-center gap-2">
                                        <Switcher
                                            id={permission.id}
                                            isChecked={isChecked}
                                            onChange={() => {
                                                if (isChecked) {
                                                    setValue('permissionsId', permissionsId.filter(id => id !== permission.id));
                                                } else {
                                                    setValue('permissionsId', [...permissionsId, permission.id]);
                                                }
                                            }}
                                        />
                                        <label htmlFor={permission.id}>{permission.name}</label>
                                    </div>
                                );
                            })}
                        </div>
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

export default CreateProfileModal