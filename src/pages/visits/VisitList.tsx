import { useState, useEffect } from "react";
import { FaEdit, FaPlusCircle, FaTrash } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { visitServerApi, useHardDeleteVisitMutation, useListVisitsQuery } from "src/core/features/visitServerApi";
import { VisitDto } from "src/core/models/dtos/visits/visitDto";
import { useAppDispatch } from "src/core/store";
import { updateCache, LazyUpdateModes } from "src/core/utils/lazyUpdateListByGuid";
import DeleteModal from "src/shared/components/DeleteModal";
import SkeletonTable from "src/shared/components/SkeletonTable";
import { useSoftDeleteVisitMutation } from "src/core/features/visitServerApi";
import CreateVisitModal from "./CreateVisitModal";
import UpdateVisitModal from "./UpdateVisitModal";

const VisitsList: React.FC = () => {
    const [visits, setVisits] = useState<VisitDto[] | null>(null);
    const [softDeleteVisitId, setSoftDeleteVisitId] = useState<string>("");
    const [openUpdateVisitModal, setOpenUpdateVisitModal] = useState<boolean>(false);
    const [openCreateVisitModal, setOpenCreateVisitModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

    const { data: visitsData, error: visitsError, isLoading: visitsIsLoading, refetch: refetchVisits } = useListVisitsQuery();
    const [softDelete] = useSoftDeleteVisitMutation();
    const [hardDelete] = useHardDeleteVisitMutation();

    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    const handleDelete = async (id: string) => {
        const hardDeletePromise = hardDelete(id).unwrap();

        toast.promise(hardDeletePromise, {
            loading: "Eliminando...",
            success: () => {
                lazyDeleteVisit(id);
                toggleDeleteModal();
                return "Visita eliminada";
            },
            error: (err) => {
                console.error(err);
                return "Error al eliminar visita";
            },
        });
    };

    const toggleUpdateModal = (id?: string) => {
        setOpenUpdateVisitModal(!openUpdateVisitModal);
        if (id) {
            navigate(`/visits/update/${id}`);
        } else {
            navigate(`/visits`);
        }
    };

    const toggleCreateModal = () => {
        setOpenCreateVisitModal(!openCreateVisitModal);
        navigate(`/visits/create`);
    };

    const toggleDeleteModal = (id?: string) => {
        if (id) {
            setSoftDeleteVisitId(id);
        } else {
            setSoftDeleteVisitId("");
        }
        setOpenDeleteModal(!openDeleteModal);
    };

    const lazyUpdateVisit = (id: string, newItem: VisitDto) => {
        refetchVisits();
    };

    const lazyDeleteVisit = (id: string) => {
        updateCache({
            api: visitServerApi,
            endpoint: 'listVisits',
            mode: LazyUpdateModes.DELETE,
            dispatch,
            id,
        });
    };

    const lazyAddVisit = (newItem: VisitDto) => {
        updateCache({
            api: visitServerApi,
            endpoint: 'listVisits',
            mode: LazyUpdateModes.ADD,
            dispatch,
            newItem,
        });
    };

    useEffect(() => {
        if (visitsData && !visitsIsLoading) {
            setVisits(visitsData.listDataObject || []);
        }
    }, [visitsData, visitsIsLoading]);

    useEffect(() => {
        if (id) {
            setOpenUpdateVisitModal(true);
        } else {
            setOpenUpdateVisitModal(false);
        }

        if (location.pathname.includes("create")) {
            setOpenCreateVisitModal(true);
        } else {
            setOpenCreateVisitModal(false);
        }
    }, [id, location]);

    if (visitsIsLoading) return <SkeletonTable />;

    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>Listado de Visitas</h2>
                <Link to={'create'} className='flex items-center text-sky-500 hover:text-sky-400 gap-1'>
                    <FaPlusCircle className='text-lg' />
                    <span className="text-base">Nueva</span>
                </Link>
            </div>
            <div className='text-gray-500 font-semibold borde p-5 w-[95%] ml-5 mt-5 overflow-auto'>
                <table className="table-auto w-full text-sm rounded-md flex-1">
                    <thead className='border-b font-medium dark:border-neutral-500'>
                    <tr>
                        <th>#</th>
                        <th className='text-left'>Nombre</th>
                        <th className='text-left'>Fecha</th>
                        <th className='text-left'>Ubicación</th>
                        <th className='text-left'>Contacto</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        visits && visits.map((visit, i) => (
                            <tr key={visit.id} className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer">
                                <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.name}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.date}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.location}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{visit.contact}</td>
                                <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                                    <FaEdit className='text-sky-500 hover:text-sky-400' onClick={() => toggleUpdateModal(visit.id)} />
                                    <FaTrash className='text-red-500 hover:text-red-400' onClick={() => toggleDeleteModal(visit.id)} />
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>

            {openUpdateVisitModal &&
                <UpdateVisitModal
                    toggleUpdateModal={toggleUpdateModal}
                    lazyUpdateVisit={lazyUpdateVisit}
                />
            }

            {openCreateVisitModal &&
                <CreateVisitModal
                    toggleCreateModal={toggleCreateModal}
                    lazyAddVisit={lazyAddVisit}
                />
            }

            {openDeleteModal &&
                <DeleteModal
                    toggleDeleteModal={toggleDeleteModal}
                    softDeleteId={softDeleteVisitId}
                    deleteAction={handleDelete}
                />
            }
        </div>
    );
}

export default VisitsList;
