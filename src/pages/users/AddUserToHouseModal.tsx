import {IoClose} from "react-icons/io5";
import {UserCreateDto} from "../../core/models/dtos/users/userCreateDto.ts";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {houseServerApi, useGetHouseQuery} from "../../core/features/houseServerApi.ts";
import {useNavigate, useParams} from "react-router-dom";
import {HouseDto} from "../../core/models/dtos/houses/houseDto.ts";
import Switcher from "../../shared/components/Switcher.tsx";
import {ProfileDto} from "../../core/models/dtos/profiles/profileDto.ts";
import {useListProfilesQuery} from "../../core/features/profileServerApi.ts";
import LoaderBig from "../../shared/components/LoaderBig.tsx";
import {useCreateUserMutation} from "../../core/features/userServerApi.ts";
import {toast} from "sonner";

interface AddUserToHouseModalProps {
    toggleModal: () => void;
}

const AddUserToHouseModal: React.FC<AddUserToHouseModalProps> = ({toggleModal}) => {

    const [house, setHouse] = useState<HouseDto>()
    const [profiles, setProfiles] = useState<ProfileDto[]>()

    const {id} = useParams<{ id: string }>();
    const houseQueryInfo = houseServerApi.endpoints.getHouse.useQueryState(id!);
    const navigate = useNavigate();

    const [addUser] = useCreateUserMutation()

    const {
        data: houseData,
        isFetching: houseIsFetching,
    } = useGetHouseQuery(id!, {skip: id === "" || houseQueryInfo.isSuccess});

    const {
        data: profilesData,
        isFetching: profilesIsFetching,
    } = useListProfilesQuery();

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        watch
    } = useForm<UserCreateDto>();

    const isPrincipal = watch('isPrincipal');

    const submitForm = async (data: UserCreateDto) => {
        const addUserPromise = addUser(data).unwrap();

        toast.promise(addUserPromise, {
            loading: "Agregando habitante...",
            success: () => {
                navigate(-1)
                return "Habitante agregado";
            },
            error: (err) => {
                console.error(err);
                return "Error al agregar habitante";
            }
        })
    }

    /*
    Nos ahorramos hacer una peticion extra en caso de que ya este en cache,
    y si no lo esta se hace la peticion usando tkq
    */
    useEffect(() => {
        if (houseQueryInfo.isSuccess && houseQueryInfo.data) {
            setHouse(houseQueryInfo.data.dataObject);
        } else if (houseData && !houseIsFetching) {
            setHouse(houseData.dataObject);
        }
    }, [houseQueryInfo, houseData, houseIsFetching]);

    useEffect(() => {
        if (profilesData && !profilesIsFetching) {
            setProfiles(profilesData.listDataObject);
        }
    }, [profilesData, profilesIsFetching]);

    useEffect(() => {
        if (house) {
            setValue("homeId", house?.id);
            setValue("residentialId", house?.residential!.id);
        }
    }, [house]);

    if (profilesIsFetching || houseIsFetching) return <LoaderBig/>

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70 ">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%] max-h-[80svh] overflow-y-auto">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={() => toggleModal()}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">
                    Agregar habitante
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
                            <label htmlFor="profileId" className="label-form">Perfil</label>

                            <select
                                className="input-form"
                                id="profileId"
                                {...register("profileId", {
                                    required: "Este campo es obligatorio"
                                })}
                            >
                                <option value="" selected>-- Seleccione una --</option>
                                {profiles && profiles.map(profile => (
                                    <option value={profile.id}>{profile.title}</option>
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
                            onClick={() => toggleModal()}
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

export default AddUserToHouseModal;