import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/home/home/Home";

export const router = createBrowserRouter([
    {
        path: "/",
        Component:RootLayout,
            children:[
                {
                    index:true,
                    Component: Home
                },
                {
                    
                }
            ]
    }
]);