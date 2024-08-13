import { RouteObject } from "react-router-dom";
import LayoutAdmin from "./shared/layout/LayoutAdmin";
import PrivateRoute from "./core/hoc/PrivateRoute";
import dashboardRoutes from "./pages/dashboard/dashboardRoutes";
import { authRoutes } from "./pages/auth/authRoutes";
import residentialRoutes from "./pages/residentials/residentialRoutes";
import houseRoutes from "./pages/houses/houseRoutes";
import userRoutes from "./pages/users/userRoutes";
import profileRoutes from "./pages/profiles/profileRoutes";


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
                    ...profileRoutes
                ]
            }
        ],
    },
    ...authRoutes
]

export default appRoutes;