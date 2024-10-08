import {RouteObject} from "react-router-dom";
import VisitQrDetails from "./VisitQrDetails.tsx";

const visitRoutes: RouteObject[] = [
    {
        path: "/visits",
        children: [{
            path: ":qrCode",
            element: <VisitQrDetails/>
        }]
    }
]

export default visitRoutes;