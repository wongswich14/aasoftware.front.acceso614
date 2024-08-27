import { RouteObject } from "react-router-dom";
import HousesList from "./HousesList";

const houseRoutes: RouteObject[] = [
    {
        path: "/houses",
        children: [
            {
                path: "",
                element: <HousesList/>
            },
            {
                path: "update/:id",
                element: <HousesList/>
            },
            {
                path: "create",
                element: <HousesList/>
            }
        ]
    }
]

export default houseRoutes;