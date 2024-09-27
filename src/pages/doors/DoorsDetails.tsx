import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Link, useLocation, useParams } from "react-router-dom";
import LoaderBig from "src/shared/components/LoaderBig";
import {useGetDoorQuery} from "../../core/features/doorServerApi.ts";
import {DoorDto} from "../../core/models/dtos/doors/doorDto.ts";
import VisitsList from "../visits/VisitList.tsx";

const DoorsDetails: React.FC = () => {
    const [door, setDoor] = useState<DoorDto>();
    const [activeTab, setActiveTab] = useState<'visitas' | 'historial'>('visitas');

    const { id } = useParams<{ id: string }>();
    const { data: doorData, isFetching: doorIsFetching } = useGetDoorQuery(id!, { skip: !id });
    console.log(doorData);
    const location = useLocation();

    useEffect(() => {
        if (doorData && !doorIsFetching) {
            setDoor(doorData.dataObject);
        }
    }, [doorData, doorIsFetching]);

    useEffect(() => {
        if (location.pathname.includes("historial")) {
            setActiveTab("historial");
        } else {
            setActiveTab("visitas");
        }
    }, [location]);

    if (doorIsFetching) return <LoaderBig />;

    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>{door?.name}</h2>

                <Link to={`/residentials/${door?.residential?.id}`} className='flex items-center text-gray-500 hover:text-gray-400 gap-1'>
                    <IoArrowBackCircleSharp size={20} className='text-lg' />
                    <span className="text-base">Volver</span>
                </Link>
            </div>

            <div className='text-gray-500 font-semibold px-5 py-2 w-[95%] ml-5 mt-5 overflow-auto'>
                {/* Tabs */}
                <div className="flex gap-5 mb-7 text-sm">
                    <button
                        className={`px-4 py-1 text-white font-semibold rounded-md ${activeTab === 'visitas' ? 'bg-sky-400' : 'bg-gray-400 hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('visitas')}>
                        Visitas
                    </button>

                    <button
                        className={`px-4 py-1 text-white font-semibold rounded-md ${activeTab === 'historial' ? 'bg-sky-400' : 'bg-gray-400 hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('historial')}>
                        Historial
                    </button>
                </div>

                {/* Contenido según el tab */}
                {activeTab === 'visitas' &&
                    <VisitsList residential={door!.residential! }/>
                }

                {activeTab === 'historial' && (
                    <>
                    </>
                )}
            </div>
        </div>
    );
}

export default DoorsDetails;
