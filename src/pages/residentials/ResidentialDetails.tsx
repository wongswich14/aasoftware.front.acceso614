import React, { useEffect, useState } from "react";
import {FaEdit, FaPlusCircle, FaTrash} from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetResidentialQuery } from "src/core/features/residentialServerApi";
import { ResidentialDto } from "src/core/models/dtos/residentials/ResidentialDto";
import LoaderBig from "src/shared/components/LoaderBig";
import DeleteModal from "../../shared/components/DeleteModal.tsx";
import DoorsList from "../doors/DoorsList.tsx";
import {toast} from "sonner";
import AddHouseToResidentialModal from "../houses/AddHouseToResidentialModal.tsx";
import {useHardDeleteHouseMutation} from "../../core/features/houseServerApi.ts";
import UpdateHouseFromResidentialModal from "../houses/UpdateHouseFromResidentialModal.tsx";


interface ResidentialInformationProps {
    residential: ResidentialDto
}

const ResidentialDetails: React.FC = () => {
    const [residential, setResidential] = useState<ResidentialDto>();
    const [activeTab, setActiveTab] = useState<'informacion' | 'entradasSalidas'>('informacion');
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const { id } = useParams<{ id: string }>();
    const { data: residentialData, isFetching: residentialIsFetching } = useGetResidentialQuery(id!, { skip: !id });
    const location = useLocation();

    const toggleCreateModal = () => {
        setOpenCreateModal(!openCreateModal)
    }

    useEffect(() => {
        if (location.pathname.includes("doors")){
            setActiveTab("entradasSalidas")
        } else {
            setActiveTab("informacion")
        }
    }, [id, location]);

    useEffect(() => {
        if (residentialData && !residentialIsFetching) {
            setResidential(residentialData.dataObject);
        }
    }, [residentialData, residentialIsFetching]);

    if (residentialIsFetching) return <LoaderBig/>;

    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div
                className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>{residential?.name}</h2>

                <button onClick={toggleCreateModal} className='flex items-center text-sky-500 hover:text-sky-400 gap-1'>
                    <FaPlusCircle size={20} className='text-lg'/>
                    <span className="text-base">Agregar Vivienda</span>
                </button>
            </div>

            <div className='text-gray-500 font-semibold px-5 py-2 w-[95%] ml-5 mt-5 overflow-auto'>
                {/* Tabs */}
                <div className="flex gap-5 mb-7 text-sm">
                    <button
                        className={`px-4 py-1 text-white font-semibold rounded-md ${activeTab === 'informacion' ? 'bg-sky-400' : 'bg-gray-400 hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('informacion')}>
                        Viviendas
                    </button>

                    <button
                        className={`px-4 py-1 text-white font-semibold rounded-md ${activeTab === 'entradasSalidas' ? 'bg-sky-400' : 'bg-gray-400 hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('entradasSalidas')}>
                        Entradas - Salidas
                    </button>
                </div>

                {/* Contenido según el tab */}
                {activeTab === 'informacion' &&
                    <ResidentialInformation residential={residential!}/>
                }

                {activeTab === 'entradasSalidas' && (
                    <div>
                        <DoorsList residential={residential!}/>
                    </div>
                )}
            </div>

            {openCreateModal && <AddHouseToResidentialModal toggleModal={toggleCreateModal} />}
        </div>
    );
}

export default ResidentialDetails;

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