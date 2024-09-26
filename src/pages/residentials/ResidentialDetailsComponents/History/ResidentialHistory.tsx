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
import {useListLogDoorVisitsByResidentialQuery} from "../../../../core/features/logDoorsVisitServerApi.ts";

interface ResidentialInformationProps {
    residential: ResidentialDto
}

const ResidentialHistoryList: React.FC<ResidentialInformationProps> = ({ residential }) => {

    const { id } = useParams<{id: string}>();
    const [visits, setVisits] = useState<VisitsDto[] | null>(null);

    const { data: logDoorsVisitData, error: LogError, isLoading: logDoorsVisitIsLoading, refetch: refetchLog } = useListLogDoorVisitsByResidentialQuery(residential?.id);
    const [hardDelete] = useHardDeleteVisitMutation();

    const navigate = useNavigate();
    const location = useLocation();
    const dispa         tch = useAppDispatch();

    useEffect(() => {
        if (logDoorsVisitData && !logDoorsVisitIsLoading) {
            setVisits(logDoorsVisitData.listDataObject || []);
        }
    }, [logDoorsVisitData, logDoorsVisitIsLoading]);

    if (visitsIsLoading) return <SkeletonTable />

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

                    <th className='text-left'>S</th>
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

        </>
    );
}

export default ResidentialHistoryList;
