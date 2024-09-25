import { RouteObject } from "react-router-dom";
import HousesList from "./HousesList";
import HouseDetails from "./HouseDetails.tsx";

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
            },
            {
                path: "details/:id",
                element: <HouseDetails />
            }
        ]
    }
]

export default houseRoutes;