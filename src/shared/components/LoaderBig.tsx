import { FaSpinner } from "react-icons/fa";

type LoaderProps = {
    message: string;
}

const LoaderBig: React.FC<LoaderProps> = ({ message }) => {
    return (
        <div>
            <FaSpinner className="animate-spin h-10 w-10" />
            <p className='font-bold'>{message}</p>
        </div>
    )
}

export default LoaderBig;