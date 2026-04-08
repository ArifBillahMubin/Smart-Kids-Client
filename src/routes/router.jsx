import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import AuthLayout from "../layout/AuthLayout";
import Home from "../pages/home/home/Home";
import Resister from "../pages/auth/resister/Resister";
import Login from "../pages/auth/login/Login";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            { index: true, Component: Home },
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            { path: 'register', Component: Resister },
            { path: 'login',    Component: Login    },
        ]
    }
]);
