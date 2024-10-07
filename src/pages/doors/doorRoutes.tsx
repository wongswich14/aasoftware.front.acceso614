import { RouteObject } from "react-router-dom";

import ResidentialDetails from "../residentials/ResidentialDetails.tsx";
import DoorsDetails from "./DoorsDetails.tsx";

const doorRoutes: RouteObject[] = [
    {
        path: "residentials/details/:id/doors",
        children: [
            {
                path: "",
                element: <ResidentialDetails />
            },
            {
                path: "update/:doorsId",
                element: <ResidentialDetails />
            },
            {
                path: "create",
                element: <ResidentialDetails />
            },

        ]
    },
    {
        path: "doors/:id",
        element: <DoorsDetails/>
    }
]

export default doorRoutes;