import { QRCodeSVG } from 'qrcode.react'; // Ensure you're using QRCodeSVG

interface QrCodeModalProps {
    qrCode: string;
    pin: string
    toggleModal: () => void;
}
const QrCodeModal : React.FC<QrCodeModalProps> = ({ qrCode, toggleModal, pin }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-md w-1/2 max-w-lg flex flex-col gap-10"> {/* Increased padding and set width */}
                <h2 className="text-lg font-bold mb-4">QR Code</h2>
                <div className="flex justify-center mb-4">
                    {qrCode && (
                        <QRCodeSVG value={qrCode} size={256} />
                    )}
                </div>
                <p>{ pin }</p>
                <p>
                    Para compatir tomar captura de pantalla
                </p>
                <div className="w-full flex flex-col-reverse">
                    <button onClick={() => toggleModal()} className="cancel-button">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QrCodeModal;
