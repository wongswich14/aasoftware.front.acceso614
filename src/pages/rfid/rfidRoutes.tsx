import { RouteObject } from "react-router-dom";
import RfidList from "./RfidList";

const rfidRoutes: RouteObject[] = [
    {
        path: "/rfid",
        children: [
            {
                path: "",
                element: <RfidList />
            },
            {
                path: "update/:id",
                element: <RfidList />
            },
            {
                path: 'create',
                element: <RfidList />
            }
        ]
    }
]

export default rfidRoutes;