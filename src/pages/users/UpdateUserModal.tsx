import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateHouseMutation, useListHousesQuery } from "src/core/features/houseServerApi";
import { useListProfilesQuery } from "src/core/features/profileServerApi";
import { useListResidentialsQuery } from "src/core/features/residentialServerApi";
import { useGetUserQuery, useUpdateUserMutation } from "src/core/features/userServerApi";
import { HouseDto } from "src/core/models/dtos/houses/houseDto";
import { ProfileDto } from "src/core/models/dtos/profiles/profileDto";
import { ResidentialDto } from "src/core/models/dtos/residentials/ResidentialDto";
import { UserDto } from "src/core/models/dtos/users/userDto";
import { UserUpdateDto } from "src/core/models/dtos/users/userUpdateDto";
import LoaderBig from "src/shared/components/LoaderBig";
import Switcher from "src/shared/components/Switcher";

interface UpdateUserModalProps {
    toggleUpdateModal: () => void
    lazyUpdateUser: (id: string, newItem: UserUpdateDto) => void
}


const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ lazyUpdateUser, toggleUpdateModal }) => {

    const { id } = useParams<{ id: string }>()
    const [profiles, setProfiles] = useState<ProfileDto[]>()
    const [residentials, setResidentials] = useState<ResidentialDto[]>()
    const [houses, setHouses] = useState<HouseDto[]>()

    const { data: userData, isLoading: userLoading } = useGetUserQuery(id ?? '')
    const { data: profilesData,
        isLoading: profilesIsLoading } = useListProfilesQuery()

    const { data: residentialsData,
        isLoading: residentialsIdLoading } = useListResidentialsQuery()

    const { data: housesData,
        isLoading: housesIsLoading,
        refetch: refetchHouses,
        isFetching: housesIsFetching } = useListHousesQuery()

    const [updateUser, { isLoading }] = useUpdateUserMutation()
    const [createHouse, { isLoading: createHouseIsLoaing }] = useCreateHouseMutation()

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

    const submitForm = async (data: UserUpdateDto) => {
        const updateUserPromise = updateUser(data).unwrap()

        toast.promise(updateUserPromise, {
            loading: "Actualizando...",
            success: () => {
                reset()
                navigate(`/users`)
                return "Usuario actualizado"
            },
            error: (err) => {
                console.error(err)
                return "Error al actualizar"
            }
        })
    }

    const handleCloseModal = () => {
        reset()
        toggleUpdateModal()
    }

    const handleCreateFamilyHouse = async () => {
        const formData = watch();

        if (formData.lastName.trim().length === 0 ||
            formData.residentialId.trim().length === 0) {
            toast.error("Ingrese el apellido y la residencial para generar la vivienda");
            return;
        }

        try {
            // Crea la casa sin usar `toast.promise`
            const res = await createHouse({
                residentialId: formData.residentialId,
                name: `Casa de familia ${formData.lastName}`,
                phoneContact: "",
                street: "",
                streetDetail: "",
                number: "",
                zip: "",
                enabled: true,
                maxRfid: 3
            }).unwrap();

            // Refetch de las casas
            if (res?.dataObject) {
                // Setea el ID en el formulario antes de que los datos se actualicen en el estado
                setValue('homeId', res.dataObject.id);
                await refetchHouses();
                toast.success("Vivienda generada exitosamente");
            } else {
                toast.error("Error inesperado: No se recibió el objeto de datos esperado.");
            }
        } catch (error) {
            console.error("Error al crear la vivienda:", error);
            toast.error("Error al generar la vivienda");
        }
    };

    useEffect(() => {
        if (!userLoading && userData && residentials && !residentialsIdLoading && profiles && !profilesIsLoading && houses && !housesIsLoading) {
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
    }, [userLoading, userData, residentials, profiles, residentialsIdLoading, profilesIsLoading, houses, housesIsLoading])

    useEffect(() => {
        if (profilesData && !profilesIsLoading) {
            setProfiles(profilesData.listDataObject)
        }
    }, [profilesData, profilesIsLoading])

    useEffect(() => {
        if (residentialsData && !residentialsIdLoading)
            setResidentials(residentialsData.listDataObject)
    }, [residentialsData, residentialsIdLoading])

    useEffect(() => {
        if (housesData && !housesIsLoading && !housesIsFetching)
            setHouses(housesData.listDataObject)
    }, [housesData, housesIsLoading, housesIsFetching])

    useEffect(() => {
        if (houses && houses.length > 0) {
            const createdHouseId = watch("homeId");
            const createdHouse = houses.find(house => house.id === createdHouseId);
            if (createdHouse) {
                setValue('homeId', createdHouse.id);
            }
        }
    }, [houses, watch("homeId")]);

    useEffect(() => {
        return () => {
            setProfiles([]);
            setResidentials([]);
            reset();
        };
    }, []);

    if (userLoading || profilesIsLoading || residentialsIdLoading || housesIsLoading) return <LoaderBig message="Cargando datos..." />

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70 ">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%] max-h-[80svh] overflow-y-auto">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={handleCloseModal}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">
                    Editar Usuario
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
                            <label htmlFor="residentialId" className="label-form">Residencial</label>

                            <select
                                className="input-form"
                                id="residentialId"
                                {...register("residentialId", {
                                    required: "Este campo es obligatorio"
                                })}
                            >
                                <option value="" >-- Seleccione una --</option>
                                {residentials && residentials.map(residential => (
                                    <option key={residential.id} value={residential.id}>{residential.name}</option>
                                ))}
                            </select>
                            {errors.residentialId && <span className="form-error">{errors.residentialId.message}</span>}
                        </div>

                        <div className="input-container">
                            <div className="flex items-center justify-between">
                                <label htmlFor="homeId" className="label-form">Vivienda</label>
                                <button disabled={createHouseIsLoaing} type="button" onClick={handleCreateFamilyHouse} className="disabled:text-gray-500 text-sm text-sky-500 hover:underline">
                                    Generar Vivienda
                                </button>
                            </div>

                            <select
                                className="input-form"
                                id="homeId"
                                {...register("homeId", {
                                    required: "Este campo es obligatorio"
                                })}
                            >
                                <option value="" >-- Seleccione una --</option>
                                {houses && houses.map(house => (
                                    <option key={house.id} value={house.id}>{house.name}</option>
                                ))}
                            </select>
                            {errors.homeId && <span className="form-error">{errors.homeId.message}</span>}
                        </div>
                    </section>

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
                                <option value="" >-- Seleccione una --</option>
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
                            onClick={handleCloseModal}
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