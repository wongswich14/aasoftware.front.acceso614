import { useState, useEffect } from "react";
import { FaEdit, FaPlusCircle, FaTrash } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSoftDeleteResidentialMutation, residentialServerApi, useListResidentialsQuery } from "src/core/features/residentialServerApi";
import { ResidentialDto } from "src/core/models/dtos/residentials/ResidentialDto";
import { ResidentialUpdateDto } from "src/core/models/dtos/residentials/ResidentialUpdateDto";
import { useAppDispatch } from "src/core/store";
import { updateCache, LazyUpdateModes } from "src/core/utils/lazyUpdateListByGuid";
import DeleteModal from "src/shared/components/DeleteModal";
import SkeletonTable from "src/shared/components/SkeletonTable";
import CreateResidentialModal from "./CreateResidentialModal";
import UpdateResidentialModal from "./UpdateResidentialModal";

const ResidentialsList: React.FC = () => {

    const [residentials, setResidentials] = useState<ResidentialDto[] | null>(null)
    const [softDeleteResidentialId, setSoftDeleteResidentialId] = useState<string>("")
    const [openUpdateResidentialModal, setOpenUpdateResidentialModal] = useState<boolean>(false)
    const [openCreateResidentialModal, setOpenCreateResidentialModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

    const { data: residentialsData, error: residentialsError, isLoading: residentialsIsLoading, refetch: refetchResidentials } = useListResidentialsQuery()
    const [softDelete, { data: softDeleteData, status: softDeleteStatus, isLoading: softDeleteIsLoading }] = useSoftDeleteResidentialMutation()

    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{id: string}>()
    const dispatch = useAppDispatch()

    const handleDelete =  async (id: string) => {
        const softDeletePromise = softDelete(id).unwrap()

        toast.promise(softDeletePromise, {
            loading: "Eliminando...",
            success: () => {
                lazyDeleteResidential(id)
                toggleDeleteModal()
                return "Usuario eliminado"
            },
            error: (err) => {
                console.error(err)
                return "Error al eliminar usuario"
            }
        })
    }

    const toggleUpdateModal = (id?: string) => {
        setOpenUpdateResidentialModal(!openUpdateResidentialModal)
        if(id) {
            navigate(`/residentials/update/${id}`)
        } else {
            navigate(`/residentials`)
        }
    }

    const toggleCreateModal = (id?: string) => {
        setOpenCreateResidentialModal(!openCreateResidentialModal)
        if(id) {
            navigate(`/residentials/create`)
        } else {
            navigate(`/residentials`)
        }
    }

    const toggleDeleteModal = (id?: string) => {
        if (id) {
            setSoftDeleteResidentialId(id)
        } else {
            setSoftDeleteResidentialId("")
        }
        setOpenDeleteModal(!openDeleteModal)
    }

    const lazyUpdateResidential = (id: string, newItem: ResidentialUpdateDto) => {
        updateCache({
            api: residentialServerApi,
            endpoint: 'listResidentials',
            mode: LazyUpdateModes.UPDATE,
            dispatch,
            newItem,
            id
        })
    }

    const lazyDeleteResidential = (id: string) => {
        updateCache({
            api: residentialServerApi,
            endpoint: 'listResidentials',
            mode: LazyUpdateModes.DELETE,
            dispatch,
            id
        })
    }

    const lazyAddResidential = (newItem: ResidentialDto) => {
        updateCache({
            api: residentialServerApi,
            endpoint: 'listResidentials',
            mode: LazyUpdateModes.ADD,
            dispatch,
            newItem
        })
    }

    useEffect(() => {
        if (residentialsData && !residentialsIsLoading) {
            setResidentials(residentialsData.listDataObject || [])
        }
    }, [residentialsData, residentialsIsLoading])

    useEffect(() => {
        if (id) {
            setOpenUpdateResidentialModal(true)
        } else {
            setOpenUpdateResidentialModal(false)
        }
            
        if (location.pathname.includes("create")) {
            setOpenCreateResidentialModal(true)   
        } else {
            setOpenCreateResidentialModal(false)
        }
    }, [id, location])

    if (residentialsIsLoading) return <SkeletonTable />

    return (
        <div className='w-full bg-white min-h-full rounded-md'>
        <div className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
            <h2 className='p-2 text-lg'>Listado de Residenciales</h2>
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
                        <th className='text-left'>Nombre</th>
                        <th className='text-left'>Descripción</th>
                        {/* <th className='text-left'>Correo</th> */}

                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        residentials && residentials.map((residential, i) => (

                            < tr key={residential.id} className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer" >
                                <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{residential.name}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{residential.description}</td>
                                {/* <td className='whitespace-nowrap py-4 font-normal text-left'>{residential.email}</td> */}
                                <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                                    <FaEdit className='text-sky-500 hover:text-sky-400' onClick={() => toggleUpdateModal(residential.id)} />
                                    <FaTrash className='text-red-500 hover:text-red-400' onClick={() => toggleDeleteModal(residential.id)} />
                                </td>
                            </tr>
                        ))

                    }
                </tbody>
            </table>
        </div>

        {openUpdateResidentialModal && 
            <UpdateResidentialModal 
                toggleUpdateModal={toggleUpdateModal}
                lazyUpdateResidential={lazyUpdateResidential}
            />
        }

        {openCreateResidentialModal && 
            <CreateResidentialModal 
                toggleCreateModal={toggleCreateModal}
                lazyAddResidential={lazyAddResidential}
            />
        }

        {openDeleteModal && 
            <DeleteModal 
                toggleDeleteModal={toggleDeleteModal}
                softDeleteId={softDeleteResidentialId}
                deleteAction={handleDelete}
            />
        }
    </div >
    );
}

export default ResidentialsList;