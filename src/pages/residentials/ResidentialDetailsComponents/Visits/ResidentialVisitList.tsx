import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
    visitServerApi,
    useHardDeleteVisitMutation,
    useListVisitsQuery,
    useListVisitsByResidentialQuery
} from "../../../../core/features/visitServerApi.ts";
import { updateCache, LazyUpdateModes } from "src/core/utils/lazyUpdateListByGuid";
import DeleteModal from "src/shared/components/DeleteModal";
import SkeletonTable from "src/shared/components/SkeletonTable";
import {useAppDispatch} from "../../../../core/store.ts";
import {VisitsDto} from "../../../../core/models/dtos/visits/visitsDto.ts";
import {ResidentialDto} from "../../../../core/models/dtos/residentials/ResidentialDto.ts";
import ResidentialUpdateDoorModal from "../Doors/ResidentialUpdateDoors.tsx";
import ResidentialCreateDoorsModal from "../Doors/ResidentialCreateDoorsModal.tsx";
import ResidentialUpdateVisitModal from "./ResidentialUpdateVisit.tsx";
import {DoorDto} from "../../../../core/models/dtos/doors/doorDto.ts";
import {doorServerApi} from "../../../../core/features/doorServerApi.ts";

interface ResidentialInformationProps {
    residential: ResidentialDto
}

const ResidentialVisitsList: React.FC<ResidentialInformationProps> = ({ residential }) => {

    const { id } = useParams<{id: string}>();
    const [visita, setVisita] = useState<VisitsDto>({
        id: "",
        homeId: "",
        userWhoCreatedId: "",
        typeOfVisitId: "",
        name: "",
        lastName: "",
        entries: 0,
        qrString: "",
        createdDate: new Date(),
        limitDate: new Date(),
    });
    const [visits, setVisits] = useState<VisitsDto[] | null>(null);
    const [softDeleteDoorsId, setSoftDeleteDoorsId] = useState<string>("")
    const [openUpdateDoorsModal, setOpenUpdateDoorsModal] = useState<boolean>(false)
    const [openCreateDoorsModal, setOpenCreateDoorsModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

    const { data: visitsData, error: visitsError, isLoading: visitsIsLoading, refetch: refetchVisits } = useListVisitsByResidentialQuery(residential?.id);
    const [hardDelete] = useHardDeleteVisitMutation();

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const handleDelete =  async (id: string) => {
        const softDeletePromise = softDelete(id).unwrap()

        toast.promise(softDeletePromise, {
            loading: "Eliminando...",
            success: () => {
                lazyDeleteDoor(id)
                toggleDeleteModal()
                return "Visita eliminada"
            },
            error: (err) => {
                console.error(err)
                return "Error al eliminar casa"
            }
        })
    }

    const toggleUpdateModal = (data : VisitsDto) => {
        setVisita(data);
        setOpenUpdateDoorsModal(!openUpdateDoorsModal);
        if(!openUpdateDoorsModal) {
            navigate(`visits/update/${data.id}`)
        } else {
            navigate(`/residentials/${id}/visits`)
        }
    }

    const toggleCreateModal = () => {
        setOpenCreateDoorsModal(!openCreateDoorsModal);
        console.log(openCreateDoorsModal);
        if(!openCreateDoorsModal) {
            navigate(`/residentials/${id}`)
        } else {
            navigate(`/residentials/${id}`)
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


    const lazyUpdateDoor = () => {
        // updateCache({
        //     api: houseServerApi,
        //     endpoint: 'listHouses',
        //     mode: LazyUpdateModes.UPDATE,
        //     dispatch,
        //     newItem,
        //     id
        // })
        refetchVisits()
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
        if (visitsData && !visitsIsLoading) {
            setVisits(visitsData.listDataObject || []);
        }
    }, [visitsData, visitsIsLoading]);

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
    }, [location])

    if (visitsIsLoading) return <SkeletonTable />
    // @ts-ignore
    return (
        <>
            <table className="table-auto w-full text-sm rounded-md flex-1">
                <thead className='border-b font-medium dark:border-neutral-500'>
                <tr>
                    <th>#</th>
                    <th className='text-left'>Nombre</th>
                    <th className='text-left'>Apellido</th>
                    <th className='text-left'>Entradas</th>
                    <th className='text-left'>Visita</th>
                    <th className='text-left'>Fecha de Creación</th>
                    <th className='text-left'>Fecha Límite</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {visits && visits.map((visit, i) => (
                <>
                    <tr key={visit.id} className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer">
                        <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.name}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.lastName}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.entries}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.home?.name}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{new Date(visit.createdDate).toLocaleString()}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{new Date(visit.limitDate).toLocaleString()}</td>
                        <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                            <FaEdit className='text-sky-500 hover:text-sky-400' onClick={() => toggleUpdateModal(visit)} />
                            <FaTrash className='text-red-500 hover:text-red-400' onClick={() => toggleDeleteModal(visit.id)} />
                        </td>
                    </tr>
                </>
                ))}
                </tbody>
            </table>


            {
                openUpdateDoorsModal
                &&
                <ResidentialUpdateVisitModal
                    toggleUpdateModal={toggleUpdateModal}
                    lazyUpdateDoor={lazyUpdateDoor}
                    visits={visita}/>
            }

            {openCreateDoorsModal &&
                <ResidentialCreateDoorsModal
                    toggleCreateModal={toggleCreateModal}
                    lazyAddDoor={lazyAddDoor}
                />
            }
            {openDeleteModal &&
                <DeleteModal
                    toggleDeleteModal={toggleDeleteModal}
                    softDeleteId={softDeleteVisitId}
                    deleteAction={handleDelete}
                />
            }
        </>
    );
}

export default ResidentialVisitsList;
