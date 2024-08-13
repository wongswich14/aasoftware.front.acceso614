import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useTokenQuery } from "../features/authServerApi";
import { saveUserInfo, authenticate, selectIsAuthenticated } from "../slices/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import LoaderBig from "src/shared/components/LoaderBig";


const PrivateRoute: React.FC = () => {

    const isAuthenticated = useSelector(selectIsAuthenticated)
    const [isAllowed, setIsAllowed] = useState<boolean | null>(isAuthenticated)

    /*
        No se hace la consulta si ya se tiene la información del usuario
     */
    const { data: tokenData, isLoading: tokenLoading } = useTokenQuery(undefined, { skip: isAuthenticated === true })

    const dispatch = useDispatch()


    useEffect(() => {
        if (!tokenLoading && !isAuthenticated) {
            console.log(tokenData)
            if (tokenData?.dataObject) {
                const token = tokenData.token ?? (() => {
                    const authData = localStorage.getItem('auth');
                    return authData ? JSON.parse(authData) : "";
                })();

                dispatch(saveUserInfo({
                    id: tokenData.dataObject.id,
                    name: tokenData.dataObject.name,
                    lastName: tokenData.dataObject.lastName,
                    email: tokenData.dataObject.email,
                    token
                }));
                dispatch(authenticate(true));
                setIsAllowed(true);
            } else {
                setIsAllowed(false);
            }
        }
    }, [tokenData, dispatch, tokenLoading, isAuthenticated])

    if (isAllowed === null) {
        return (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-40">
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-300 bg-opacity-50 blur-lg z-50" />
                <LoaderBig message={'Espere...'} />
            </div>
        )
    }

    if (!isAllowed) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;