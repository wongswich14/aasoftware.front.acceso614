import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useGetDoorQuery, useUpdateDoorMutation } from "src/core/features/doorServerApi";
import {DoorDto} from "../../../../core/models/dtos/doors/doorDto.ts";
import {DoorUpdateDto} from "../../../../core/models/dtos/doors/doorUpdateDto.ts"; // Make sure to import your door API

interface UpdateDoorModalProps {
    toggleUpdateModal: () => void;
    lazyUpdateDoor: (id: string, newItem: DoorDto) => void; // Adjust the type as needed
}

const ResidentialUpdateDoorModal: React.FC<UpdateDoorModalProps> = ({ toggleUpdateModal, lazyUpdateDoor }) => {

    const { id, doorId } = useParams<{ id: string, doorId:string }>();
    const { data: doorData, isLoading: doorLoading } = useGetDoorQuery(doorId!, { skip: !doorId });
    const [updateDoor] = useUpdateDoorMutation();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<DoorUpdateDto>();

    const submitForm = async (data: DoorUpdateDto) => {
        const updateDoorPromise = updateDoor(data).unwrap();

        toast.promise(updateDoorPromise, {
            loading: "Actualizando...",
            success: () => {
                lazyUpdateDoor(doorId!, data); // Call lazyUpdateDoor here
                navigate(`doors`); // Adjust navigation if necessary
                return "Puerta actualizada";
            },
            error: (err) => {
                console.error(err);
                return "Error al actualizar";
            }
        });
    };

    useEffect(() => {
        setValue("id", doorId?.toString() || "");
        setValue("residentialId", id?.toString() || "");
    }, []);

    useEffect(() => {
        console.log(doorData)

        if (!doorLoading && doorData) {
            setValue("id", doorData?.dataObject?.id || "");
            setValue("name", doorData?.dataObject?.name|| "");
            setValue("residentialId", doorData?.dataObject?.residential?.id || ""); // If applicable
            // Set other fields as necessary
        }
    }, [doorLoading, doorData]);

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

export default ResidentialUpdateDoorModal;
