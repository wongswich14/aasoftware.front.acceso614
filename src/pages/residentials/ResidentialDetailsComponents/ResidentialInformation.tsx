import React, {useState} from "react";
import {
    useConfirmPaymentMutation,
    useDisableHouseMutation,
    useEnableHouseMutation,
    useHardDeleteHouseMutation
} from "../../../core/features/houseServerApi.ts";
import {toast} from "sonner";
import {Link} from "react-router-dom";
import {FaEdit, FaTrash} from "react-icons/fa";
import DeleteModal from "../../../shared/components/DeleteModal.tsx";
import UpdateHouseFromResidentialModal from "../../houses/UpdateHouseFromResidentialModal.tsx";
import {ResidentialDto} from "../../../core/models/dtos/residentials/ResidentialDto.ts";
import {MdBlock} from "react-icons/md";
import {IoIosCheckmarkCircle} from "react-icons/io";
import Tooltip from "../../../shared/components/Tooltip.tsx";
import { format } from "date-fns"
import {es} from "date-fns/locale";
import {BsCash} from "react-icons/bs";

interface ResidentialInformationProps {
    residential: ResidentialDto
}

const ResidentialInformation: React.FC<ResidentialInformationProps> = ({residential}) => {

    const [deleteId, setDeleteId] = useState<string>("")
    const [updatedId, setUpdatedId] = useState<string>("")
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const [hardDelete] = useHardDeleteHouseMutation()
    const [disableHouse] = useDisableHouseMutation()
    const [enableHouse] = useEnableHouseMutation()
    const [confirmPayment] = useConfirmPaymentMutation()

    const toggleDeleteModal = (id?: string) => {
        if (id) {
            setDeleteId(id)
        } else {
            setDeleteId("")
        }
        setOpenDeleteModal(!openDeleteModal)
    }

    const toggleUpdateModal = (id?: string) => {
        if (id) {
            setUpdatedId(id)
        } else {
            setUpdatedId("")
        }
        setOpenUpdateModal(!openUpdateModal)
    }

    const handleDisableHome = (id: string) => {
        const disableHousePromise = disableHouse(id).unwrap()

        toast.promise(disableHousePromise, {
            loading: "Desabilitando hogar...",
            success: "Casa desabilitada",
            error: "Error al desabilitar"
        })
    }

    const handleEnableHome = (id: string) => {
        const enableHousePromise = enableHouse(id).unwrap()

        toast.promise(enableHousePromise, {
            loading: "Habilitando hogar....",
            success: "Casa habilitada",
            error: "Error al habilitar"
        })
    }

    const handleConfirmPayment = (id: string) => {
        const confirmPaymentPromise = confirmPayment(id).unwrap()

        toast.promise(confirmPaymentPromise, {
            loading: "Confirmando pago...",
            success: "Pago confirmado",
            error: "Error al confirmar pago"
        })
    }

    const handleDelete = async (id: string) => {
        const hardDeletePromise = hardDelete(id).unwrap()
        toast.promise(hardDeletePromise, {
            loading: 'Eliminando vivienda...',
            success: () => {
                toggleDeleteModal()
                return 'Vivienda eliminada'
            },
            error: (err) => {
                console.error(err)
                return 'Error al eliminar vivienda'
            }
        })
    }

    return (
        <>
            <table className="table-auto w-full text-sm rounded-md flex-1">
                <thead className='border-b font-medium dark:border-neutral-500'>
                <tr>
                    <th>#</th>
                    <th className='text-left'>Nombre</th>
                    <th className='text-left'>Calle</th>
                    <th className='text-left'>Número</th>
                    <th className='text-left'>Contacto</th>
                    <th className='text-left'>Código Postal</th>
                    <th className='text-left'>Fecha de pago</th>
                    <th className='text-left'>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {residential?.homes.map((house, i) => (
                    <tr key={house.id}
                        className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer">
                        <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>
                            <Link type="button" to={`/houses/${house.id}`} className="hover:underline">
                                {house.name}
                            </Link>
                        </td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{house.street}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{house.number}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{house.phoneContact}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{house.zip}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{format(new Date(house.lastPayDate), "yyyy-MM-dd", {locale: es})}</td>
                        <td className={`whitespace-nowrap py-4 font-normal text-left ${!house.enabled && "text-red-500 font-medium"}`}>{house.enabled ? "En regla" : "Morosa"}</td>
                        <td className='flex gap-6 items-center justify-center ml-5 py-4'>

                            <Tooltip title={"Confirmar pago"}>
                                <BsCash
                                    className={"text-emerald-500 hover:text-emerald-400"}
                                    size={18}
                                    onClick={() => handleConfirmPayment(house.id)}
                                />
                            </Tooltip>

                            {house.enabled ?
                                (
                                    <Tooltip title={"Desabilitar"}>
                                        <MdBlock className="text-amber-500
                                         hover:text-amber-400" size={18}
                                                 onClick={() => handleDisableHome(house.id)}
                                        />
                                    </Tooltip>
                                ) :
                                (
                                    <Tooltip title={"Habilitar"}>
                                        <IoIosCheckmarkCircle className="text-emerald-500 hover:text-emerald-400"
                                                              size={18}
                                                              onClick={() => handleEnableHome(house.id)}
                                        />
                                    </Tooltip>
                                )}
                            <FaEdit className='text-sky-500 hover:text-sky-400'
                                    onClick={() => toggleUpdateModal(house.id)}/>
                            <FaTrash className='text-red-500 hover:text-red-400'
                                     onClick={() => toggleDeleteModal(house.id)}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {openDeleteModal &&
                <DeleteModal
                    toggleDeleteModal={toggleDeleteModal}
                    softDeleteId={deleteId}
                    deleteAction={handleDelete}/>
            }

            {openUpdateModal && <UpdateHouseFromResidentialModal toggleModal={toggleUpdateModal} houseId={updatedId}/>}
        </>
    );
}

export default ResidentialInformation;