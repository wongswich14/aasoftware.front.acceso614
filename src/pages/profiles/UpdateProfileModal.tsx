import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProfileQuery, useListPermissionsQuery, useUpdateProfileMutation } from "src/core/features/profileServerApi";
import { ProfileUpdateDto } from "src/core/models/dtos/profiles/profileUpdateDto";
import { toast } from "sonner";
import { ProfileDto } from "src/core/models/dtos/profiles/profileDto";
import { useEffect, useState } from "react";
import Switcher from "src/shared/components/Switcher";
import { PermissionDto } from "src/core/models/dtos/permissions/permissionDto";
import LoaderBig from "src/shared/components/LoaderBig";

interface UpdateProfileModalProps {
    toggleUpdateModal: () => void
    lazyUpdateProfile: (id: string, newItem: ProfileUpdateDto) => void
    refetchProfiles?: () => void
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ toggleUpdateModal, lazyUpdateProfile, refetchProfiles }) => {

    const { id } = useParams<{ id: string }>()
    const [permissions, setPermissions] = useState<PermissionDto[]>()
    const {
        data: permissionData,
        isLoading: permissionIsLoading
    } = useListPermissionsQuery()
    const { data: profileData, isLoading: profileLoading } = useGetProfileQuery(id ?? '')
    const [updateProfile, { isLoading }] = useUpdateProfileMutation()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<ProfileUpdateDto>();

    const permissionsId = watch('permissionsId', []);

    const submitForm = async (data: ProfileUpdateDto) => {
        const updateProfilePromise = updateProfile(data).unwrap()

        toast.promise(updateProfilePromise, {
            loading: "Actualizando...",
            success: () => {
                // lazyUpdateProfile(id!, data)
                refetchProfiles && refetchProfiles()
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
            setValue("title", profileData.dataObject?.title || "")
            setValue("description", profileData.dataObject?.description || "")
            setValue("id", profileData.dataObject?.id || "")
            setValue("permissionsId", profileData.dataObject?.permissions?.map(p => p.id) || [])
        }
    }, [profileLoading, profileData])

    useEffect(() => {
        if (permissionData && !permissionIsLoading) {
            setPermissions(permissionData.listDataObject || [])
        }
    }, [permissionData, permissionIsLoading])

    if (profileLoading || permissionIsLoading) return <LoaderBig message="Cargando datos..." />

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70 ">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%] max-h-[80%]  overflow-auto">
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