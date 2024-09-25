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
                path: ":id",
                element: <HouseDetails />
            },
            {
                path: ":id/add-user",
                element: <HouseDetails />
            },
            {
                path: ":id/add-rfid",
                element: <HouseDetails />
            }
        ]
    }
]

export default houseRoutes;