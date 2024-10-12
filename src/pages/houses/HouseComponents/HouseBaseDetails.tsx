import React, {useEffect, useState} from "react";
import {IoArrowBackCircleSharp} from "react-icons/io5";
import {useGetHouseQuery} from "../../../core/features/houseServerApi.ts";
import {HouseDto} from "../../../core/models/dtos/houses/houseDto.ts";
import LoaderBig from "../../../shared/components/LoaderBig.tsx";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {FaPlusCircle, FaTrash} from "react-icons/fa";
import AddUserToHouseModal from "../../users/AddUserToHouseModal.tsx";
import AddRfidToHouseModal from "../../rfid/AddRfidToHouseModal.tsx";
import UpdateUserFromHouseModal from "../../users/UpdateUserFromHouseModal.tsx";
import UpdateRfidFromHouseModal from "../../rfid/UpdateRfidFromHouseModal.tsx";
import DeleteModal from "../../../shared/components/DeleteModal.tsx";
import {useSoftDeleteUserMutation} from "../../../core/features/userServerApi.ts";
import {useSoftDeleteRfidMutation} from "../../../core/features/rfidServerApi.ts";
import {toast} from "sonner";
import {hasPermission} from "../../../core/utils/hasPermission.ts";


const HouseBaseDetails: React.FC = () => {
    const [house, setHouse] = useState<HouseDto>()
    const [openAddUserModal, setOpenAddUserModal] = useState<boolean>(false)
    const [openAddRfidModal, setOpenAddRfidModal] = useState<boolean>(false)
    const [openUpdateUserModal, setOpenUpdateUserModal] = useState<boolean>(false)
    const [openUpdateRfidModal, setOpenUpdateRfidModal] = useState(false)
    const [updatedUserId, setUpdatedUserId] = useState<string>("")
    const [updatedRfidId, setUpdatedRfidId] = useState<string>("")
    const [deletedId, setDeletedId] = useState<string>("")
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const [deleteMode, setDeleteMode] = useState<"user" | "rfid">("user");

    const {id} = useParams<{ id: string }>()
    const navigate = useNavigate()
    const location = useLocation()

    const {data: houseData, isFetching: houseIsFetching} = useGetHouseQuery(id!, {skip: id === ""})

    const [softDeleteUser] = useSoftDeleteUserMutation()
    const [softDeleteRfid] = useSoftDeleteRfidMutation()

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

    const toggleDeleteModal = (id?: string, mode: "user" | "rfid" = "user") => {
        setOpenDeleteModal(!openDeleteModal);
        setDeletedId(id || "");
        setDeleteMode(mode);
    };

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

    const handleDelete = async (deleteMode: "user" | "rfid", deletedId: string) => {
        let deletePromise;

        switch (deleteMode) {
            case "user":
                deletePromise = softDeleteUser(deletedId).unwrap();
                toast.promise(deletePromise, {
                    loading: "Eliminando usuario...",
                    success: () => {
                        toggleDeleteModal();
                        return "Usuario eliminado";
                    },
                    error: (err) => {
                        console.error(err);
                        return "Error al eliminar usuario";
                    }
                });
                break;

            case "rfid":
                deletePromise = softDeleteRfid(deletedId).unwrap();
                toast.promise(deletePromise, {
                    loading: "Eliminando tarjeta RFID...",
                    success: () => {
                        toggleDeleteModal();
                        return "Tarjeta RFID eliminada";
                    },
                    error: (err) => {
                        console.error(err);
                        return "Error al eliminar tarjeta RFID";
                    }
                });
                break;
        }
    };

    const canTest = hasPermission("deleteCardsRFID", "hogar") || hasPermission("deleteCardsRFID", "residencial") || hasPermission("deleteCardsRFID", "global")
    console.log(canTest)

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
        <>
            <div className='text-gray-500 font-semibold px-5 py-2 w-[95%] ml-5 mt-5 overflow-auto'>

                <div className="space-y-6">

                    {/* Residencial */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-600">Residencial</h4>
                        <p className="text-gray-500">{house?.residential?.name} - {house?.residential?.description}</p>
                    </div>

                    {/* Usuarios que habitan la casa */}
                    <div>
                        <div className="flex gap-3">
                            <h4 className="text-lg font-semibold text-gray-600">Habitantes</h4>
                            {hasPermission("createUsers") &&
                                <Link to={'add-user'}
                                      className='flex items-center text-sky-500 hover:text-sky-400 gap-1'>
                                    <FaPlusCircle className='text-lg'/>
                                </Link>
                            }
                        </div>
                        {house?.users?.length ? (
                            <ul className="space-y-2 mt-2">
                                {house.users.map(user => (
                                    <li key={user.id}
                                        className="p-4 border rounded-lg bg-gray-50 shadow-sm hover:cursor-pointer hover:bg-gray-100"
                                        onClick={hasPermission("updateUsers") ? () => toggleUpdateUserModal(user.id) : undefined}>
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-7 items-center">
                                                <div>
                                                    <p className="text-gray-700 font-medium">{user.name} {user.lastName}</p>
                                                    <p className="text-gray-500">{user.email}</p>
                                                    {user.profileName &&
                                                        <p className="bg-gray-400 rounded-lg px-2 py-1 text-white text-xs font-semibold w-fit mt-1">{user.profileName}</p>
                                                    }
                                                </div>
                                                {user.isPrincipal &&
                                                    <span className="text-xs text-green-500">(Responsable)</span>}
                                            </div>

                                            {hasPermission("deleteUsers") && (
                                                <FaTrash className='text-red-500 hover:text-red-400'
                                                         size={18}
                                                         onClick={(e) => {
                                                             e.stopPropagation();
                                                             toggleDeleteModal(user.id, "user");
                                                         }}/>
                                            )}
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
                            {hasPermission("createCardsRFID") &&
                                < Link to={'add-rfid'} className='flex items-center text-sky-500 hover:text-sky-400 gap-1'>
                                <FaPlusCircle className='text-lg'/>
                                </Link>
                            }
                        </div>
                        {house?.rfids?.length ? (
                            <ul className="space-y-2 mt-2">
                                {house.rfids.map(rfid => (
                                    <li key={rfid.id}
                                        className="p-4 border rounded-lg bg-gray-50 shadow-sm hover:cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                                        onClick={hasPermission("updateCardsRFID") ? () => toggleUpdateRfidModal(rfid.id) : undefined}>
                                    <div>
                                            <p className="text-gray-700 font-medium">Folio: {rfid.folio}</p>
                                            <p className="text-gray-500 text-sm">Comentarios: {rfid.comments}</p>
                                        </div>

                                        {canTest && (
                                            <FaTrash size={18} className="text-red-500 hover:text-red-400"
                                                     onClick={(e) => {
                                                         e.stopPropagation();
                                                         toggleDeleteModal(rfid.id, "rfid");
                                                     }}/>
                                        )}
                                    </li>

                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No hay tarjetas RFID registradas.</p>
                        )}
                    </div>
                </div>
            </div>

            {openAddUserModal && <AddUserToHouseModal toggleModal={toggleAddUserModal}/>}
            {openAddRfidModal && <AddRfidToHouseModal toggleModal={toggleAddRfidModal}/>}
            {openUpdateUserModal &&
                <UpdateUserFromHouseModal toggleModal={toggleUpdateUserModal} userId={updatedUserId}/>}
            {openUpdateRfidModal &&
                <UpdateRfidFromHouseModal toggleModal={toggleUpdateRfidModal} rfidId={updatedRfidId}/>}
            {openDeleteModal && (
                <DeleteModal
                    toggleDeleteModal={toggleDeleteModal}
                    softDeleteId={deletedId}
                    deleteAction={(id: string) => handleDelete(deleteMode, id)}
                />
            )}
        </>
    );
};


export default HouseBaseDetails;