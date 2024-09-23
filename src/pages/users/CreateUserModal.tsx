import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { IoClose } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useRegisterUserMutation } from "src/core/features/authServerApi"
import { useCreateHouseMutation, useListHousesQuery } from "src/core/features/houseServerApi"
import { useListProfilesQuery } from "src/core/features/profileServerApi"
import { useListResidentialsQuery } from "src/core/features/residentialServerApi"
import { useAppendUserToHomeMutation, useAppendUserToResidentialMutation, useCreateUserMutation } from "src/core/features/userServerApi"
import { RegisterDto } from "src/core/models/dtos/auth/registerDto"
import { HouseDto } from "src/core/models/dtos/houses/houseDto"
import { ProfileDto } from "src/core/models/dtos/profiles/profileDto"
import { ResidentialDto } from "src/core/models/dtos/residentials/ResidentialDto"
import { UserCreateDto } from "src/core/models/dtos/users/userCreateDto"
import { UserDto } from "src/core/models/dtos/users/userDto"
import Switcher from "src/shared/components/Switcher"

interface CreateUserModalProps {
    toggleCreateModal: () => void
    lazyAddUser: (newItem: UserDto) => void
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ toggleCreateModal, lazyAddUser }) => {

    const [profiles, setProfiles] = useState<ProfileDto[]>()
    const [residentials, setResidentials] = useState<ResidentialDto[]>()
    const [houses, setHouses] = useState<HouseDto[]>()

    const [createUser, { isLoading }] = useCreateUserMutation()
    const [appendUserToResidential, { isLoading: appendUserToResidentialIsLoading }] = useAppendUserToResidentialMutation()
    const [appendUserToHome, { isLoading: appendUserToHomeIsLoading }] = useAppendUserToHomeMutation()
    const [createHouse, { isLoading: createHouseIsLoading }] = useCreateHouseMutation()

    const navigate = useNavigate()

    const { data: profilesData,
        isLoading: profilesIsLoading } = useListProfilesQuery()

    const { data: residentialsData,
        isLoading: residentialsIdLoading } = useListResidentialsQuery()

    const { data: housesData,
        isLoading: housesIsLoading,
        refetch: refetchHouses,
        isFetching: housesIsFetching } = useListHousesQuery()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<UserCreateDto>();

    const residentialId = watch("residentialId")
    const isPrincipal = watch("isPrincipal")

    const submitForm = async (data: UserCreateDto) => {
        const createUserPromise = createUser(data).unwrap()

        toast.promise(
            createUserPromise.then(async (createdUser) => {
                await appendUserToResidential({
                    userId: createdUser.dataObject?.id || "",
                    residentialId: residentialId,
                    profileId: data.profileId,
                }).unwrap();

                await appendUserToHome({
                    homeId1: data.homeId,
                    userId: createdUser.dataObject?.id || "",
                    residentialId: residentialId,
                    profileId: data.profileId,
                }).unwrap();


                navigate(`/users`);
                return "Usuario creado";
            }),
            {
                loading: "Creando y asociando usuario...",
                success: (res) => res,
                error: "Error al crear usuario o asociar",
            }
        );
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
                enabled: true
            }).unwrap();
    
            // Refetch de las casas
            if (res?.dataObject) {
                // Setea el ID en el formulario antes de que los datos se actualicen en el estado
                setValue('homeId', res.dataObject.id);
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
            console.log("createdHouse", createdHouse);
            if (createdHouse) {
                setValue('homeId', createdHouse.id);
            }
        }
    }, [houses, watch("homeId")]);

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70 ">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%] max-h-[80svh] overflow-y-auto">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
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
                                // minLength: {
                                //     value: 6,
                                //     message: "La contraseña debe tener al menos 6 caracteres"
                                // }
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
                                <option value="" selected >-- Seleccione una --</option>
                                {residentials && residentials.map(residential => (
                                    <option key={residential.id} value={residential.id}>{residential.name}</option>
                                ))}
                            </select>
                            {errors.residentialId && <span className="form-error">{errors.residentialId.message}</span>}
                        </div>

                        <div className="input-container">
                            <div className="flex items-center justify-between">
                                <label htmlFor="homeId" className="label-form">Vivienda</label>
                                <button type="button" disabled={createHouseIsLoading} onClick={handleCreateFamilyHouse} className="text-sm disabled:text-gray-500 text-sky-500 hover:underline">
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
                                <option value="" selected >-- Seleccione una --</option>
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
