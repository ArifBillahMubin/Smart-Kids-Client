import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/home/home/Home";
import AuthLayout from "../layout/AuthLayout";
import Resister from "../pages/auth/Resister/Resister";

export const router = createBrowserRouter([
    {
        path: "/",
        Component:RootLayout,
            children:[
                {
                    index:true,
                    Component: Home
                },
            ]
    },
    {
        path:'/',
        Component:AuthLayout,
        children:[
            {
                path: 'register',
                Component: Resister
            }
        ]
    }
]);