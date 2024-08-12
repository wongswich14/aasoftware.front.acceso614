import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
    isAllowed: boolean
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAllowed }) => {
    if (!isAllowed) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;