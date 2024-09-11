import { RouteObject } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import PasswordRecovery from "./PasswordRecovery";

export const authRoutes: RouteObject[] = [
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/password-recovery/:token',
        element: <PasswordRecovery />,
    }
]