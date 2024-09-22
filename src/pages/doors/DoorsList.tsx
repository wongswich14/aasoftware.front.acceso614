import { FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const DoorsList = () => {
    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>Listado de Puertas</h2>
                <Link to={'create'} className='flex items-center text-sky-500 hover:text-sky-400 gap-1'>
                    <FaPlusCircle className='text-lg' />
                    <span className="text-base">Nueva</span>
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
                            // users && users.map((user, i) => (

                            //     < tr key={user.id} className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer" >
                            //         <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                            //         <td className='whitespace-nowrap py-4 font-normal text-left'>{`${user.name} ${user.lastName}`}</td>
                            //         <td className='whitespace-nowrap py-4 font-normal text-left'>{user.profileName}</td>
                            //         <td className='whitespace-nowrap py-4 font-normal text-left'>{user.email}</td>
                            //         <td className='whitespace-nowrap py-4 font-normal text-left'>{user.residential?.name || "N/A"}</td>
                            //         {/* <td className='whitespace-nowrap py-4 font-normal text-left'>{user.home?.id || "N/A" }</td> */}
                            //         <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                            //             <FaEdit className='text-sky-500 hover:text-sky-400' onClick={() => toggleUpdateModal(user.id)} />
                            //             <FaTrash className='text-red-500 hover:text-red-400' onClick={() => toggleDeleteModal(user.id)} />
                            //         </td>
                            //     </tr>
                            // ))

                        }
                    </tbody>
                </table>
            </div>

            {/* {openUpdateUserModal && 
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
            } */}
        </div >
    );
}

export default DoorsList;