import {useState, useEffect} from "react";
import SkeletonTable from "src/shared/components/SkeletonTable";
import {useListLogDoorVisitsByResidentialQuery} from "../../../../core/features/logDoorsVisitServerApi.ts";
import {LogDoorVisitDto} from "../../../../core/models/dtos/logDoorVisit/logDoorVisitDto.ts";
import {useParams} from "react-router-dom";
import {formatRelative} from "date-fns";
import { es } from 'date-fns/locale'

const ResidentialHistoryList: React.FC = () => {

    const [visits, setVisits] = useState<LogDoorVisitDto[]>();
    const [page, setPage] = useState<number>(1)

    // Id de la residencial
    const { id } = useParams<string>()

    const {
        data: logDoorsVisitData,
        isFetching: logDoorsVisitIsLoading,
    } = useListLogDoorVisitsByResidentialQuery({ id: id!, page: page }, {skip: !id, refetchOnMountOrArgChange: true});

    const handlePreviousPage = () => {
        setPage(prev => prev - 1)
    }

    const handleNextPage = () => {
        setPage(prev => prev + 1)
    }

    useEffect(() => {
        if (logDoorsVisitData && !logDoorsVisitIsLoading) {
            setVisits(logDoorsVisitData.listDataObject || []);
        }
    }, [logDoorsVisitData, logDoorsVisitIsLoading]);

    if (logDoorsVisitIsLoading) return <SkeletonTable/>

    return (
        <>
            <table className="table-auto w-full text-sm rounded-md flex-1">
                <thead className='border-b font-medium dark:border-neutral-500'>
                <tr>
                    <th>#</th>
                    <th className='text-left'>Nombre</th>
                    <th className='text-left'>Apellido</th>
                    <th className='text-left'>Acceso</th>
                    <th className='text-left'>Vigilante</th>
                    <th className='text-left'>Visita</th>
                    <th className='text-left'>Día</th>
                </tr>
                </thead>
                <tbody>
                {visits && visits.map((visit, i) => (

                        <tr key={visit.id}
                            className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer">
                            <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                            <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.visit?.name}</td>
                            <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.visit?.lastName}</td>
                            <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.door?.name || "N/A"}</td>
                            <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.securityGrantedAccess ? visit.securityGrantedAccess?.name + ' ' + visit.securityGrantedAccess?.lastName : "N/A"}</td>
                            <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.visit?.home.name}</td>
                            <td className='whitespace-nowrap py-4 font-normal text-left'>{formatRelative(new Date(visit.accessDate), new Date(), {locale: es})}</td>
                        </tr>
                ))}
                </tbody>
            </table>

            <div className="flex justify-center mt-10 gap-5">
                <button
                    type={"button"}
                    disabled={page === 1} onClick={handlePreviousPage}
                    className={"bg-gray-400 rounded-md text-white font-medium disabled:bg-gray-300 px-4 py-1 text-sm disabled:cursor-not-allowed"}
                >
                    Anterior
                </button>

                <button
                    type={"button"}
                    onClick={handleNextPage}
                    disabled={!visits || visits.length < 10}
                    className={"bg-gray-400 rounded-md text-white font-medium disabled:bg-gray-300 px-4 py-1 text-sm disabled:cursor-not-allowed"}
                >
                    Siguiente
                </button>
            </div>
        </>
    );
}

export default ResidentialHistoryList;
