import { RouteObject } from "react-router-dom";
import UsersList from "./UsersList";

const userRoutes: RouteObject[] = [
    {
        path: "/users",
        children: [
            {
                path: "",
                element: <UsersList/>
            }
        ]
    }
]

export default userRoutes;