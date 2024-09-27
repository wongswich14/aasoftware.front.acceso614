import { useState, useEffect } from "react";
import SkeletonTable from "src/shared/components/SkeletonTable";
import {ResidentialDto} from "../../../../core/models/dtos/residentials/ResidentialDto.ts";
import {useListLogDoorVisitsByResidentialQuery} from "../../../../core/features/logDoorsVisitServerApi.ts";
import {LogDoorVisitDto} from "../../../../core/models/dtos/logDoorVisit/logDoorVisitDto.ts";


interface ResidentialInformationProps {
    residential: ResidentialDto
}

        const ResidentialHistoryList: React.FC<ResidentialInformationProps> = ({ residential }) => {

    const [visits, setVisits] = useState<LogDoorVisitDto[] | null>(null);

    const { data: logDoorsVisitData, isLoading: logDoorsVisitIsLoading } = useListLogDoorVisitsByResidentialQuery( residential.id!, {skip: !residential.id});

    useEffect(() => {

        console.log(logDoorsVisitData);
        if (logDoorsVisitData && !logDoorsVisitIsLoading) {
            setVisits(logDoorsVisitData.listDataObject || []);
        }
    }, [logDoorsVisitData, logDoorsVisitIsLoading]);

    if (logDoorsVisitIsLoading) return <SkeletonTable />

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
                    <th className='text-left'>Hora</th>
                </tr>
                </thead>
                <tbody>
                {visits && visits.map((visit, i) => (
                    <>
                        <tr key={visit.id}
                            className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer">
                            <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                            <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.visit?.name}</td>
                            <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.visit?.lastName}</td>
                            <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.door?.name || "N/A"}</td>
                            <td className='whitespace-nowrap py-4 font-normal text-left'>{ visit.securityGrantedAccess ? visit.securityGrantedAccess?.name + ' ' + visit.securityGrantedAccess?.lastName : "N/A" }</td>
                            <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.visit?.home.name}</td>
                            <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.accessDate}</td>
                            <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.accessHour}</td>
                        </tr>
                    </>
                ))}
                </tbody>
            </table>

        </>
    );
        }

export default ResidentialHistoryList;
