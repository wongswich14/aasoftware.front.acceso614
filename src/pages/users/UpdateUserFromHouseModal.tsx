import {IoClose} from "react-icons/io5";
import Switcher from "../../shared/components/Switcher.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ProfileDto} from "../../core/models/dtos/profiles/profileDto.ts";
import {ResidentialDto} from "../../core/models/dtos/residentials/ResidentialDto.ts";
import {HouseDto} from "../../core/models/dtos/houses/houseDto.ts";
import {useGetUserQuery, useUpdateUserMutation} from "../../core/features/userServerApi.ts";
import {useListProfilesQuery} from "../../core/features/profileServerApi.ts";
import {useListResidentialsQuery} from "../../core/features/residentialServerApi.ts";
import {useCreateHouseMutation, useListHousesQuery} from "../../core/features/houseServerApi.ts";
import {useForm} from "react-hook-form";
import {UserUpdateDto} from "../../core/models/dtos/users/userUpdateDto.ts";
import {toast} from "sonner";
import LoaderBig from "../../shared/components/LoaderBig.tsx";

interface UpdateUserFromHouseModalProps {
    toggleModal: () => void
    userId: string
}

const UpdateUserFromHouseModal: React.FC<UpdateUserFromHouseModalProps> = ({ toggleModal, userId }) => {

    const [profiles, setProfiles] = useState<ProfileDto[]>()

    // Id de house
    const { id } = useParams<{ id: string }>()

    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<UserUpdateDto>();

    const isPrincipal = watch("isPrincipal", false);

    const { data: userData, isLoading: userLoading } = useGetUserQuery(userId)

    const { data: profilesData,
        isLoading: profilesIsLoading } = useListProfilesQuery()

    const [updateUser] = useUpdateUserMutation()

    const submitForm = async (data: UserUpdateDto) => {
        const updateUserPromise = updateUser(data).unwrap()

        toast.promise(updateUserPromise, {
            loading: "Actualizando...",
            success: () => {
                toggleModal()
                return "Usuario actualizado"
            },
            error: (err) => {
                console.error(err)
                return "Error al actualizar"
            }
        })
    }

    useEffect(() => {
        if (!userLoading && userData && profiles && !profilesIsLoading) {
            const serverData = userData.dataObject
            setValue("id", serverData?.id || "")
            setValue("name", serverData?.name || "")
            setValue("lastName", serverData?.lastName || "")
            setValue("email", serverData?.email || "")
            setValue("emailConfirmed", serverData?.emailConfirmed || true)
            setValue("residentialId", serverData?.residential?.id || "")
            setValue("profileId", serverData?.profileId || "")
            setValue("homeId", userData.dataObject?.home?.id || "")
            setValue("isPrincipal", serverData?.isPrincipal || false)
        }
    }, [userLoading, userData, profiles, profilesIsLoading])

    useEffect(() => {
        if (profilesData && !profilesIsLoading) {
            setProfiles(profilesData.listDataObject)
        }
    }, [profilesData, profilesIsLoading])

    if (userLoading || profilesIsLoading) return <LoaderBig />

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70 ">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%] max-h-[80svh] overflow-y-auto">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={toggleModal}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">
                    Actualizar habitante
                </h3>

                <form
                    className="flex flex-col mt-5 text-gray-700 text-base"
                    onSubmit={handleSubmit(submitForm)}
                >

                    <section className="grid grid-cols-1 md:grid-cols-2 md:gap-5">

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
                    </section>

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
                        <label htmlFor="password" className="label-form">Nueva contraseña</label>
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

                    <section className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                        <div className="input-container">
                            <label htmlFor="profileId" className="label-form">Perfil</label>

                            <select
                                className="input-form"
                                id="profileId"
                                {...register("profileId", {
                                    required: "Este campo es obligatorio"
                                })}
                            >
                                <option value="">-- Seleccione una --</option>
                                {profiles && profiles.map(profile => (
                                    <option key={profile.id} value={profile.id}>{profile.title}</option>
                                ))}
                            </select>
                            {errors.profileId && <span className="form-error">{errors.profileId.message}</span>}
                        </div>

                        <div className="input-container">
                            <label htmlFor="isPrincipal" className="label-form">¿Es responsable de casa?</label>
                            <Switcher
                                isChecked={isPrincipal}
                                onChange={() => setValue('isPrincipal', !isPrincipal)}
                            />
                            {errors.isPrincipal && <span className="form-error">{errors.isPrincipal.message}</span>}
                        </div>
                    </section>


                    <div className="flex justify-end gap-5">
                        <button
                            type="submit"
                            className="submit-button"
                        >
                            Guardar
                        </button>

                        <button
                            type="button"
                            onClick={toggleModal}
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

export default UpdateUserFromHouseModal;