import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import LoaderBig from "../../../shared/components/LoaderBig.tsx";
import {FaPlusCircle} from "react-icons/fa";
import {useGetHouseQuery} from "../../../core/features/houseServerApi.ts";
import HouseBaseDetails from "./HouseBaseDetails.tsx";
import HouseCreateVisits from "./Visits/HouseCreateVisits.tsx";
import {HouseDto} from "../../../core/models/dtos/houses/houseDto.ts";
import HouseVisitsList from "./Visits/HouseVisitsList.tsx";
import HouseHistory from "./History/HouseHistory.tsx";
import HouseHistoryList from "./History/HouseHistory.tsx";


const UserHouseDetails = () => {

    const [house, setHouse] = useState<HouseDto>();
    const [activeTab, setActiveTab] = useState<'informacion'  | 'visitas' | 'historial'>('informacion');
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const { id } = useParams<{ id: string }>();
    const { data: residentialData, isFetching: residentialIsFetching } = useGetHouseQuery(id!, { skip: !id });
    const location = useLocation();
    const navigate = useNavigate();
    const toggleCreateModal = () => {
        setOpenCreateModal(!openCreateModal)
    }

    useEffect(() => {
        if (location.pathname.includes("visits")){
            setActiveTab("visitas")
        } else if (location.pathname.includes("history")){
            setActiveTab("historial")
        } else {
            setActiveTab("informacion")
        }
    }, [id, location]);

    useEffect(() => {
        if (residentialData && !residentialIsFetching) {
            setHouse(residentialData!.dataObject!);
        }
    }, [residentialData, residentialIsFetching]);

    if (residentialIsFetching) return <LoaderBig/>;

    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div
                className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>{house?.name}</h2>

                {
                    activeTab == 'visitas' && (
                        <button onClick={toggleCreateModal}
                                className='flex items-center text-sky-500 hover:text-sky-400 gap-1'>
                            <FaPlusCircle size={20} className='text-lg'/>
                            <span className="text-base">Agregar Visitas</span>
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
                    <HouseBaseDetails/>
                }

                {/* Contenido según el tab */}
                {activeTab === 'visitas' &&
                    <HouseVisitsList/>
                }

                {activeTab === 'histori         al' &&
                    <HouseHistoryList house={house!}/>
                }

            </div>


            {openCreateModal && activeTab=="visitas" && <HouseCreateVisits toggleCreateModal={toggleCreateModal} />}

        </div>
    );
}

export default UserHouseDetails;