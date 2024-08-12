import { RouteObject } from "react-router-dom";
import LayoutAdmin from "./shared/layout/LayoutAdmin";
import PrivateRoute from "./core/hoc/PrivateRoute";
import dashboardRoutes from "./pages/dashboard/dashboardRoutes";
import { selectIsAuthenticated } from "./core/slices/auth/authSlice";
import store from "./core/store";
import { authRoutes } from "./pages/auth/authRoutes";
import residentialRoutes from "./pages/residentials/residentialRoutes";
import houseRoutes from "./pages/houses/houseRoutes";
import userRoutes from "./pages/users/userRoutes";

const isAllowed = selectIsAuthenticated(store.getState())

const appRoutes: RouteObject[] = [
    {
        path: '/',
        element: <LayoutAdmin />,
        children: [
            {
                element: <PrivateRoute isAllowed={isAllowed} />,
                children: [
                    ...dashboardRoutes,
                    ...residentialRoutes,
                    ...houseRoutes,
                    ...userRoutes
                ]
            }
        ],
    },
    ...authRoutes
]

export default appRoutes;