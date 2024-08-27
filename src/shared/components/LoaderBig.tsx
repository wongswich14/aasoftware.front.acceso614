import { FaSpinner } from "react-icons/fa";

type LoaderProps = {
    message: string;
}

const LoaderBig: React.FC<LoaderProps> = ({ message }) => {
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-40">
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-300 bg-opacity-50 blur-lg z-50" />
            <div className="flex flex-col items-center">
                <FaSpinner className="animate-spin h-10 w-10" />
                <p className='font-bold'>{message}</p>
            </div>
        </div>
    )
}

export default LoaderBig;