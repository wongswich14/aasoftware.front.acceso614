import {useParams} from "react-router-dom";
import LoaderBig from "../../shared/components/LoaderBig.tsx";
import {useReadQrCodeQuery} from "../../core/features/logDoorsVisitServerApi.ts";
import React from "react";

const VisitQrDetails = () => {

    const { qrCode } = useParams<string>();

    const { isLoading, isError, data } = useReadQrCodeQuery(qrCode!, {skip: !qrCode});

    if (isLoading) return <LoaderBig />

    if (isError) return (
        <div className="flex items-center justify-center text-2xl">
            Accesos agotados
        </div>
    )

    if (!data?.dataObject) return null;
    const { home, typeOfVisits, name, lastName, entries, pin, createdDate, limitDate } = data.dataObject;

    return (
        <div className='w-full bg-white min-h-full rounded-md'>
            <div
                className='flex gap-2 items-center text-sm text-gray-500 font-semibold border-b pl-5 pt-5 w-[95%] ml-5'>
                <h2 className='p-2 text-lg'>Detalles de la Visita</h2>

            </div>

            <div className="text-gray-500 font-semibold borde p-5 w-[95%] ml-5 mt-5 oerflow-auto flex flex-col gap-5 text-xl">
                <div>
                    <span className="font-medium">Casa:</span> {home.name}
                </div>
                <div>
                    <span className="font-medium">Tipo de Visita:</span> {typeOfVisits.name}
                </div>
                <div>
                    <span className="font-medium">Visitante:</span> {name} {lastName}
                </div>
                <div>
                    <span className="font-medium">Entradas permitidas:</span> {entries}
                </div>
                {/*<div>*/}
                {/*    <span className="font-medium">PIN de acceso:</span> {pin}*/}
                {/*</div>*/}
                <div>
                    <span className="font-medium">Fecha de creación:</span> {new Date(createdDate).toLocaleDateString()}
                </div>
                <div>
                    <span className="font-medium">Fecha límite:</span> {new Date(limitDate).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}

export default VisitQrDetails;