import { useEffect, useState } from "react";
import { FaEdit, FaPlusCircle, FaTrash } from "react-icons/fa";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import { useListRfidsQuery } from "src/core/features/rfidServerApi";
import { RfidDto } from "src/core/models/dtos/rfids/rfidDto";
import DeleteModal from "src/shared/components/DeleteModal";
import SkeletonTable from "src/shared/components/SkeletonTable";
import UpdateRfidModal from "./UpdateRfidModal";
import CreateRfidModal from "./CreateRfidModal";

const RfidList = () => {

    const [rfid, setRfid] = useState<RfidDto[]>()
    const [softDeleteRfidId, setSoftDeleteRfidId] = useState<string>("")
    const [openUpdateRfidModal, setOpenUpdateRfidModal] = useState<boolean>(false)
    const [openCreateRfidModal, setOpenCreateRfidModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const location = useLocation();

    const { data: rfidData, isFetching: rfidIsFetching } = useListRfidsQuery()
    
    const toggleUpdateModal = (id?: string) => {
        setOpenUpdateRfidModal(!openUpdateRfidModal)
        if (id) {
            navigate(`/rfid/update/${id}`)
        } else {
            navigate(`/rfid`)
        }
    }

    const toggleCreateModal = (id?: string) => {
        setOpenCreateRfidModal(!openCreateRfidModal)
        if (id) {
            navigate(`/rfid/create`)
        } else {
            navigate(`/rfid`)
        }
    }

    const toggleDeleteModal = (id?: string) => {
        if (id) {
            setSoftDeleteRfidId(id)
        } else {
            setSoftDeleteRfidId("")
        }
        setOpenDeleteModal(!openDeleteModal)
    }

    const handleDelete = async (id: string) => {

    }

    useEffect(() => {
        if (id) {
            setOpenUpdateRfidModal(true)
        } else {
            setOpenUpdateRfidModal(false)
        }
            
       setOpenCreateRfidModal(location.pathname.includes("create"))
    }, [id, location])

    useEffect(() => {
        if (rfidData && !rfidIsFetching) {
            setRfid(rfidData.listDataObject)
        }
    }, [rfidData, rfidIsFetching])

    if (rfidIsFetching) return <SkeletonTable />

    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>Listado de Tarjetas RFID</h2>
                <Link to={'create'} className='flex items-center text-sky-500 hover:text-sky-400 gap-1'>
                    <FaPlusCircle className='text-lg' />
                    <span className="text-base">Nuevo</span>
                </Link>
            </div>
            <div className='text-gray-500 font-semibold borde p-5 w-[95%] ml-5 mt-5 oerflow-auto'>
                <table className="table-auto w-full text-sm rounded-md flex-1">
                    <thead className='border-b font-medium dark:border-neutral-500'>
                        <tr>
                            <th>#</th>
                            <th className='text-left'>Folio</th>
                            <th className='text-left'>Casa</th>
                            <th className='text-left'>Creado por</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rfid && rfid.map((item, i) => (

                                < tr key={item.id} className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer" >
                                    <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                                    <td className='whitespace-nowrap py-4 font-normal text-left'>{item.folio}</td>
                                    <td className='whitespace-nowrap py-4 font-normal text-left'>{item.home?.name}</td>
                                    <td className='whitespace-nowrap py-4 font-normal text-left'>{`${item.userCreatedBy?.name} ${item.userCreatedBy?.lastName}`}</td>
                                    <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                                        <FaEdit className='text-sky-500 hover:text-sky-400' onClick={() => toggleUpdateModal(item.id)} />
                                        <FaTrash className='text-red-500 hover:text-red-400' onClick={() => toggleDeleteModal(item.id)} />
                                    </td>
                                </tr>
                            ))

                        }
                    </tbody>
                </table>
            </div>

            {openUpdateRfidModal && 
                <UpdateRfidModal
                    toggleModal={toggleUpdateModal}
                />
            }

            {openCreateRfidModal && 
                <CreateRfidModal 
                    toggleModal={toggleCreateModal}
                />
            }

            {openDeleteModal && 
                <DeleteModal 
                    toggleDeleteModal={toggleDeleteModal}
                    softDeleteId={softDeleteRfidId}
                    deleteAction={handleDelete}
                />
            }
        </div >
    );
}

export default RfidList