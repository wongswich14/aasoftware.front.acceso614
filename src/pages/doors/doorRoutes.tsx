import { RouteObject } from "react-router-dom";
import DoorsList from "./DoorsList";

const doorRoutes: RouteObject[] = [
    {
        path: "/doors",
        children: [
            {
                path: "",
                element: <DoorsList />
            },
            {
                path: "update/:id",
                element: <DoorsList />
            },
            {
                path: "create",
                element: <DoorsList />
            }
        ]
    }
]

export default doorRoutes;