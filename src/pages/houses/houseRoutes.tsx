import { RouteObject } from "react-router-dom";
import HousesList from "./HousesList";
import HouseDetails from "./HouseDetails.tsx";
import UserHouseDetails from "./HouseComponents/UserHouseDetails.tsx";
import ResidentialDetails from "../residentials/ResidentialDetails.tsx";

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
                path: ":id/no",
                element: <HouseDetails />
            },
            {
                path: ":id/add-user",
                element: <HouseDetails />
            },
            {
                path: ":id/add-rfid",
                element: <HouseDetails />
            },
            {
                path:":id",
                element:<UserHouseDetails/>,
                children: [
                    {
                        path:"doors",
                        element: <ResidentialDetails />,
                        children: [
                            {
                                path:"create",
                                element: <ResidentialDetails />,
                            },
                            {
                                path:"update/:doorId",
                                element: <ResidentialDetails />,
                            }
                        ],
                    },
                    {
                        path:"visits",
                        element: <ResidentialDetails />,
                        children: [
                            {
                                path:"create",
                                element: <ResidentialDetails />,
                            },
                            {
                                path:"update/:visitId",
                                element: <ResidentialDetails />,
                            }
                        ]
                    },
                    {
                        path:"history",
                        element: <ResidentialDetails />,
                        children: [
                            {
                                path:"create",
                                element: <ResidentialDetails />,
                            },
                            {
                                path:"update/historyId",
                                element: <ResidentialDetails />,
                            }
                        ]
                    }
            ]
            }
        ]
    }
]

export default houseRoutes;