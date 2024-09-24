import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useGetHouseQuery } from "src/core/features/houseServerApi";
import { HouseDto } from "src/core/models/dtos/houses/houseDto";
import LoaderBig from "src/shared/components/LoaderBig";

interface HouseDetailsModalProps {
    toggleModal: () => void
    id: string
}

const HouseDetailsModal: React.FC<HouseDetailsModalProps> = ({ toggleModal, id }) => {
    const [house, setHouse] = useState<HouseDto>()

    const { data: houseData, isFetching: houseIsFetching } = useGetHouseQuery(id, { skip: id === "" })

    useEffect(() => {
        if (houseData && !houseIsFetching) {
            setHouse(houseData.dataObject)
        }
    }, [houseData, houseIsFetching])

    if (houseIsFetching) return <LoaderBig />

    return (
        <article className="fixed inset-0 flex justify-center items-center z-40 bg-black bg-opacity-70">
            <section className="bg-white rounded-lg p-6 relative w-[60%] max-h-[80vh] overflow-y-auto shadow-xl">
                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer text-gray-600"
                    onClick={() => toggleModal()}
                />

                {/* Título */}
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-4">
                    {house?.name}
                </h2>

                <div className="mt-6 space-y-6">

                    {/* Residencial */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-600">Residencial</h4>
                        <p className="text-gray-500">{house?.residential?.name} - {house?.residential?.description}</p>
                    </div>

                    {/* Usuario principal (Responsable) */}
                    {house?.principal && (
                        <div className="p-4 bg-slate-100 rounded-md shadow-md">
                            <h4 className="text-lg font-semibold text-gray-700">Responsable de la Casa</h4>
                            {house?.principal && (
                                <div className="mt-2">
                                    <p className="text-gray-700 font-medium">
                                        {house.principal.name} {house.principal.lastName}
                                    </p>
                                    <p className="text-gray-500">{house.principal.email}</p>
                                    <span className="text-sm text-green-600">(Usuario Principal)</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Usuarios que habitan la casa */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-600">Habitantes</h4>
                        {house?.users?.length ? (
                            <ul className="space-y-2 mt-2">
                                {house.users.map(user => (
                                    <li key={user.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-gray-700 font-medium">{user.name} {user.lastName}</p>
                                                <p className="text-gray-500">{user.email}</p>
                                            </div>
                                            {user.isPrincipal && <span className="text-xs text-green-500">(Principal)</span>}
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
                        <h4 className="text-lg font-semibold text-gray-600">Tarjetas de Acceso (RFID)</h4>
                        {house?.rfids?.length ? (
                            <ul className="space-y-2 mt-2">
                                {house.rfids.map(rfid => (
                                    <li key={rfid.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
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
            </section>
        </article>
    );
};


export default HouseDetailsModal;