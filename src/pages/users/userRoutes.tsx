import { RouteObject } from "react-router-dom";
import UsersList from "./UsersList";

const userRoutes: RouteObject[] = [
    {
        path: "/users",
        children: [
            {
                path: "",
                element: <UsersList/>
            },
            {
                path: "update/:id",
                element: <UsersList/>
            },
            {
                path: 'create',
                element: <UsersList/>
            }
        ]
    }
]

export default userRoutes;