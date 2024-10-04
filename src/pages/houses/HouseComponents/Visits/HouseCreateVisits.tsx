import {useParams} from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IoClose } from "react-icons/io5";
import React, {useEffect, useState} from "react";
import {CreateVisitDto} from "../../../../core/models/dtos/visits/CreateVisitDto.ts";
import {useCreateVisitMutation} from "../../../../core/features/visitServerApi.ts";
import {useListTypeOfVisitsQuery} from "../../../../core/features/typeOfVisitServerApi.ts";
import LoaderBig from "../../../../shared/components/LoaderBig.tsx";
import {TypeOfVisitDto} from "../../../../core/models/dtos/typeOfVisit/typeOfVisitDto.ts";
import Switcher from "../../../../shared/components/Switcher.tsx";

interface CreateResidentialModalProps {
    toggleCreateModal: () => void;
}

const HouseCreateVisits: React.FC<CreateResidentialModalProps> = ({ toggleCreateModal }) => {

    const [typeVisits, setTypeOfVisits] = useState<TypeOfVisitDto[]>()
    const [selectedType, setSelectedType] = useState<TypeOfVisitDto>()

    const {id} = useParams<{ id: string }>();

    const { data: typeOfVisitsData, isLoading: typeOfVisitsIsLoading } = useListTypeOfVisitsQuery();

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<CreateVisitDto>();

    const typeOfVisit = watch("typeOfVisitId")
    const isFavorite = watch("isFavorite")

    const [createResidential, { isLoading }] = useCreateVisitMutation();

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
        setValue("homeId", id!);
        setValue("typeOfVisitId", "7071CBB5-9B41-4994-95F2-EAF5173D7215");
    }, []);

    useEffect(() => {
        if (typeOfVisitsData && !typeOfVisitsIsLoading)
            setTypeOfVisits(typeOfVisitsData.listDataObject)
    }, [typeOfVisitsData, typeOfVisitsIsLoading]);

    useEffect(() => {
        setSelectedType(typeVisits?.find(tv => tv.id === typeOfVisit))
    }, [typeOfVisit]);

    if (typeOfVisitsIsLoading) return <LoaderBig />

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%] max-h-[80svh] overflow-y-auto">
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
                    <div className="input-container">
                        <label htmlFor="name" className="label-form">Tipo de visita</label>
                        <select id="typeVisit"
                                className="input-form" {...register("typeOfVisitId", {required: "Este campo es obligatorio"})}>
                            <option value="">-- Elige una opción --</option>
                            {typeVisits && typeVisits.map(tv => (
                                <option key={tv.id} value={tv.id}>
                                    {tv.name}
                                </option>
                            ))}
                        </select>
                        {errors.typeOfVisitId && <span className="form-error">{errors.typeOfVisitId.message}</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    </div>


                    {selectedType?.isVehicle && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="input-container">
                                <label htmlFor="lastName" className="label-form">Color del vehículo</label>
                                <input
                                    type="text"
                                    id="vehicleColor"
                                    className="input-form"
                                    {...register("vehicleColor", {
                                        required: "Este campo es obligatorio"
                                    })}
                                />
                                {errors.vehicleColor &&
                                    <span className="form-error">{errors.vehicleColor.message}</span>}
                            </div>

                            <div className="input-container">
                                <label htmlFor="lastName" className="label-form">Placas</label>
                                <input
                                    type="text"
                                    id="vehiclePlate"
                                    className="input-form"
                                    {...register("vehiclePlate", {
                                        required: "Este campo es obligatorio"
                                    })}
                                />
                                {errors.vehiclePlate &&
                                    <span className="form-error">{errors.vehiclePlate.message}</span>}
                            </div>
                        </div>)}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                        <div className="input-container">
                            <label htmlFor="limitDate" className="label-form">Fecha de vencimiento</label>
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
                    </div>


                    <div className="input-container">
                        <label htmlFor="isFavorite" className="label-form">Favorito</label>
                        <Switcher
                            isChecked={isFavorite}
                            onChange={() => setValue('isFavorite', !isFavorite)}
                        />
                        {errors.isFavorite && <span className="form-error">{errors.isFavorite.message}</span>}
                    </div>

                    <div className="input-container">
                        <label htmlFor="lastName" className="label-form">Información adicional</label>
                        <textarea
                            rows={2}
                            id="aditionalInfo"
                            className="input-form"
                            {...register("aditionalInfo")}
                        />
                        {errors.aditionalInfo &&
                            <span className="form-error">{errors.aditionalInfo.message}</span>}
                    </div>

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
