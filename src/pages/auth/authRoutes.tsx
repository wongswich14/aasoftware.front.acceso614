import { RouteObject } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import PasswordRecovery from "./PasswordRecovery";
import ForgotPassword from "./ForgotPassword";

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
        path: '/password-recovery/:email/:token',
        element: <PasswordRecovery />,
    },
    {
        path: '/password-recovery',
        element: <ForgotPassword />,
    }
]