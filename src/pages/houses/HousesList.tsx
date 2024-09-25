import { useState, useEffect } from "react";
import { FaEdit, FaPlusCircle, FaTrash } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useHardDeleteHouseMutation, useListHousesQuery } from "src/core/features/houseServerApi";
import { HouseDto } from "src/core/models/dtos/houses/houseDto";
import DeleteModal from "src/shared/components/DeleteModal";
import SkeletonTable from "src/shared/components/SkeletonTable";
import { useSoftDeleteHouseMutation } from "src/core/features/houseServerApi";
import CreateHouseModal from "./CreateHouseModal";
import UpdateHouseModal from "./UpdateHouseModal";

const HousesList: React.FC = () => {

    const [houses, setHouses] = useState<HouseDto[] | null>(null)
    const [softDeleteHouseId, setSoftDeleteHouseId] = useState<string>("")
    const [openUpdateHouseModal, setOpenUpdateHouseModal] = useState<boolean>(false)
    const [openCreateHouseModal, setOpenCreateHouseModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

    const { data: housesData, isLoading: housesIsLoading } = useListHousesQuery()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [softDelete] = useSoftDeleteHouseMutation()
    const [hardDelete] = useHardDeleteHouseMutation()


    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{id: string}>()

    const handleDelete =  async (id: string) => {
        const softDeletePromise = hardDelete(id).unwrap()

        toast.promise(softDeletePromise, {
            loading: "Eliminando...",
            success: () => {
                toggleDeleteModal()
                return "Casa eliminada"
            },
            error: (err) => {
                console.error(err)
                return "Error al eliminar casa"
            }
        })
    }

    const toggleUpdateModal = (id?: string) => {
        setOpenUpdateHouseModal(!openUpdateHouseModal)
        if(id) {
            navigate(`/houses/update/${id}`)
        } else {
            navigate(`/houses`)
        }
    }

    const toggleCreateModal = (id?: string) => {
        setOpenCreateHouseModal(!openCreateHouseModal)
        if(id) {
            navigate(`/houses/create`)
        } else {
            navigate(`/houses`)
        }
    }

    const toggleDeleteModal = (id?: string) => {
        if (id) {
            setSoftDeleteHouseId(id)
        } else {
            setSoftDeleteHouseId("")
        }
        setOpenDeleteModal(!openDeleteModal)
    }

    useEffect(() => {
        if (housesData && !housesIsLoading) {
            setHouses(housesData.listDataObject || [])
        }
    }, [housesData, housesIsLoading])

    useEffect(() => {
        if (id) {
            setOpenUpdateHouseModal(true)
        } else {
            setOpenUpdateHouseModal(false)
        }
            
        if (location.pathname.includes("create")) {
            setOpenCreateHouseModal(true)   
        } else {
            setOpenCreateHouseModal(false)
        }
    }, [id, location])

    if (housesIsLoading) return <SkeletonTable />

    return (
        <div className='w-full bg-white min-h-full rounded-md'>
        <div className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
            <h2 className='p-2 text-lg'>Listado de Viviendas</h2>
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
                        <th className='text-left'>Alias</th>
                        <th className='text-left'>Residencial</th>
                        <th className='text-left'>Calle</th>
                        <th className='text-left'>N. Casa</th>
                        <th className="text-left">Contacto</th>
                        {/* <th className='text-left'>Correo</th> */}

                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        houses && houses.map((house, i) => (

                            < tr key={house.id} className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer" >
                                <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{house.name}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{house.residential?.name}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{house.street}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{house.number}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{house.phoneContact}</td>
                                <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                                    <FaEdit className='text-sky-500 hover:text-sky-400' onClick={() => toggleUpdateModal(house.id)} />
                                    <FaTrash className='text-red-500 hover:text-red-400' onClick={() => toggleDeleteModal(house.id)} />
                                </td>
                            </tr>
                        ))

                    }
                </tbody>
            </table>
        </div>

        {openUpdateHouseModal &&
            <UpdateHouseModal
                toggleUpdateModal={toggleUpdateModal}
            />
        }

        {openCreateHouseModal && 
            <CreateHouseModal 
                toggleCreateModal={toggleCreateModal}
            />
        }

        {openDeleteModal && 
            <DeleteModal 
                toggleDeleteModal={toggleDeleteModal}
                softDeleteId={softDeleteHouseId}
                deleteAction={handleDelete}
            />
        }
    </div >
    );
}

export default HousesList;
