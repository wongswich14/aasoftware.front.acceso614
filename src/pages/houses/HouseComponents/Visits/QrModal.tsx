import {QRCodeSVG} from 'qrcode.react';
import {useRef} from "react";
import html2canvas from "html2canvas";
import {IoClose} from "react-icons/io5";
import {CONFIG, Environment} from "@config/config.ts"; // Ensure you're using QRCodeSVG

interface QrCodeModalProps {
    qrCode: string;
    pin: string
    toggleModal: () => void;
    entries: number
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({qrCode, toggleModal, pin, entries}) => {

    const qrRef = useRef<HTMLDivElement>(null);

    let qrUrl = ""

    switch (CONFIG.environment) {
        case Environment.PROD:
            qrUrl = CONFIG.prod.location
            break
        case Environment.DEV:
            qrUrl = CONFIG.dev.location
            break
        case Environment.LOCAL:
            qrUrl = CONFIG.local.location
            break
    }

    const shareToWsp = async () => {
        if (qrRef.current) {
            const canvas = await html2canvas(qrRef.current)
            const image = canvas.toDataURL("image/png")
            const text = "Acceso a la vivienda"
            const encodedText = encodeURIComponent(text)
            const whatsappUrl = `https://wa.me/?text=${encodedText}%0A${image}`
            window.open(whatsappUrl, "_blank")
        }
    }

    const captureScreenshot = async () => {
        if (qrRef.current) {
            const canvas = await html2canvas(qrRef.current)
            const image = canvas.toDataURL("image/png")
            const link = document.createElement("a")
            link.href = image
            link.download = "acceso.png"
            link.click()
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-md w-1/2 max-w-lg relative">

                <IoClose
                    size={25}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={() => toggleModal()}
                />

                <div ref={qrRef} className="flex flex-col gap-7 p-5">
                    <p className="text-3xl text-center">Acceso</p>

                    <div className="flex justify-center">
                        {qrCode && (
                            <QRCodeSVG value={`${qrUrl}/#/visits/${qrCode}`} size={256}/>
                        )}
                    </div>
                    <p className="text-2xl text-center">PIN: {pin}</p>

                    <p className="text-xl text-gray-400 text-center">Válido para: {entries} entradas</p>
                </div>


                <div className="flex mt-5 gap-5">
                    <button onClick={shareToWsp} className="bg-emerald-500 rounded text-sm text-white w-full">
                        Compartir
                    </button>

                    <button onClick={captureScreenshot} className="submit-button w-full">
                        Descargar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QrCodeModal;
