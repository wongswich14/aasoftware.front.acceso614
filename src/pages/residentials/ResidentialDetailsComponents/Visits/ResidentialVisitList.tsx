import {useState, useEffect} from "react";
import {FaEdit} from "react-icons/fa";
import {useLocation, useNavigate, useParams} from "react-router-dom";

import {
    useListVisitsByResidentialQuery
} from "../../../../core/features/visitServerApi.ts";
import {updateCache, LazyUpdateModes} from "src/core/utils/lazyUpdateListByGuid";
import SkeletonTable from "src/shared/components/SkeletonTable";
import {useAppDispatch} from "../../../../core/store.ts";
import {VisitsDto} from "../../../../core/models/dtos/visits/visitsDto.ts";
import {ResidentialDto} from "../../../../core/models/dtos/residentials/ResidentialDto.ts";
import ResidentialCreateDoorsModal from "../Doors/ResidentialCreateDoorsModal.tsx";
import ResidentialUpdateVisitModal from "./ResidentialUpdateVisit.tsx";
import {DoorDto} from "../../../../core/models/dtos/doors/doorDto.ts";
import {doorServerApi} from "../../../../core/features/doorServerApi.ts";
import {VisitsUpdateDto} from "../../../../core/models/dtos/visits/visitsUpdateDto.ts";

interface ResidentialInformationProps {
    residential: ResidentialDto
}

const ResidentialVisitsList: React.FC<ResidentialInformationProps> = () => {

    const {id} = useParams<{ id: string }>();
    const [visita, setVisita] = useState<VisitsUpdateDto>({
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
    const [openUpdateDoorsModal, setOpenUpdateDoorsModal] = useState<boolean>(false)
    const [openCreateDoorsModal, setOpenCreateDoorsModal] = useState<boolean>(false)

    const {
        data: visitsData,
        isLoading: visitsIsLoading,
        refetch: refetchVisits
    } = useListVisitsByResidentialQuery(id!, {skip: !id});

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();


    const toggleUpdateModal = (data: VisitsUpdateDto | void) => {
        if (data) {
            setVisita(data);
        }
        setOpenUpdateDoorsModal(!openUpdateDoorsModal);
        if (!openUpdateDoorsModal) {
            navigate(`visits/update/${data?.id}`)
        } else {
            navigate(`/residentials/${id}/visits`)
        }
        refetchVisits()
    }

    const toggleCreateModal = () => {
        setOpenCreateDoorsModal(!openCreateDoorsModal);
        console.log(openCreateDoorsModal);
        if (!openCreateDoorsModal) {
            navigate(`/residentials/${id}`)
        } else {
            navigate(`/residentials/${id}`)
        }
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
        if (location.pathname.includes("update")) {
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

    if (visitsIsLoading) return <SkeletonTable/>

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
                    <tr key={visit.id}
                        className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer">
                        <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.name}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.lastName}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.entries}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.home?.name}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{new Date(visit.createdDate).toLocaleString()}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{new Date(visit.limitDate).toLocaleString()}</td>
                        <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                            <FaEdit className='text-sky-500 hover:text-sky-400' onClick={() => toggleUpdateModal({
                                id: visit.id,
                                homeId: visit.home?.id,
                                userWhoCreatedId: visit.userWhoCreated?.id,
                                typeOfVisitId: visit.typeOfVisitId,
                                name: visit.name,
                                lastName: visit.lastName,
                                entries: visit.entries,
                                qrString: visit.qrString,
                                createdDate: new Date(visit.createdDate),
                                limitDate: new Date(visit.limitDate),
                            })}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>


            {
                openUpdateDoorsModal
                &&
                <ResidentialUpdateVisitModal
                    toggleUpdateModal={toggleUpdateModal}
                    lazyUpdateDoor={lazyUpdateDoor}
                    visita={visita}/>
            }

            {openCreateDoorsModal &&
                <ResidentialCreateDoorsModal
                    toggleCreateModal={toggleCreateModal}
                />
            }

        </>
    );
}

export default ResidentialVisitsList;
