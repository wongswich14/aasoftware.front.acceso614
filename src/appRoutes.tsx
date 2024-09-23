import { RouteObject } from "react-router-dom";
import LayoutAdmin from "./shared/layout/LayoutAdmin";
import PrivateRoute from "./core/hoc/PrivateRoute";
import dashboardRoutes from "./pages/dashboard/dashboardRoutes";
import { authRoutes } from "./pages/auth/authRoutes";
import residentialRoutes from "./pages/residentials/residentialRoutes";
import houseRoutes from "./pages/houses/houseRoutes";
import userRoutes from "./pages/users/userRoutes";
import profileRoutes from "./pages/profiles/profileRoutes";
import NotFoundError from "./shared/errors/NotFoundError";
import rfidRoutes from "./pages/rfid/rfidRoutes";
import doorRoutes from "./pages/doors/doorRoutes";


const appRoutes: RouteObject[] = [
    {
        path: '/',
        element: <PrivateRoute />,
        children: [
            {
                element: <LayoutAdmin />,
                children: [
                    ...dashboardRoutes,
                    ...residentialRoutes,
                    ...houseRoutes,
                    ...userRoutes,
                    ...profileRoutes,
                    ...rfidRoutes,
                    ...doorRoutes
                ]
            }
        ],
        errorElement: <NotFoundError/>
    },
    ...authRoutes
]

export default appRoutes;