import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useHardDeleteHouseMutation} from "../../../core/features/houseServerApi.ts";
import {toast} from "sonner";
import {FaEdit, FaTrash} from "react-icons/fa";
import DeleteModal from "../../../shared/components/DeleteModal.tsx";
import UpdateHouseFromResidentialModal from "../../houses/UpdateHouseFromResidentialModal.tsx";
import {ResidentialDto} from "../../../core/models/dtos/residentials/ResidentialDto.ts";


interface ResidentialInformationProps {
    residential: ResidentialDto
}
const ResidentialInformation: React.FC<ResidentialInformationProps> = ({residential}) => {

    const [deleteId, setDeleteId] = useState<string>("")
    const [updatedId, setUpdatedId] = useState<string>("")
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const navigate = useNavigate();

    const [hardDelete] = useHardDeleteHouseMutation()

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
                        <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                            <FaEdit className='text-sky-500 hover:text-sky-400' onClick={() => toggleUpdateModal(house.id)} />
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

            {openUpdateModal && <UpdateHouseFromResidentialModal toggleModal={toggleUpdateModal} houseId={updatedId} />}
        </>
    );
}

export default ResidentialInformation;