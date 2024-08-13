import { RouteObject } from "react-router-dom";
import ProfilesList from "./ProfilesList";

const profileRoutes: RouteObject[] = [
    {
        path: "/profiles",
        children: [
            {
                path: "",
                element: <ProfilesList/>
            }
        ]
    }
]

export default profileRoutes;