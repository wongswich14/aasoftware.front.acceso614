import { IoClose } from "react-icons/io5"
import dangerIcon from "@assets/icons/danger.png"

interface DeleteModalProps {
    toggleDeleteModal: (id?: string) => void
    softDeleteId: string
    deleteAction: (id: string) => void
}

const DeleteModal: React.FC<DeleteModalProps> = ({ toggleDeleteModal, softDeleteId, deleteAction }) => {
    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70 ">
            <section className="bg-white rounded-lg p-12 relative min-w-[40%]">
                <IoClose
                    size={28}
                    className="absolute top-7 right-7 cursor-pointer"
                    onClick={() => toggleDeleteModal()}
                />

                <img src={dangerIcon} alt="Danger" />

                <p className="text-center text-4xl font-semibold my-7">
                    ¿Estás seguro?
                </p>

                <p className="text-center text-lg mb-10">
                    Este proceso no se puede deshacer.
                </p>

                <div className="flex gap-7 justify-center text-white font-medium text-lg">
                    <button
                        className="bg-gray-400 rounded-lg px-7 py-1 "
                    onClick={() => toggleDeleteModal()}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-red-400 rounded-lg px-7 py-1"
                        onClick={() => deleteAction(softDeleteId)}
                    >
                        Eliminar
                    </button>
                </div>
            </section>
        </article>
    )
}

export default DeleteModal