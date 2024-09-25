import {IoClose} from "react-icons/io5";
import {RfidCreateDto} from "../../core/models/dtos/rfids/rfidCreateDto.ts";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {houseServerApi, useGetHouseQuery} from "../../core/features/houseServerApi.ts";
import {HouseDto} from "../../core/models/dtos/houses/houseDto.ts";
import {useSelector} from "react-redux";
import {selectUserData} from "../../core/slices/auth/authSlice.ts";
import {useCreateRfidMutation} from "../../core/features/rfidServerApi.ts";
import {toast} from "sonner";

interface AddRfidToHouseModalProps {
    toggleModal: () => void;
}

const AddRfidToHouseModal: React.FC<AddRfidToHouseModalProps> = ({toggleModal}) => {

    const [house, setHouse] = useState<HouseDto>()

    const {id} = useParams<{ id: string }>();
    const houseQueryInfo = houseServerApi.endpoints.getHouse.useQueryState(id!);
    const navigate = useNavigate();
    const userData = useSelector(selectUserData);

    const [addRfid] = useCreateRfidMutation()

    const {
        data: houseData,
        isFetching: houseIsFetching,
    } = useGetHouseQuery(id!, {skip: id === "" || houseQueryInfo.isSuccess});

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        watch
    } = useForm<RfidCreateDto>();

    const submitForm = async (data: RfidCreateDto) => {
        const addRfidPromise = addRfid(data).unwrap();

        toast.promise(addRfidPromise, {
            loading: "Agregando...",
            success: () => {
                navigate(-1)
                return "RFID agregado";
            },
            error: (err) => {
                console.error(err);
                return "Error al agregar RFID";
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
        if (house) {
            setValue("homeId", house.id)
            setValue("userCreatedId", userData!.id)
        }
    }, [house]);

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70">
            <section className="bg-white rounded-lg p-10 relative min-w-[55%] max-h-[80svh] overflow-y-auto">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={() => toggleModal()}
                />
                <h3 className="p-2 text-lg text-gray-500 font-semibold">
                    Agregar RFID
                </h3>

                <form
                    className="flex flex-col mt-5 text-gray-700 text-base"
                    onSubmit={handleSubmit(submitForm)}
                >
                    <div className="input-container">
                        <label htmlFor="folio" className="label-form">Folio</label>
                        <input
                            type="text"
                            id="folio"
                            className="input-form"
                            {...register("folio", {
                                required: "Este campo es obligatorio"
                            })}
                        />
                        {errors.folio && <span className="form-error">{errors.folio.message}</span>}
                    </div>

                    <div className="input-container">
                        <label htmlFor="comments" className="label-form">Comentarios</label>
                        <textarea
                            id="comments"
                            className="input-form"
                            {...register("comments", {
                                required: "Este campo es obligatorio"
                            })}
                        />
                        {errors.comments && <span className="form-error">{errors.comments.message}</span>}
                    </div>

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

export default AddRfidToHouseModal