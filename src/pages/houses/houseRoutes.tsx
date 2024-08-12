import { RouteObject } from "react-router-dom";
import HousesList from "./HousesList";

const houseRoutes: RouteObject[] = [
    {
        path: "/houses",
        children: [
            {
                path: "",
                element: <HousesList/>
            }
        ]
    }
]

export default houseRoutes;