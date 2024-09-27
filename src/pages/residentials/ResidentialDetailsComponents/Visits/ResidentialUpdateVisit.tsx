import {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
    useListResidentialsDoorsQuery,
} from "src/core/features/doorServerApi";
import {DoorDto} from "../../../../core/models/dtos/doors/doorDto.ts";
import {useGetVisitQuery, useUpdateVisitMutation} from "../../../../core/features/visitServerApi.ts";
import {VisitsDto} from "../../../../core/models/dtos/visits/visitsDto.ts";

import {useCreateLogDoorVisitMutation} from "../../../../core/features/logDoorsVisitServerApi.ts";
import {LogDoorVisitCreateDto} from "../../../../core/models/dtos/logDoorVisit/LogDoorVisitCreateDto.ts";
import {VisitsUpdateDto} from "../../../../core/models/dtos/visits/visitsUpdateDto.ts";
import {useSelector} from "react-redux";
import {selectUserData} from "../../../../core/slices/auth/authSlice.ts";

interface UpdateDoorModalProps {
    toggleUpdateModal: () => void;
    lazyUpdateDoor: (id: string, newItem: VisitsDto) => void; // Adjust the type as needed
    visita: VisitsUpdateDto
}

const ResidentialUpdateVisitModal: React.FC<UpdateDoorModalProps> = ({ toggleUpdateModal, visita }) => {

    const {id, visitId} = useParams<{ id: string, visitId: string }>();
    const [doors, setDoors] = useState<DoorDto[]>();
    const {data: visitData, isLoading: visitLoading} = useGetVisitQuery(visitId!, {skip: !visitId});
    const { data: doorsData, isLoading: doorsIsLoading } = useListResidentialsDoorsQuery(id!);
    const [updateVisit] = useUpdateVisitMutation();
    const [createLogDoorVisit] = useCreateLogDoorVisitMutation();
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}, setValue} = useForm<LogDoorVisitCreateDto>();
    const userData = useSelector(selectUserData);
    const submitForm = async (data : LogDoorVisitCreateDto) => {
        const updateVisitPromise = updateVisit(visita).unwrap();
        const createDoorPromise = createLogDoorVisit(data).unwrap();

        toast.promise(updateVisitPromise, {
            loading: "Actualizando...",
            success: () => { // Adjust navigation if necessary

                toast.promise(createDoorPromise, {
                    loading: "Actualizando...",
                    success: () => { // Adjust navigation if necessary
                        navigate(`visits`);
                        return "Log creado";
                    },
                    error: (err) => {
                        console.error(err);
                        return "Error al actualizar";
                    }
                });

                return "Visita actualizada"
            },
            error: (err) => {
                console.error(err);
                return "Error al actualizar";
            }
        });
    };

    useEffect(() => {
        setValue("id", visitId?.toString() || "");
        setValue("residentialId", id?.toString() || "");

    }, []);

    useEffect(() => {
        if (doorsData && !doorsIsLoading) {
            setDoors(doorsData.listDataObject);
        }
    }, [doorsData, doorsIsLoading]);

    useEffect(() => {
        console.log(visitData);

        if (!visitLoading && visitData) {
            setValue("id", visitData.dataObject!.id!);
            setValue("visitId", visitId!);
            setValue("securityGrantedAccessId", userData!.id!);
            // Set other fields as necessary
        }
    }, [visitLoading, visitData]);

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%] overflow-y-auto max-h-[80svh]">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={toggleUpdateModal}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">Registrar Visita</h3>

                <form className="flex flex-col mt-5 text-gray-700 text-base" onSubmit={handleSubmit(submitForm)}>           

                    <section className="input-container">
                        <label htmlFor="doorsId" className="label-form">Residencial</label>
                        <select
                            id="doorsId"
                            className="input-form"
                            {...register('doorsId', {required: 'Este campo es obligatorio'})}
                        >
                            <option value="">-- Seleccione una opción --</option>
                            {doors && doors.map(door => (
                                <option key={door.id} value={door.id}>{door.name}</option>
                            ))}
                        </select>
                        {errors.residentialId && <span className="form-error">{errors.residentialId.message}</span>}
                    </section>

                    <div className="flex justify-end gap-5 mt-5">
                        <button type="submit" className="submit-button">Guardar</button>
                        <button type="button" onClick={toggleUpdateModal} className="cancel-button">Cancelar</button>
                    </div>
                </form>
            </section>
        </article>
    );
}

export default ResidentialUpdateVisitModal;
