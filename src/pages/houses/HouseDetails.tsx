import React, {useEffect, useState} from "react";
import {IoArrowBackCircleSharp} from "react-icons/io5";
import {useGetHouseQuery} from "../../core/features/houseServerApi.ts";
import {HouseDto} from "../../core/models/dtos/houses/houseDto.ts";
import LoaderBig from "../../shared/components/LoaderBig.tsx";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {FaPlusCircle} from "react-icons/fa";
import AddUserToHouseModal from "../users/AddUserToHouseModal.tsx";
import AddRfidToHouseModal from "../rfid/AddRfidToHouseModal.tsx";
import UpdateUserFromHouseModal from "../users/UpdateUserFromHouseModal.tsx";
import UpdateRfidFromHouseModal from "../rfid/UpdateRfidFromHouseModal.tsx";


const HouseDetails: React.FC = () => {
    const [house, setHouse] = useState<HouseDto>()
    const [openAddUserModal, setOpenAddUserModal] = useState<boolean>(false)
    const [openAddRfidModal, setOpenAddRfidModal] = useState<boolean>(false)
    const [openUpdateUserModal, setOpenUpdateUserModal] = useState<boolean>(false)
    const [openUpdateRfidModal, setOpenUpdateRfidModal] = useState(false)
    const [updatedUserId, setUpdatedUserId] = useState<string>("")
    const [updatedRfidId, setUpdatedRfidId] = useState<string>("")

    const {id} = useParams<{ id: string }>()
    const navigate = useNavigate()
    const location = useLocation()

    const {data: houseData, isFetching: houseIsFetching} = useGetHouseQuery(id!, {skip: id === ""})

    const toggleAddUserModal = () => {
        setOpenAddUserModal((prevState) => {
            const newState = !prevState;
            if (newState) {
                navigate(`/houses/${id}/add-user`);
            } else {
                navigate(`/houses/${id}`);
            }
            return newState;
        });
    }

    const toggleUpdateUserModal = (id?: string) => {
        setOpenUpdateUserModal(!openUpdateUserModal)
        setUpdatedUserId(id || "")
    }

    const toggleUpdateRfidModal = (id?: string) => {
        setOpenUpdateRfidModal(!openUpdateRfidModal)
        setUpdatedRfidId(id || "")
    }

    const toggleAddRfidModal = () => {
        setOpenAddRfidModal((prevState) => {
            const newState = !prevState;
            if (newState) {
                navigate(`/houses/${id}/add-rfid`);
            } else {
                navigate(`/houses/${id}`);
            }
            return newState;
        });
    }

    useEffect(() => {
        setOpenAddUserModal(location.pathname.includes("add-user"));
        setOpenAddRfidModal(location.pathname.includes("add-rfid"));
    }, [location]);

    useEffect(() => {
        if (houseData && !houseIsFetching) {
            setHouse(houseData.dataObject)
        }
    }, [houseData, houseIsFetching])

    if (houseIsFetching) return <LoaderBig/>

    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div
                className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>{house?.name}</h2>

                <Link to={`/residentials/${house?.residential?.id}`}
                      className='flex items-center text-gray-500 hover:text-gray-400 gap-1'>
                    <IoArrowBackCircleSharp size={20} className='text-lg'/>
                    <span className="text-base">Volver</span>
                </Link>
            </div>

            <div className='text-gray-500 font-semibold px-5 py-2 w-[95%] ml-5 mt-5 overflow-auto'>

                <div className="space-y-6">

                    {/* Residencial */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-600">Residencial</h4>
                        <p className="text-gray-500">{house?.residential?.name} - {house?.residential?.description}</p>
                    </div>

                    {/* Usuario principal (Responsable) */}
                    {house?.principal && (
                        <div className="p-4 bg-slate-100 rounded-md shadow-md">
                            <h4 className="text-lg font-semibold text-gray-700">Responsable</h4>
                            {house?.principal && (
                                <div className="mt-2">
                                    <p className="text-gray-700 font-medium">
                                        {house.principal.name} {house.principal.lastName}
                                    </p>
                                    <p className="text-gray-500">{house.principal.email}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Usuarios que habitan la casa */}
                    <div>
                        <div className="flex gap-3">
                            <h4 className="text-lg font-semibold text-gray-600">Habitantes</h4>
                            <Link to={'add-user'} className='flex items-center text-sky-500 hover:text-sky-400 gap-1'>
                                <FaPlusCircle className='text-lg'/>
                            </Link>
                        </div>
                        {house?.users?.length ? (
                            <ul className="space-y-2 mt-2">
                                {house.users.map(user => (
                                    <li key={user.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm hover:cursor-pointer hover:bg-gray-100" onClick={() => toggleUpdateUserModal(user.id)}>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-gray-700 font-medium">{user.name} {user.lastName}</p>
                                                <p className="text-gray-500">{user.email}</p>
                                            </div>
                                            {user.isPrincipal &&
                                                <span className="text-xs text-green-500">(Responsable)</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No hay usuarios registrados.</p>
                        )}
                    </div>

                    {/* Tarjetas RFID */}
                    <div>
                        <div className={"flex gap-3"}>
                            <h4 className="text-lg font-semibold text-gray-600">Tarjetas de Acceso (RFID)</h4>
                            <Link to={'add-rfid'} className='flex items-center text-sky-500 hover:text-sky-400 gap-1'>
                                <FaPlusCircle className='text-lg'/>
                            </Link>
                        </div>
                        {house?.rfids?.length ? (
                            <ul className="space-y-2 mt-2">
                                {house.rfids.map(rfid => (
                                    <li key={rfid.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm hover:cursor-pointer hover:bg-gray-100" onClick={() => toggleUpdateRfidModal(rfid.id)}>
                                        <div>
                                            <p className="text-gray-700 font-medium">Folio: {rfid.folio}</p>
                                            <p className="text-gray-500 text-sm">Comentarios: {rfid.comments}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No hay tarjetas RFID registradas.</p>
                        )}
                    </div>
                </div>
            </div>

            {openAddUserModal && <AddUserToHouseModal toggleModal={toggleAddUserModal} />}
            {openAddRfidModal && <AddRfidToHouseModal toggleModal={toggleAddRfidModal} />}
            {openUpdateUserModal && <UpdateUserFromHouseModal toggleModal={toggleUpdateUserModal} userId={updatedUserId} />}
            {openUpdateRfidModal && <UpdateRfidFromHouseModal toggleModal={toggleUpdateRfidModal} rfidId={updatedRfidId} />}
        </div>
    );
};


export default HouseDetails;