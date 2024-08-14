import { useEffect, useState } from "react";
import { FaEdit, FaPlusCircle, FaTrash } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { lazyUpdateList, LazyUpdateModes } from "src/core/utils/lazyUpdateListByGuid";
import DeleteModal from "src/shared/components/DeleteModal";
import CreateUserModal from "./CreateUserModal";
import UpdateUserModal from "./UpdateUserModal";
import { useListUsersQuery, useSoftDeleteUserMutation } from "src/core/features/userServerApi";
import { UserDto } from "src/core/models/dtos/users/userDto";
import { UserUpdateDto } from "src/core/models/dtos/users/userUpdateDto";

const UsersList: React.FC = () => {

    const [users, setUsers] = useState<UserDto[] | null>(null)
    const [softDeleteUserId, setSoftDeleteUserId] = useState<string>("")
    const [openUpdateUserModal, setOpenUpdateUserModal] = useState<boolean>(false)
    const [openCreateUserModal, setOpenCreateUserModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

    const { data: profilesData, error: profilesError, isLoading: profilesIsLoading, refetch: refetchUsers } = useListUsersQuery()
    const [softDelete, { data: softDeleteData, status: softDeleteStatus, isLoading: softDeleteIsLoading }] = useSoftDeleteUserMutation()

    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{id: string}>()

    const handleDelete =  async (id: string) => {
        try {
            await softDelete(id)
            lazyDeleteUser(id)
        }
        catch (error) {
            console.error(error)
        }
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

    const lazyUploadUser = (id: string, newItem: UserUpdateDto) => {
        const newList = lazyUpdateList(users!, LazyUpdateModes.UPDATE, id, newItem)
        setUsers(newList)
    }

    const lazyDeleteUser = (id: string) => {
        const newList = lazyUpdateList(users!, LazyUpdateModes.DELETE, id)
        setUsers(newList)
    }

    // const la

    useEffect(() => {
        if (profilesData && !profilesIsLoading) {
            setUsers(profilesData.listDataObject || [])
        }
    }, [profilesData, profilesIsLoading])

    useEffect(() => {
        if (id) setOpenUpdateUserModal(true)
        else if (location.pathname.includes("create")) setOpenCreateUserModal(true)
    }, [id, location])

    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>Listado de Usuarios</h2>
                <Link to={'create'} className='flex items-center text-sky-500 hover:text-sky-400 gap-1'>
                    <FaPlusCircle className='text-lg' />
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

                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users && users.map((user, i) => (

                                < tr key={user.id} className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer" >
                                    <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                                    <td className='whitespace-nowrap py-4 font-normal text-left'>{`${user.name} ${user.lastName}`}</td>
                                    <td className='whitespace-nowrap py-4 font-normal text-left'>{user.profileName}</td>
                                    <td className='whitespace-nowrap py-4 font-normal text-left'>{user.email}</td>
                                    <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                                        <FaEdit className='text-sky-500 hover:text-sky-400' onClick={() => toggleUpdateModal(user.id)} />
                                        <FaTrash className='text-red-500 hover:text-red-400' onClick={() => toggleDeleteModal(user.id)} />
                                    </td>
                                </tr>
                            ))

                        }
                    </tbody>
                </table>
            </div>

            {openUpdateUserModal && 
                <UpdateUserModal 
                    toggleUpdateModal={toggleUpdateModal}
                    lazyUploadUser={lazyUploadUser}
                />
            }

            {openCreateUserModal && 
                <CreateUserModal 
                    toggleCreateModal={toggleCreateModal}
                    refetchUsers={refetchUsers}
                />
            }

            {openDeleteModal && 
                <DeleteModal 
                    toggleDeleteModal={toggleDeleteModal}
                    softDeleteId={softDeleteUserId}
                    deleteAction={handleDelete}
                />
            }
        </div >
    );
}

export default UsersList;