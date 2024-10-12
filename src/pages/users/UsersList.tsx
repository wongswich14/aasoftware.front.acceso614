import { useEffect, useState } from "react";
import { FaEdit, FaPlusCircle, FaTrash } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import DeleteModal from "src/shared/components/DeleteModal";
import CreateUserModal from "./CreateUserModal";
import UpdateUserModal from "./UpdateUserModal";
import { useListUsersQuery, userServerApi, useSoftDeleteUserMutation } from "src/core/features/userServerApi";
import { UserDto } from "src/core/models/dtos/users/userDto";
import { UserUpdateDto } from "src/core/models/dtos/users/userUpdateDto";
import SkeletonTable from "src/shared/components/SkeletonTable";
import { useAppDispatch } from "src/core/store";
import { LazyUpdateModes, updateCache } from "src/core/utils/lazyUpdateListByGuid";
import { toast } from "sonner";

const UsersList: React.FC = () => {

    const [users, setUsers] = useState<UserDto[] | null>(null)
    const [softDeleteUserId, setSoftDeleteUserId] = useState<string>("")
    const [openUpdateUserModal, setOpenUpdateUserModal] = useState<boolean>(false)
    const [openCreateUserModal, setOpenCreateUserModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const [page, setPage] = useState(1);

    const { data: usersData, isFetching: usersIsLoading } = useListUsersQuery(page, { refetchOnMountOrArgChange: true })
    const [softDelete] = useSoftDeleteUserMutation()

    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{id: string}>()
    const dispatch = useAppDispatch()

    const handleDelete =  async (id: string) => {
        const softDeletePromise = softDelete(id).unwrap()

        toast.promise(softDeletePromise, {
            loading: "Eliminando...",
            success: () => {
                lazyDeleteUser(id)
                toggleDeleteModal()
                return "Usuario eliminado"
            },
            error: (err) => {
                console.error(err)
                return "Error al eliminar usuario"
            }
        })
    }

    const toggleUpdateModal = (id?: string) => {
        setOpenUpdateUserModal(!openUpdateUserModal)
        if(id) {
            navigate(`/users/update/${id}`)
        } else {
            navigate(`/users`)
        }
    }

    const toggleCreateModal = (id?: string) => {
        setOpenCreateUserModal(!openCreateUserModal)
        if(id) {
            navigate(`/users/create`)
        } else {
            navigate(`/users`)
        }
    }

    const toggleDeleteModal = (id?: string) => {
        if (id) {
            setSoftDeleteUserId(id)
        } else {
            setSoftDeleteUserId("")
        }
        setOpenDeleteModal(!openDeleteModal)
    }

    const lazyUpdateUser = (id: string, newItem: UserUpdateDto) => {
        updateCache({
            api: userServerApi,
            endpoint: 'listUsers',
            mode: LazyUpdateModes.UPDATE,
            dispatch,
            newItem,
            id
        })
    }

    const lazyDeleteUser = (id: string) => {
        updateCache({
            api: userServerApi,
            endpoint: 'listUsers',
            mode: LazyUpdateModes.DELETE,
            dispatch,
            id
        })
    }

    const lazyAddUser = (newItem: UserDto) => {
        updateCache({
            api: userServerApi,
            endpoint: 'listUsers',
            mode: LazyUpdateModes.ADD,
            dispatch,
            newItem
        })
    }

    const handlePreviousPage = () => {
        setPage(prev => prev - 1)
    }

    const handleNextPage = () => {
        setPage(prev => prev + 1)
    }

    useEffect(() => {
        if (usersData && !usersIsLoading) {
            setUsers(usersData.listDataObject || [])
        }
    }, [usersData, usersIsLoading])

    useEffect(() => {
        if (id) {
            setOpenUpdateUserModal(true)
        } else {
            setOpenUpdateUserModal(false)
        }
            
        if (location.pathname.includes("create")) {
            setOpenCreateUserModal(true)   
        } else {
            setOpenCreateUserModal(false)
        }
    }, [id, location])

    if (usersIsLoading) return <SkeletonTable />

    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div
                className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>Listado de Usuarios</h2>
                <Link to={'create'} className='flex items-center text-sky-500 hover:text-sky-400 gap-1'>
                    <FaPlusCircle className='text-lg'/>
                    <span className="text-base">Nuevo</span>
                </Link>
            </div>
            <div className='text-gray-500 font-semibold borde p-5 w-[95%] ml-5 mt-5 oerflow-auto'>
                <table className="table-auto w-full text-sm rounded-md flex-1">
                    <thead className='border-b font-medium dark:border-neutral-500'>
                    <tr>
                        <th>#</th>
                        <th className='text-left'>Nombre</th>
                        <th className='text-left'>Perfil</th>
                        <th className='text-left'>Correo</th>
                        <th className="text-left">Residencial</th>
                        {/* <th className="text-left">Casa</th> */}

                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        users && users.map((user, i) => (

                            < tr key={user.id}
                                 className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer">
                                <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{`${user.name} ${user.lastName}`}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{user.profileName}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{user.email}</td>
                                <td className='whitespace-nowrap py-4 font-normal text-left'>{user.residential?.name || "N/A"}</td>
                                {/* <td className='whitespace-nowrap py-4 font-normal text-left'>{user.home?.id || "N/A" }</td> */}
                                <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                                    <FaEdit className='text-sky-500 hover:text-sky-400'
                                            onClick={() => toggleUpdateModal(user.id)}/>
                                    <FaTrash className='text-red-500 hover:text-red-400'
                                             onClick={() => toggleDeleteModal(user.id)}/>
                                </td>
                            </tr>
                        ))

                    }
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-10 gap-5">
                <button
                    type={"button"}
                    disabled={page === 1} onClick={handlePreviousPage}
                    className={"bg-gray-400 rounded-md text-white font-medium disabled:bg-gray-300 px-4 py-1 text-sm disabled:cursor-not-allowed"}
                >
                    Anterior
                </button>

                <button
                    type={"button"}
                    onClick={handleNextPage}
                    disabled={!users || users.length < 10}
                    className={"bg-gray-400 rounded-md text-white font-medium disabled:bg-gray-300 px-4 py-1 text-sm disabled:cursor-not-allowed"}
                >
                    Siguiente
                </button>
            </div>


            {openUpdateUserModal &&
                <UpdateUserModal
                    toggleUpdateModal={toggleUpdateModal}
                    lazyUpdateUser={lazyUpdateUser}
                />
            }

            {openCreateUserModal &&
                <CreateUserModal
                    toggleCreateModal={toggleCreateModal}
                    lazyAddUser={lazyAddUser}
                />
            }

            {openDeleteModal &&
                <DeleteModal
                    toggleDeleteModal={toggleDeleteModal}
                    softDeleteId={softDeleteUserId}
                    deleteAction={handleDelete}
                />
            }
        </div>
    );
}

export default UsersList;