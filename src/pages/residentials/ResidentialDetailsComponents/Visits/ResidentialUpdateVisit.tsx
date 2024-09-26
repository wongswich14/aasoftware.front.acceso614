import {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
    useGetDoorQuery,
    useListDoorsQuery,
    useListResidentialsDoorsQuery,
    useUpdateDoorMutation
} from "src/core/features/doorServerApi";
import {DoorDto} from "../../../../core/models/dtos/doors/doorDto.ts";
import {DoorUpdateDto} from "../../../../core/models/dtos/doors/doorUpdateDto.ts";
import {useGetVisitQuery, useUpdateVisitMutation} from "../../../../core/features/visitServerApi.ts";
import {VisitsDto} from "../../../../core/models/dtos/visits/visitsDto.ts";
import {createLogger} from "vite";
import {useCreateLogDoorVisitMutation} from "../../../../core/features/logDoorsVisitServerApi.ts";
import createDoorsModal from "../../../doors/CreateDoorsModal.tsx";
import {LogDoorVisitCreateDto} from "../../../../core/models/dtos/logDoorVisit/LogDoorVisitCreateDto.ts";
import {VisitsUpdateDto} from "../../../../core/models/dtos/visits/visitsUpdateDto.ts";
import {useListResidentialsQuery} from "../../../../core/features/residentialServerApi.ts"; // Make sure to import your door API

interface UpdateDoorModalProps {
    toggleUpdateModal: () => void;
    lazyUpdateDoor: (id: string, newItem: VisitsDto) => void; // Adjust the type as needed
    visits: VisitsDto
}

const ResidentialUpdateVisitModal: React.FC<UpdateDoorModalProps> = ({ toggleUpdateModal, visits }) => {

    const [visita, setVisita] = useState<VisitsUpdateDto>({
        id: visits?.id,
        homeId: visits?.home?.id,
        userWhoCreatedId: visits?.userWhoCreated?.id,
        typeOfVisitId: visits?.typeOfVisitId,
        name: visits?.name,
        lastName: visits?.lastName,
        entries: visits?.entries - 1,
        qrString: visits?.qrString,
        createdDate: new Date(visits.createdDate),
        limitDate: new Date(visits.limitDate),
    });
    const {id, visitId} = useParams<{ id: string, visitId: string }>();
    const [doors, setDoors] = useState<DoorDto[]>();
    const {data: visitData, isLoading: visitLoading} = useGetVisitQuery(visitId!, {skip: !visitId});
    const { data: doorsData, isLoading: doorsIsLoading } = useListResidentialsDoorsQuery(id!);
    const [updateVisit] = useUpdateVisitMutation();
    const [createLogDoorVisit] = useCreateLogDoorVisitMutation();
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}, reset, setValue} = useForm<LogDoorVisitCreateDto>();

    const submitForm = async (data) => {
        const updateVisitPromise = updateVisit(visita).unwrap();
        const createDoorPromise = createLogDoorVisit(data).unwrap();

        toast.promise(createDoorPromise, {
            loading: "Actualizando...",
            success: () => { // Adjust navigation if necessary

                return "Log creado";
            },
            error: (err) => {
                console.error(err);
                return "Error al actualizar";
            }
        });
        toast.promise(updateVisitPromise, {
            loading: "Actualizando...",
            success: () => { // Adjust navigation if necessary
                return "Visita actualizada";
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

        console.log(visits)

        if(visits){
            setVisita({
                id: visitId || "",
                homeId: visits.home?.id,
                userWhoCreatedId: visits.userWhoCreated?.id,
                typeOfVisitId: visits.typeOfVisitId,
                name: visits.name,
                lastName: visits.lastName,
                entries: visits.entries - 1,
                qrString: visits.qrString,
                createdDate: new Date(visits.createdDate),
                limitDate: new Date(visits.limitDate),
            });
        }

    }, []);

    useEffect(() => {
        if (doorsData && !doorsIsLoading) {
            setDoors(doorsData.listDataObject);
        }
    }, [doorsData, doorsIsLoading]);

    useEffect(() => {
        console.log(visitData);
        const date = new Date();

        if (!visitLoading && visitData) {
                                                    setValue("id", visitData.dataObject.id);
            setValue("visitId", visitId || "");
            setValue("securityGrantedAccessId",  );
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
