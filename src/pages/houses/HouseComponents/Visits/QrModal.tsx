import { QRCodeSVG } from 'qrcode.react'; // Ensure you're using QRCodeSVG

interface QrCodeModalProps {
    isOpen: boolean;
    qrCode: string;
    onClose: () => void;
}
const QrCodeModal : React.FC<QrCodeModalProps> = ({ isOpen, qrCode, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-md w-1/2 max-w-lg flex flex-col gap-10"> {/* Increased padding and set width */}
                <h2 className="text-lg font-bold mb-4">QR Code</h2>
                <div className="flex justify-center mb-4">
                    {qrCode && (
                        <QRCodeSVG value={qrCode} size={256} />
                    )}
                </div>
                <p>
                    Para compatir tomar captura de pantalla
                </p>
                <div className="w-full flex flex-col-reverse">
                    <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QrCodeModal;
