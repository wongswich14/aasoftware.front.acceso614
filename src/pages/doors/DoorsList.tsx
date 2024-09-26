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
    useListResidentialsDoorsQuery,
    useSoftDeleteDoorMutation
} from "../../core/features/doorServerApi.ts";
import {DoorDto} from "../../core/models/dtos/doors/doorDto.ts";
import UpdateDoorModal from "./UpdateDoorModal.tsx";
import CreateDoorsModal from "./CreateDoorsModal.tsx";
import DeleteModal from "../../shared/components/DeleteModal.tsx";
import {ResidentialDto} from "../../core/models/dtos/residentials/ResidentialDto.ts";

interface ResidentialInformationProps {
    residential: ResidentialDto
}

const DoorsList: React.FC<ResidentialInformationProps> = ( {residential} ) => {

    const { id } = useParams<{id: string}>()
    const [doors, setDoors] = useState<HouseDto[] | null>(null)
    const [softDeleteDoorsId, setSoftDeleteDoorsId] = useState<string>("")
    const [openUpdateDoorsModal, setOpenUpdateDoorsModal] = useState<boolean>(false)
    const [openCreateDoorsModal, setOpenCreateDoorsModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

    const { data: doorsData, error: doorsError, isLoading: doorsIsLoading, refetch: refetchDoors } = useListResidentialsDoorsQuery(id);
    const [softDelete] = useSoftDeleteDoorMutation()


    const navigate = useNavigate()
    const location = useLocation()
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

    const toggleUpdateModal = (doorId?: string) => {
        setOpenUpdateDoorsModal(!openUpdateDoorsModal);
        if(!openUpdateDoorsModal) {
            navigate(`/residentials/details/${id}/doors/update/${doorId}`)
        } else {
            navigate(`/residentials/details/${id}`)
        }
    }

    const toggleCreateModal = () => {
        setOpenCreateDoorsModal(!openCreateDoorsModal);
        console.log(openCreateDoorsModal);
        if(!openCreateDoorsModal) {
            navigate(`/residentials/details/${id}`)
        } else {
            navigate(`/residentials/details/${id}`)
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
        if (location.pathname.includes("update")){
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
        <>
                <table className="table-auto w-full text-sm rounded-md flex-1">
                    <thead className='border-b font-medium dark:border-neutral-500'>
                    <tr>
                        <th>#</th>
                        <th className='text-left'>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        doors && doors.map((user, i) => (
                            <tr  key={user.id} className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer">
                                <td className='text-center whitespace-nowrap py-4 font-normal hover:underline' onClick={ () => navigate(`/doors/${user.id}`) }>{i + 1}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left hover:underline' onClick={ () => navigate(`/doors/${user.id}`) }>{`${user.name}`}</td>
                                <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                                    <FaEdit className='text-sky-500 hover:text-sky-400' onClick={() => toggleUpdateModal(user.id)} />
                                    <FaTrash className='text-red-500 hover:text-red-400' onClick={() => toggleDeleteModal(user.id)} />
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>

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
        </>
    );

}

export default DoorsList;