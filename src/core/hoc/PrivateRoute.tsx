import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useTokenQuery } from "../features/authServerApi";
import { saveUserInfo, authenticate } from "../slices/auth/authSlice";
import { useDispatch } from "react-redux";

interface PrivateRouteProps {
    isAllowed: boolean
}

const PrivateRoute: React.FC = () => {

    const { data: tokenData, error: tokenError } = useTokenQuery()
    const dispatch = useDispatch()

    // const isAllowed = selectIsAuthenticated(store.getState())
    const isAllowed = !tokenError
    if (isAllowed && tokenData?.dataObject) {
        dispatch(saveUserInfo({
            id: tokenData.dataObject.id,
            name: tokenData.dataObject.name,
            lastName: tokenData.dataObject.lastName,
            email: tokenData.dataObject.email,
            token: tokenData.token ?? (() => {
                const authData = localStorage.getItem('auth');
                return authData ? JSON.parse(authData) : "";
            })()
        }))
        dispatch(authenticate(isAllowed))
    }


    if (!isAllowed) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;