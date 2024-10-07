import {useNavigate, useParams} from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IoClose } from "react-icons/io5";
import React, {useEffect, useState} from "react";
import {CreateVisitDto} from "../../../../core/models/dtos/visits/CreateVisitDto.ts";
import {useSelector} from "react-redux";
import {selectUserData} from "../../../../core/slices/auth/authSlice.ts";
import {useCreateVisitMutation} from "../../../../core/features/visitServerApi.ts";
import {useListDataForVisitQuery} from "../../../../core/features/dataVisitServerApi.ts";
import {DoorDto} from "../../../../core/models/dtos/doors/doorDto.ts";

interface CreateResidentialModalProps {
    toggleCreateModal: () => void;
}

const HouseCreateVisits: React.FC<CreateResidentialModalProps> = ({ toggleCreateModal }) => {
    const [createResidential, { isLoading }] = useCreateVisitMutation();

    const {id} = useParams<{ id: string }>();
    const [data, setData] = useState<DoorDto[]>();
    const {data: visitData, isLoading: visitLoading} = useListDataForVisitQuery();
    const userData = useSelector(selectUserData);
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateVisitDto>();

    useEffect(() => {
        setValue("homeId", id!);
        setValue("userWhoCreatedId", userData!.id!);
        setValue("typeOfVisitId", "7071CBB5-9B41-4994-95F2-EAF5173D7215");
    }, []);

    const submitForm = async (data: CreateVisitDto) => {
        const createResidentialPromise = createResidential(data).unwrap();

        toast.promise(createResidentialPromise, {
            loading: "Creando...",
            success: () => {
                toggleCreateModal();
                return "Residencial creada";
            },
            error: (err) => {
                console.error(err);
                return "Error al crear residencial";
            }
        });
    };

    useEffect(() => {
        if (visitData && !visitLoading) {
            setData(visitData!.dataObject!.typeOfVisits!);
        }
    }, [visitData, visitLoading]);

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%]">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={toggleCreateModal}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">Generar Visita</h3>

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
                                type="text"
                                id="lastName"
                                className="input-form"
                                {...register("lastName", {
                                    required: "Este campo es obligatorio"
                                })}
                            />
                            {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
                        </div>
                    </section>

                    <div className="input-container">
                        <label htmlFor="entries" className="label-form">Cantidad de accesos</label>
                        <input
                            type="number"
                            id="entries"
                            className="input-form"
                            {...register("entries", {
                                valueAsNumber: true
                            })}
                        />
                    </div>

                    <section className="input-container">
                        <label htmlFor="typeOfVisitId" className="label-form">Tipo de Visita</label>
                        <select
                            id="typeOfVisitId"
                            className="input-form"
                            {...register('typeOfVisitId', {required: 'Este campo es obligatorio'})}
                        >
                            <option value="">-- Seleccione una opción --</option>
                            {data && data.map(door => (
                                <option key={door.id} value={door.id}>{door.name}</option>
                            ))}
                        </select>
                        {errors.typeOfVisitId && <span className="form-error">{errors.typeOfVisitId.message}</span>}
                    </section>


                    <section className="grid grid-cols-1 md:grid-cols-2 md:gap-5">

                        <div className="input-container">
                            <label htmlFor="entries" className="label-form">Entradas</label>
                            <input
                                type="number"
                                id="entries"
                                className="input-form"
                                {...register("entries", {
                                    valueAsNumber: true
                                })}
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="limitDate" className="label-form">Fecha Límite</label>
                            <input
                                type="date"
                                id="limitDate"
                                className="input-form"
                                {...register("limitDate", {
                                    required: "Este campo es obligatorio"
                                })}
                            />
                            {errors.limitDate && <span className="form-error">{errors.limitDate.message}</span>}
                        </div>
                    </section>

                    <div className="flex justify-end gap-5">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isLoading} // Deshabilitar botón mientras se carga
                        >
                            Guardar
                        </button>

                        <button
                            type="button"
                            onClick={toggleCreateModal}
                            className="cancel-button"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </section>
        </article>
    );
};

export default HouseCreateVisits;
