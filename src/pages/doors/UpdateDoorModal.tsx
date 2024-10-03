    import { useEffect, useState } from "react";
    import { useForm } from "react-hook-form";
    import { IoClose } from "react-icons/io5";
    import { useNavigate, useParams } from "react-router-dom";
    import { toast } from "sonner";
    import { useGetDoorQuery, useUpdateDoorMutation } from "src/core/features/doorServerApi"; // Make sure to import your door API
    import { useListResidentialsQuery } from "src/core/features/residentialServerApi";
    import LoaderBig from "src/shared/components/LoaderBig";
    import {ResidentialDto} from "../../core/models/dtos/residentials/ResidentialDto.ts";
    import {DoorUpdateDto} from "../../core/models/dtos/doors/doorUpdateDto.ts";

    interface UpdateDoorModalProps {
        toggleUpdateModal: () => void;
    }

    const UpdateDoorModal: React.FC<UpdateDoorModalProps> = ({ toggleUpdateModal }) => {

        const [residentials, setResidentials] = useState<ResidentialDto[]>();
        const { id, doorsId } = useParams<{ id: string, doorsId:string }>();

        const { data: residentialsData, isLoading: residentialsIsLoading } = useListResidentialsQuery();
        const { data: doorData, isLoading: doorLoading } = useGetDoorQuery(id!, { skip: !id });
        const [updateDoor] = useUpdateDoorMutation();

        const navigate = useNavigate();

        const { register, handleSubmit, formState: { errors }, setValue } = useForm<DoorUpdateDto>();

        const submitForm = async (data: DoorUpdateDto) => {
            const updateDoorPromise = updateDoor(data).unwrap();

            toast.promise(updateDoorPromise, {
                loading: "Actualizando...",
                success: () => {
                    navigate(`/doors`); // Adjust navigation if necessary
                    return "Puerta actualizada";
                },
                error: (err) => {
                    console.error(err);
                    return "Error al actualizar";
                }
            });
        };

        useEffect(() => {
            setValue("id", id?.toString() || "");
        }, []);

        useEffect(() => {
            console.log(doorData);

            if (!doorLoading && doorData) {
                setValue("id", doorData?.dataObject?.id || "");
                setValue("name", doorData?.dataObject?.name || "");
                setValue("residentialId", doorData?.dataObject?.residential?.id || ""); // If applicable
                // Set other fields as necessary
            }
        }, [doorLoading, doorData]);

        useEffect(() => {
            if (residentialsData && !residentialsIsLoading) {
                setResidentials(residentialsData.listDataObject);
            }
        }, [residentialsData, residentialsIsLoading]);

        if (residentialsIsLoading || doorLoading) return <LoaderBig message="Cargando datos..." />;

        return (
            <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70">
                <section className="bg-white rounded-lg p-10 relative min-w-[55%] overflow-y-auto max-h-[80svh]">
                    <IoClose
                        size={25}
                        className="absolute top-5 right-5 cursor-pointer"
                        onClick={toggleUpdateModal}
                    />
                    <h3 className="p-2 text-lg text-gray-500 font-semibold">Editar Puerta</h3>

                    <section className="grid grid-cols-1 md:grid-cols-1 md:gap-5">

                        <div className="input-container">
                            <label htmlFor="name" className="label-form">Nombre</label>
                            <input
                                type="text"
                                id="name"
                                className="input-form"
                                {...register('name', {required: 'Este campo es obligatorio'})}
                            />
                            {errors.name && <span className="form-error">{errors.name.message}</span>}
                        </div>

                    </section>

                    <section className="input-container">
                        <label htmlFor="residentialId" className="label-form">Residencial</label>
                        <select
                            id="residentialId"
                            className="input-form"
                            {...register('residentialId', {required: 'Este campo es obligatorio'})}
                        >
                            <option value="">-- Seleccione una opción --</option>
                            {residentials && residentials.map(residential => (
                                <option key={residential.id} value={residential.id}>{residential.name}</option>
                            ))}
                        </select>
                        {errors.residentialId && <span className="form-error">{errors.residentialId.message}</span>}
                    </section>

                    <form className="flex flex-col mt-5 text-gray-700 text-base" onSubmit={handleSubmit(submitForm)}>
                        {/* Add your input fields here */}
                        <div className="flex justify-end gap-5">
                            <button type="submit" className="submit-button">Guardar</button>
                            <button type="button" onClick={toggleUpdateModal} className="cancel-button">Cancelar
                            </button>
                        </div>
                    </form>
                </section>
            </article>
        );
    };

    export default UpdateDoorModal;
