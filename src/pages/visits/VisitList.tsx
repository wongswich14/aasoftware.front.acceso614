import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import {useParams} from "react-router-dom";
import { toast } from "sonner";
import {
    visitServerApi,
    useHardDeleteVisitMutation,
    useListVisitsByResidentialQuery
} from "src/core/features/visitServerApi";
import { VisitsDto } from "src/core/models/dtos/visits/visitsDto";
import { useAppDispatch } from "src/core/store";
import { updateCache, LazyUpdateModes } from "src/core/utils/lazyUpdateListByGuid";
import DeleteModal from "src/shared/components/DeleteModal";
import SkeletonTable from "src/shared/components/SkeletonTable";

const VisitsList: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [visits, setVisits] = useState<VisitsDto[] | null>(null);
    const [softDeleteVisitId, setSoftDeleteVisitId] = useState<string>("");
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const { data: visitsData, isLoading: visitsIsLoading } = useListVisitsByResidentialQuery(id!, { skip: !id });
    const [hardDelete] = useHardDeleteVisitMutation();

    const dispatch = useAppDispatch();
    console.log(visitsData);
    const handleDelete = async (id: string) => {
        const hardDeletePromise = hardDelete(id).unwrap();

        toast.promise(hardDeletePromise, {
            loading: "Eliminando...",
            success: () => {
                lazyDeleteVisit(id);
                toggleDeleteModal();
                return "Visita eliminada";
            },
            error: () => "Error al eliminar visita",
        });
    };

    const toggleDeleteModal = (id?: string) => {
        if (id) {
            setSoftDeleteVisitId(id);
        } else {
            setSoftDeleteVisitId("");
        }
        setOpenDeleteModal(!openDeleteModal);
    };

    const toggleUpdateModal = (id?: string) => {

    }

    const lazyDeleteVisit = (id: string) => {
        updateCache({
            api: visitServerApi,
            endpoint: 'listVisits',
            mode: LazyUpdateModes.DELETE,
            dispatch,
            id,
        });
    };

    useEffect(() => {
        if (visitsData && !visitsIsLoading) {
            setVisits(visitsData.listDataObject || []);
        }
    }, [visitsData, visitsIsLoading]);

    if (visitsIsLoading) return <SkeletonTable />;

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
                    <tr key={visit.id} className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer">
                        <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.name}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.lastName}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.entries}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.home?.name}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{new Date(visit.createdDate).toLocaleString()}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{new Date(visit.limitDate).toLocaleString()}</td>
                        <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                            <FaEdit className='text-sky-500 hover:text-sky-400' onClick={() => toggleUpdateModal(visit.id)} />
                            <FaTrash className='text-red-500 hover:text-red-400' onClick={() => toggleDeleteModal(visit.id)} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

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

export default VisitsList;
