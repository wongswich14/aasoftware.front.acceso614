import { useEffect  } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import {useNavigate, useParams} from "react-router-dom";
import { toast } from "sonner";
import { useCreateDoorMutation } from "src/core/features/doorServerApi";
import { DoorCreateDto } from "src/core/models/dtos/doors/doorCreateDto";

interface CreateDoorsModalProps {
    toggleCreateModal: () => void;
}

const ResidentialCreateDoorsModal: React.FC<CreateDoorsModalProps> = ({ toggleCreateModal }) => {
    const { id } = useParams<{ id: string }>();
    const [createDoor] = useCreateDoorMutation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<DoorCreateDto>();

    const submitForm = async (data: DoorCreateDto) => {
        const createDoorPromise = createDoor(data).unwrap();

        toast.promise(createDoorPromise, {
            loading: "Creando...",
            success: () => {
                //lazyAddDoor(data);
                navigate(`/residentials/${id}/doors`);
                return "Puerta creada";
            },
            error: (err) => {
                console.error(err);
                return "Error al crear";
            }
        });
    };

    useEffect(() => {
        setValue("residentialId", id!);
    }, []);

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%] overflow-y-auto max-h-[80svh]">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={toggleCreateModal}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">Crear Puerta</h3>

                <form className="flex flex-col mt-5 text-gray-700 text-base" onSubmit={handleSubmit(submitForm)}>

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


                    <div className="flex justify-end gap-5">
                        <button type="submit" className="submit-button">Guardar</button>
                        <button type="button" onClick={toggleCreateModal} className="cancel-button">Cancelar</button>
                    </div>
                </form>
            </section>b
        </article>
    );
};

export default ResidentialCreateDoorsModal;
