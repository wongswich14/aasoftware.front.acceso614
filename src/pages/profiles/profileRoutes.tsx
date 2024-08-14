import { RouteObject } from "react-router-dom";
import ProfilesList from "./ProfilesList";

const profileRoutes: RouteObject[] = [
    {
        path: "/profiles",
        children: [
            {
                path: "",
                element: <ProfilesList/>
            },
            {
                path: "update/:id",
                element: <ProfilesList/>
            },
            {
                path: 'create',
                element: <ProfilesList/>
            }
        ]
    }
]

export default profileRoutes;