import { FaEdit, FaPlusCircle, FaTrash } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../core/store.ts";
import { toast } from "sonner";
import { LazyUpdateModes, updateCache } from "../../core/utils/lazyUpdateListByGuid.ts";
import SkeletonTable from "../../shared/components/SkeletonTable.tsx";
import {
    doorServerApi,
} from "../../core/features/doorServerApi.ts";
import UpdateDoorLogModal from "./UpdateDoorLogModal.tsx"; // Adjusted modal import
import DeleteModal from "../../shared/components/DeleteModal.tsx";
import {
    useListLogDoorVisitsQuery,
    useSoftDeleteLogDoorVisitMutation
} from "../../core/features/logDoorsVisitServerApi.ts";
import {LogDoorVisitDto} from "../../core/models/dtos/logDoorVisit/logDoorVisitDto.ts";

const LogDoorList: React.FC = () => {
    const [doorLogs, setDoorLogs] = useState<LogDoorVisitDto[] | null>(null); // Changed to DoorLogDto
    const [softDeleteDoorLogId, setSoftDeleteDoorLogId] = useState<string>("");
    const [openUpdateDoorLogModal, setOpenUpdateDoorLogModal] = useState<boolean>(false);
    const [openCreateDoorLogsModal, setOpenCreateDoorLogsModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const { id } = useParams<{ id: string }>();

        const { data: doorLogsData, error: doorLogsError, isLoading: doorLogsIsLoading, refetch: refetchDoorLogs } = useListLogDoorVisitsQuery(); // Changed to use Door Logs Query
    const [softDelete] = useSoftDeleteLogDoorVisitMutation(); // Changed to Soft Delete Door Log

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const handleDelete = async (id: string) => {
        const softDeletePromise = softDelete(id).unwrap();

        toast.promise(softDeletePromise, {
            loading: "Eliminando...",
            success: () => {
                lazyDeleteDoorLog(id);
                toggleDeleteModal();
                return "Log de puerta eliminado";
            },
            error: (err) => {
                console.error(err);
                return "Error al eliminar log de puerta";
            }
        });
    };

    const toggleUpdateModal = (idModal?: string) => {
        setOpenUpdateDoorLogModal(!openUpdateDoorLogModal);
        if (!openUpdateDoorLogModal) {
            navigate(`/logVisits/update/${idModal}`); // Changed to door-logs route
        } else {
            navigate(`/doors/${id}`);
        }
    };

    const toggleCreateModal = () => {
        setOpenCreateDoorLogsModal(!openCreateDoorLogsModal);
        navigate(`/logVisits`);
    };

    const toggleDeleteModal = (id?: string) => {
        if (id) {
            setSoftDeleteDoorLogId(id);
        } else {
            setSoftDeleteDoorLogId("");
        }
        setOpenDeleteModal(!openDeleteModal);
    };

    const lazyUpdateDoorLog = (id: string, newItem: LogDoorVisitDto                 ) => {
        refetchDoorLogs(); // Call to refetch the list
    };

    const lazyDeleteDoorLog = (id: string) => {
        updateCache({
            api: doorServerApi,
            endpoint: 'listDoorLogs', // Changed to Door Logs endpoint
            mode: LazyUpdateModes.DELETE,
            dispatch,
            id
        });
    };

    const lazyAddDoorLog = (newItem: LogDoorVisitDto) => {
        updateCache({
            api: doorServerApi,
            endpoint: 'listDoorLogs', // Changed to Door Logs endpoint
            mode: LazyUpdateModes.ADD,
            dispatch,
            newItem
        });
    };

    useEffect(() => {
        if (doorLogsData && !doorLogsIsLoading) {
            setDoorLogs(doorLogsData.listDataObject || []);
        }
    }, [doorLogsData, doorLogsIsLoading]);

    useEffect(() => {
        setOpenUpdateDoorLogModal(location.pathname.includes("update"));
        setOpenCreateDoorLogsModal(location.pathname.includes("create"));
    }, [id, location]);

    if (doorLogsIsLoading) return <SkeletonTable />;

    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>Listado de Logs de Puertas</h2>
                <Link to={'create'} className='flex items-center text-sky-500 hover:text-sky-400 gap-1'>
                    <FaPlusCircle className='text-lg' />
                    <span className="text-base">Nuevo</span>
                </Link>
            </div>
            <div className='text-gray-500 font-semibold p-5 w-[95%] ml-5 mt-5 overflow-auto'>
                <table className="table-auto w-full text-sm rounded-md flex-1">
                    <thead className='border-b font-medium dark:border-neutral-500'>
                    <tr>
                        <th>#</th>
                        <th className='text-left'>Nombre</th>
                        <th className="text-left">Fecha</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        // doorLogs && doorLogs.map((log, i) => (
                        //     <tr key={log.id} className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer">
                        //         <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                        //         <td className='whitespace-nowrap py-4 font-normal text-left'>{`${log.name}`}</td>
                        //         <td className='whitespace-nowrap py-4 font-normal text-left'>{log.date || "N/A"}</td>
                        //         <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                        //             <FaEdit className='text-sky-500 hover:text-sky-400' onClick={() => toggleUpdateModal(log.id)} />
                        //             <FaTrash className='text-red-500 hover:text-red-400' onClick={() => toggleDeleteModal(log.id)} />
                        //         </td>
                        //     </tr>
                        // ))
                    }
                    </tbody>
                </table>
            </div>

            {/*{openUpdateDoorLogModal &&*/}
            {/*    <UpdateDoorLogModal*/}
            {/*        toggleUpdateModal={toggleUpdateModal}*/}
            {/*        lazyUpdateDoorLog={lazyUpdateDoorLog} // Updated method*/}
            {/*    />*/}
            {/*}*/}

            {/*{openCreateDoorLogsModal &&*/}
            {/*    <CreateDoorLogsModal*/}
            {/*        toggleCreateModal={toggleCreateModal}*/}
            {/*        lazyAddDoorLog={lazyAddDoorLog} // Updated method*/}
            {/*    />*/}
            {/*}*/}

            {openDeleteModal &&
                <DeleteModal
                    toggleDeleteModal={toggleDeleteModal}
                    softDeleteId={softDeleteDoorLogId}
                    deleteAction={handleDelete}
                />
            }
        </div>
    );
}

export default LogDoorList;
