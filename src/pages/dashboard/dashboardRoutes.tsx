import { RouteObject } from "react-router-dom";
import Dashboard from "./Dasboard";

const dashboardRoutes: RouteObject[] = [
    {
        path: '',
        element: <Dashboard />,
    }
]

export default dashboardRoutes;