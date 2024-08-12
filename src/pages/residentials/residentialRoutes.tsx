import { RouteObject } from "react-router-dom";
import ResidentialsList from "./ResidentialsList";

const residentialRoutes: RouteObject[] = [
    {
        path: "/residentials",
        children: [
            {
                path: "",
                element: <ResidentialsList />,
            }
        ]
    }
]

export default residentialRoutes;