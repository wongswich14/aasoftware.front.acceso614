import React, { useEffect, useState } from "react";
import {FaEdit, FaPlusCircle, FaTrash} from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetResidentialQuery } from "src/core/features/residentialServerApi";
import { ResidentialDto } from "src/core/models/dtos/residentials/ResidentialDto";
import LoaderBig from "src/shared/components/LoaderBig";
import AddHouseToResidentialModal from "../houses/AddHouseToResidentialModal.tsx";
import ResidentialDoors from "./ResidentialDetailsComponents/Doors/ResidentialDoors.tsx";
import ResidentialVisitsList from "./ResidentialDetailsComponents/Visits/ResidentialVisitList.tsx";
import ResidentialHistoryList from "./ResidentialDetailsComponents/History/ResidentialHistory.tsx";
import ResidentialInformation from "./ResidentialDetailsComponents/ResidentialInformation.tsx";


const ResidentialDetails: React.FC = () => {
    const [residential, setResidential] = useState<ResidentialDto>();
    const [activeTab, setActiveTab] = useState<'informacion' | 'entradasSalidas' | 'visitas' | 'historial'>('informacion');
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const { id } = useParams<{ id: string }>();
    const { data: residentialData, isFetching: residentialIsFetching } = useGetResidentialQuery(id!, { skip: !id });
    const location = useLocation();
    const navigate = useNavigate();
    const toggleCreateModal = () => {
        setOpenCreateModal(!openCreateModal)
    }

    useEffect(() => {
        if (location.pathname.includes("doors")){
            setActiveTab("entradasSalidas")
        } else if (location.pathname.includes("visits")){
            setActiveTab("visitas")
        } else if (location.pathname.includes("history")){
            setActiveTab("historial")
        } else {
            setActiveTab("informacion")
        }
    }, [id, location]);

    useEffect(() => {
        if (residentialData && !residentialIsFetching) {
            setResidential(residentialData.dataObject);
        }
    }, [residentialData, residentialIsFetching]);

    if (residentialIsFetching) return <LoaderBig/>;

    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div
                className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>{residential?.name}</h2>

                {
                    activeTab == 'informacion' && (
                        <button onClick={toggleCreateModal}
                                className='flex items-center text-sky-500 hover:text-sky-400 gap-1'>
                            <FaPlusCircle size={20} className='text-lg'/>
                            <span className="text-base">Agregar Vivienda</span>
                        </button>
                    )
                }

            </div>

            <div className='text-gray-500 font-semibold px-5 py-2 w-[95%] ml-5 mt-5 overflow-auto'>
                {/* Tabs */}
                <div className="flex gap-5 mb-7 text-sm">
                    <button
                        className={`px-4 py-1 text-white font-semibold rounded-md ${activeTab === 'informacion' ? 'bg-sky-400' : 'bg-gray-400 hover:bg-gray-300'}`}
                        onClick={() => {
                            setActiveTab('informacion')
                            navigate("");
                        }}>
                        Viviendas
                    </button>

                    <button
                        className={`px-4 py-1 text-white font-semibold rounded-md ${activeTab === 'entradasSalidas' ? 'bg-sky-400' : 'bg-gray-400 hover:bg-gray-300'}`}
                            onClick={() => {
                                setActiveTab('entradasSalidas')
                                navigate("doors");
                            }}>
                        Entradas - Salidas
                    </button>

                    <button
                        className={`px-4 py-1 text-white font-semibold rounded-md ${activeTab === 'visitas' ? 'bg-sky-400' : 'bg-gray-400 hover:bg-gray-300'}`}
                        onClick={() => {
                            setActiveTab('visitas')
                            navigate("visits");
                        }}>
                        Visitas
                    </button>

                    <button
                        className={`px-4 py-1 text-white font-semibold rounded-md ${activeTab === 'historial' ? 'bg-sky-400' : 'bg-gray-400 hover:bg-gray-300'}`}
                        onClick={() => {
                            setActiveTab('historial')
                            navigate("history");
                        }}>
                        Historial
                    </button>

                </div>

                {/* Contenido según el tab */}
                {activeTab === 'informacion' &&
                    <ResidentialInformation residential={residential!}/>
                }

                {activeTab === 'entradasSalidas' && (
                    <ResidentialDoors residential={residential!}/>
                )}

                {/* Contenido según el tab */}
                {activeTab === 'visitas' &&
                    <ResidentialVisitsList residential={residential!}/>
                }

                {/* Contenido según el tab */}
                {activeTab === 'historial' &&
                    <ResidentialHistoryList residential={residential!}/>
                }

            </div>

            {openCreateModal && <AddHouseToResidentialModal toggleModal={toggleCreateModal} />}
        </div>
    );
}

export default ResidentialDetails;
