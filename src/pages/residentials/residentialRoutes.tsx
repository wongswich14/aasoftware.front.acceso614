import { RouteObject } from "react-router-dom";
import ResidentialsList from "./ResidentialsList";
import ResidentialDetails from "./ResidentialDetails";

const residentialRoutes: RouteObject[] = [
    {
        path: "residentials",
        children: [
            {
                path: "",
                element: <ResidentialsList />,
            },
            {
                path: "update/:id",
                element: <ResidentialsList />,
            },
            {
                path: "create",
                element: <ResidentialsList />,
            },
            {
                path: ":id",
                element: <ResidentialDetails />,
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

            },
        ]
    }
]

export default residentialRoutes;