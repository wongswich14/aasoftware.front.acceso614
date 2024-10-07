import { useEffect, useState } from "react"
import { FaEdit, FaPlusCircle, FaTrash } from "react-icons/fa"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { useListProfilesQuery, useSoftDeleteProfileMutation } from "src/core/features/profileServerApi"
import { ProfileDto } from "src/core/models/dtos/profiles/profileDto"
import UpdateProfileModal from "./UpdateProfileModal"
import CreateProfileModal from "./CreateProfileModal"
import DeleteModal from "src/shared/components/DeleteModal"
import SkeletonTable from "src/shared/components/SkeletonTable"
import { toast } from "sonner"

const ProfilesList: React.FC = () => {

    const [profiles, setProfiles] = useState<ProfileDto[] | null>(null)
    const [softDeleteProfileId, setSoftDeleteProfileId] = useState<string>("")
    const [openUpdateProfileModal, setOpenUpdateProfileModal] = useState<boolean>(false)
    const [openCreateProfileModal, setOpenCreateProfileModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

    const { data: profilesData, isLoading: profilesIsLoading } = useListProfilesQuery()
    const [softDelete] = useSoftDeleteProfileMutation()

    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{id: string}>()

    const handleDelete =  async (id: string) => {
        const softDeletePromise = softDelete(id).unwrap()

        toast.promise(softDeletePromise, {
            loading: "Eliminando...",
            success: () => {
                toggleDeleteModal()
                return "Perfil eliminado"
            },
            error: (err) => {
                console.error(err)
                return "Error al eliminar perfil"
            }
        })
    }

    const toggleUpdateModal = (id?: string) => {
        setOpenUpdateProfileModal(!openUpdateProfileModal)
        if(id) {
            navigate(`/profiles/update/${id}`)
        } else {
            navigate(`/profiles`)
        }
    }

    const toggleCreateModal = (id?: string) => {
        setOpenCreateProfileModal(!openCreateProfileModal)
        if(id) {
            navigate(`/profiles/create`)
        } else {
            navigate(`/profiles`)
        }
    }

    const toggleDeleteModal = (id?: string) => {
        if (id) {
            setSoftDeleteProfileId(id)
        } else {
            setSoftDeleteProfileId("")
        }
        setOpenDeleteModal(!openDeleteModal)
    }

    useEffect(() => {
        if (profilesData && !profilesIsLoading) {
            setProfiles(profilesData.listDataObject || [])
        }
    }, [profilesData, profilesIsLoading])

    useEffect(() => {
        if (id) {
            setOpenUpdateProfileModal(true)
        } else {
            setOpenUpdateProfileModal(false)
        }
            
        if (location.pathname.includes("create")) {
            setOpenCreateProfileModal(true)   
        } else {
            setOpenCreateProfileModal(false)
        }
    }, [id, location])

    if (profilesIsLoading) return <SkeletonTable />

    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>Listado de Perfiles</h2>
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
                            <th className='text-left'>Título</th>
                            <th className='text-left'>Descripción</th>

                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            profiles && profiles.map((profile, i) => (

                                < tr key={profile.id} className="border-b text-gray-700 dark:border-neutral-500 hover:bg-blue-500/5 hover:cursor-pointer" >
                                    <td className='text-center whitespace-nowrap py-4 font-normal'>{i + 1}</td>
                                    <td className='whitespace-nowrap py-4 font-normal text-left'>{profile.title}</td>
                                    <td className='whitespace-nowrap py-4 font-normal text-left'>{profile.description}</td>
                                    <td className='flex gap-6 items-center justify-center ml-5 py-4'>
                                        <FaEdit className='text-sky-500 hover:text-sky-400' onClick={() => toggleUpdateModal(profile.id)} />
                                        <FaTrash className='text-red-500 hover:text-red-400' onClick={() => toggleDeleteModal(profile.id)} />
                                    </td>
                                </tr>
                            ))

                        }
                    </tbody>
                </table>
            </div>

            {openUpdateProfileModal && 
                <UpdateProfileModal 
                    toggleUpdateModal={toggleUpdateModal}
                />
            }

            {openCreateProfileModal && 
                <CreateProfileModal 
                    toggleCreateModal={toggleCreateModal}
                />
            }

            {openDeleteModal && 
                <DeleteModal 
                    toggleDeleteModal={toggleDeleteModal}
                    softDeleteId={softDeleteProfileId}
                    deleteAction={handleDelete}
                />
            }
        </div >
    )
}

export default ProfilesList