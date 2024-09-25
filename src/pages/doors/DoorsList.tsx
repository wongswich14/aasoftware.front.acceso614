import {FaEdit, FaPlusCircle, FaTrash} from "react-icons/fa";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {HouseDto} from "../../core/models/dtos/houses/houseDto.ts";
import {useAppDispatch} from "../../core/store.ts";
import {toast} from "sonner";
import {LazyUpdateModes, updateCache} from "../../core/utils/lazyUpdateListByGuid.ts";
import SkeletonTable from "../../shared/components/SkeletonTable.tsx";
import {
    doorServerApi,
    useListDoorsQuery,
    useSoftDeleteDoorMutation
} from "../../core/features/doorServerApi.ts";
import {DoorDto} from "../../core/models/dtos/doors/doorDto.ts";
import UpdateDoorModal from "./UpdateDoorModal.tsx";
import CreateDoorsModal from "./CreateDoorsModal.tsx";
import DeleteModal from "../../shared/components/DeleteModal.tsx";

const DoorsList: React.FC = () => {


    const [doors, setDoors] = useState<HouseDto[] | null>(null)
    const [softDeleteDoorsId, setSoftDeleteDoorsId] = useState<string>("")
    const [openUpdateDoorsModal, setOpenUpdateDoorsModal] = useState<boolean>(false)
    const [openCreateDoorsModal, setOpenCreateDoorsModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

    const { data: doorsData, error: doorsError, isLoading: doorsIsLoading, refetch: refetchDoors } = useListDoorsQuery()
    const [softDelete] = useSoftDeleteDoorMutation()


    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{id: string}>()
    const dispatch = useAppDispatch()

    const handleDelete =  async (id: string) => {
        const softDeletePromise = softDelete(id).unwrap()

        toast.promise(softDeletePromise, {
            loading: "Eliminando...",
            success: () => {
                lazyDeleteDoor(id)
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
        setOpenUpdateDoorsModal(!openUpdateDoorsModal);
        if(id) {
            navigate(`/doors/update/${id}`)
        } else {
            navigate(`/doors`)
        }
    }

    const toggleCreateModal = (id?: string) => {
        setOpenCreateDoorsModal(!openCreateDoorsModal);
        console.log(openCreateDoorsModal);
        if(id) {
            navigate(`/doors`)
        } else {
            navigate(`/doors`)
        }
    }

    const toggleDeleteModal = (id?: string) => {
        if (id) {
              setSoftDeleteDoorsId(id)
        } else {
            setSoftDeleteDoorsId("")
        }
        setOpenDeleteModal(!openDeleteModal)
    }

    const lazyUpdateDoor = (id: string, newItem: DoorDto) => {
        // updateCache({
        //     api: houseServerApi,
        //     endpoint: 'listHouses',
        //     mode: LazyUpdateModes.UPDATE,
        //     dispatch,
        //     newItem,
        //     id
        // })
        refetchDoors()
    }

    const lazyDeleteDoor = (id: string) => {
        updateCache({
            api: doorServerApi,
            endpoint: 'listHouses',
            mode: LazyUpdateModes.DELETE,
            dispatch,
            id
        })
    }

    const lazyAddDoor = (newItem: DoorDto) => {
        updateCache({
            api: doorServerApi,
            endpoint: 'listHouses',
            mode: LazyUpdateModes.ADD,
            dispatch,
            newItem
        })
    }

    useEffect(() => {
        if (doorsData && !doorsIsLoading) {
            setDoors(doorsData.listDataObject || [])
        }
    }, [doorsData, doorsIsLoading])

    useEffect(() => {
        if (id) {
            setOpenUpdateDoorsModal(true)
        } else {
            setOpenUpdateDoorsModal(false)
        }

        if (location.pathname.includes("create")) {
            setOpenCreateDoorsModal(true)
        } else {
            setOpenCreateDoorsModal(false)
        }
    }, [id, location])

    if (doorsIsLoading) return <SkeletonTable />


    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>Listado de Puertas</h2>
                <Link to={'create'} className='flex items-center text-sky-500 hover:text-sky-400 gap-1'>
                    <FaPlusCircle className='text-lg' />
                    <span className="text-base">Nueva</span>
                </Link>
            </div>
            <div className='text-gray-500 font-semibold borde p-5 w-[95%] ml-5 mt-5 oerflow-auto'>
                <table className="table-auto w-full text-sm rounded-md flex-1">
                    <thead className='border-b font-medium dark:border-neutral-500'>
                    <tr>
                        <th>#</th>
                        <th className='text-left'>Nombre</th>
                        <th className="text-left">Residencial</th>
                        {/* <th className="text-left">Casa</th> */}
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        doors && doors.map((user, i) => (
                            <tr key={user.id} className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer">
                                <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{`${user.name}`}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{user.residential?.name || "N/A"}</td>
                                {/* <td className='whitespace-nowrap py-4 font-normal text-left'>{user.home?.id || "N/A" }</td> */}
                                <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                                    <FaEdit className='text-sky-500 hover:text-sky-400' onClick={() => toggleUpdateModal(user.id)} />
                                    <FaTrash className='text-red-500 hover:text-red-400' onClick={() => toggleDeleteModal(user.id)} />
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>

                    {openUpdateDoorsModal &&
                        <UpdateDoorModal
                            toggleUpdateModal={toggleUpdateModal}
                            lazyUpdateDoor={lazyUpdateDoor}
                        />
                    }

                    {openCreateDoorsModal &&
                        <CreateDoorsModal
                            toggleCreateModal={toggleCreateModal}
                            lazyAddDoor={lazyAddDoor}
                        />
                    }

                    {openDeleteModal &&
                        <DeleteModal
                            toggleDeleteModal={toggleDeleteModal}
                            softDeleteId={softDeleteDoorsId}
                            deleteAction={handleDelete}
                        />
                    }
        </div>
    );

}

export default DoorsList;