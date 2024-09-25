import { RouteObject } from "react-router-dom";
import VisitsList from "./VisitList.tsx";
import VisitList from "./VisitList.tsx";

const houseRoutes: RouteObject[] = [
    {
        path: ":doorId/visits",
        children: [
            {
                path: "",
                element: <VisitsList/>
            },
            {
                path: "update/:id",
                element: <VisitList/>
            },
            {
                path: "create",
                element: <VisitsList/>
            }
        ]
    }
]

export default houseRoutes;