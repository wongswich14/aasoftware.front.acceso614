import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useTokenQuery } from "../features/authServerApi";
import { saveUserInfo, authenticate, selectIsAuthenticated, selectUserData } from "../slices/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import LoaderBig from "src/shared/components/LoaderBig";


const PrivateRoute: React.FC = () => {

    const isAuthenticated = useSelector(selectIsAuthenticated)
    const storagedToken = localStorage.getItem("auth");
    const parsedToken = storagedToken ? JSON.parse(storagedToken) : null;
    const [isAllowed, setIsAllowed] = useState<boolean | null>(isAuthenticated)

    /*
        No se hace la consulta si ya se tiene la información del usuario o no hay token que validar
     */
    const { data: tokenData, isLoading: tokenLoading } = useTokenQuery(undefined, { skip: isAuthenticated === true || !parsedToken })

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
                    token,
                    profileName: tokenData.dataObject.profileName,
                }));
                dispatch(authenticate(true));
                setIsAllowed(true);
            } else {
                setIsAllowed(false);
            }
        }
    }, [tokenData, dispatch, tokenLoading, isAuthenticated])

    if (isAllowed === null) {
        return <LoaderBig message={'Espere...'} />
  
    }

    if (!isAllowed) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;