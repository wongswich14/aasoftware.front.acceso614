import { useState, useEffect } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {useListVisitsQuery, useSoftDeleteVisitMutation} from "../../../../core/features/visitServerApi.ts";
import SkeletonTable from "src/shared/components/SkeletonTable";
import { useAppDispatch } from "../../../../core/store.ts";
import { VisitsDto } from "../../../../core/models/dtos/visits/visitsDto.ts";
import { VisitsUpdateDto } from "../../../../core/models/dtos/visits/visitsUpdateDto.ts";
import QrCodeModal from './QrModal.tsx';
import {toast} from "sonner";
import DeleteModal from "../../../../shared/components/DeleteModal.tsx"; // Import your new modal component

const ResidentialVisitsList = () => {
    const { id } = useParams<{ id: string }>();
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
    const [openUpdateDoorsModal, setOpenUpdateDoorsModal] = useState<boolean>(false);
    const [openQrModal, setOpenQrModal] = useState<boolean>(false); // State for QR modal
    const [qrCode, setQrCode] = useState<string>("");
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const [softDeleteId, setSoftDeleteId] = useState<string>("")
    const { data: visitsData, isLoading: visitsIsLoading, refetch: refetchVisits } = useListVisitsQuery(id!, { skip: !id });
    const navigate = useNavigate();
    const location = useLocation();
    const [softDelete] = useSoftDeleteVisitMutation();

    const toggleUpdateModal = (data: VisitsUpdateDto | void) => {
        if (data) {
            setVisita(data);
        }
        setOpenUpdateDoorsModal(!openUpdateDoorsModal);
        if (!openUpdateDoorsModal) {
            navigate(`visits/update/${data?.id}`);
        } else {
            navigate(`/residentials/${id}/visits`);
        }
        refetchVisits();
};


    const toggleDeleteModal = (id?: string) => {
        setOpenDeleteModal(!openDeleteModal)

        setSoftDeleteId(id)
    }

    const handleDelete =  async (id: string) => {
        const softDeletePromise = softDelete(id).unwrap()

        toast.promise(softDeletePromise, {
            loading: "Eliminando...",
            success: () => {
                toggleDeleteModal()
                return "Visita eliminada"
            },
            error: (err) => {
                console.error(err)
                return "Error al eliminar visita"
            }
        })
    }


    const toggleGetQr = (data: string | void) => {
        if (data) {
            setQrCode(data);
        }
        setOpenQrModal(true); // Open QR modal
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
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{new Date(visit.createdDate).toLocaleString()}</td>
                        <td className='whitespace-nowrap py-4 font-normal text-left'>{new Date(visit.limitDate).toLocaleString()}</td>
                        <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                            <FaEye className='text-red-500 hover:text-red-400' onClick={() => toggleGetQr(visit.qrString)} />
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
                            })} />
                                <FaTrash className='text-red-500 hover:text-red-400' onClick={() => toggleDeleteModal(visit.id)} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <QrCodeModal
                isOpen={openQrModal}
                qrCode={qrCode}
                onClose={() => setOpenQrModal(false)}
            />

            {openDeleteModal &&
                <DeleteModal
                    toggleDeleteModal={toggleDeleteModal}
                    softDeleteId={softDeleteId}
                    deleteAction={handleDelete}
                />
            }


        </>
    );
}

export default ResidentialVisitsList;
