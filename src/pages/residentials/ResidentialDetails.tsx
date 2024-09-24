import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoArrowBackCircleSharp, IoClose } from "react-icons/io5";
import { TbArrowBackUp } from "react-icons/tb";
import { Link, useParams } from "react-router-dom";
import { useListHousesByResidentialQuery } from "src/core/features/houseServerApi";
import { useGetResidentialQuery } from "src/core/features/residentialServerApi";
import { HouseDto } from "src/core/models/dtos/houses/houseDto";
import { ResidentialDto } from "src/core/models/dtos/residentials/ResidentialDto";
import LoaderBig from "src/shared/components/LoaderBig";
import HouseDetailsModal from "./HouseDetailsModal";


interface ResidentialInformationProps {
    residential: ResidentialDto
    toggleHouseModal: (id?: string) => void
}

const ResidentialDetails: React.FC = () => {
    const [residential, setResidential] = useState<ResidentialDto>();
    const [houses, setHouses] = useState<HouseDto[]>();
    const [openHouseModal, setOpenHouseModal] = useState<boolean>(false);
    const [selectedHouseId, setSelectedHouseId] = useState<string>("");
    const [activeTab, setActiveTab] = useState<'informacion' | 'entradasSalidas'>('informacion');

    const { id } = useParams<{ id: string }>();
    const { data: residentialData, isFetching: residentialIsFetching } = useGetResidentialQuery(id!, { skip: !id });

    const toggleHouseModal = (id?: string) => {
        setOpenHouseModal(!openHouseModal);
        id && setSelectedHouseId(id);
    };

    useEffect(() => {
        if (residentialData && !residentialIsFetching) {
            setResidential(residentialData.dataObject);
        }
    }, [residentialData, residentialIsFetching]);

    if (residentialIsFetching) return <LoaderBig />;

    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>{residential?.name}</h2>

                <Link to={'/residentials'} className='flex items-center text-gray-500 hover:text-gray-400 gap-1'>
                    <IoArrowBackCircleSharp size={20} className='text-lg' />
                    <span className="text-base">Volver</span>
                </Link>
            </div>

            <div className='text-gray-500 font-semibold px-5 py-2 w-[95%] ml-5 mt-5 overflow-auto'>
                {/* Tabs */}
                <div className="flex gap-5 mb-7 text-sm">
                    <button 
                        className={`px-4 py-1 text-white font-semibold rounded-md ${activeTab === 'informacion' ? 'bg-sky-400' : 'bg-gray-400 hover:bg-gray-300'}`} 
                        onClick={() => setActiveTab('informacion')}>
                        Información
                    </button>

                    <button 
                        className={`px-4 py-1 text-white font-semibold rounded-md ${activeTab === 'entradasSalidas' ? 'bg-sky-400' : 'bg-gray-400 hover:bg-gray-300'}`} 
                        onClick={() => setActiveTab('entradasSalidas')}>
                        Entradas - Salidas
                    </button>
                </div>

                {/* Contenido según el tab */}
                {activeTab === 'informacion' && 
                    <ResidentialInformation residential={residential!} toggleHouseModal={toggleHouseModal} />
                }

                {activeTab === 'entradasSalidas' && (
                    <div>
                        <h3>Listado de Entradas y Salidas</h3>
                        {/* Aquí va el contenido relacionado con las entradas y salidas */}
                    </div>
                )}
            </div>

            {openHouseModal && (
                <HouseDetailsModal
                    toggleModal={toggleHouseModal}
                    id={selectedHouseId}
                />
            )}
        </div>
    );
}

export default ResidentialDetails;

const ResidentialInformation: React.FC<ResidentialInformationProps> = ({ residential, toggleHouseModal }) => {
    return (
        <table className="table-auto w-full text-sm rounded-md flex-1">
        <thead className='border-b font-medium dark:border-neutral-500'>
            <tr>
                <th>#</th>
                <th className='text-left'>Nombre</th>
                <th className='text-left'>Calle</th>
                <th className='text-left'>Número</th>
                <th className='text-left'>Contacto</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {residential?.homes.map((house, i) => (
                <tr key={house.id} className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer">
                    <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                    <td className='whitespace-nowrap py-4 font-normal text-left'>
                        <button type="button" onClick={() => toggleHouseModal(house.id)} className="hover:underline">
                            {house.name}
                        </button>
                    </td>
                    <td className='whitespace-nowrap py-4 font-normal text-left'>{house.street}</td>
                    <td className='whitespace-nowrap py-4 font-normal text-left'>{house.number}</td>
                    <td className='whitespace-nowrap py-4 font-normal text-left'>{house.phoneContact}</td>
                    <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                        <FaEdit className='text-sky-500 hover:text-sky-400' />
                        <FaTrash className='text-red-500 hover:text-red-400' />
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
    );
}