import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const ErrorBoundary: React.FC = () => {

    const error = useRouteError()

    if (isRouteErrorResponse(error)) {
        console.info(error  )
    }
    else {
        console.info(error)
    }

    return (
        <h1>
            Tilin
        </h1>
    )
}

export default ErrorBoundary