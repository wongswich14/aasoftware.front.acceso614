import { RouteObject } from "react-router-dom";
import ResidentialsList from "./ResidentialsList";
import ResidentialDetails from "./ResidentialDetails";

const residentialRoutes: RouteObject[] = [
    {
        path: "/residentials",
        children: [
            {
                path: "",
                element: <ResidentialsList />,
            },
            {
                path: "update/:id",
                element: <ResidentialsList />,
            },
            {
                path: "create",
                element: <ResidentialsList />,
            },
            {
                path: ":id",
                element: <ResidentialDetails />,
            },
        ]
    }
]

export default residentialRoutes;