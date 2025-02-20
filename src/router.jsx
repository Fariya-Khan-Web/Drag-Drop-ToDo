import {
    createBrowserRouter,
  } from "react-router-dom";
import Login from "./components/auth/Login";
import App from "./App";
import Private from "./components/Private/Private";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Private><App/></Private>,
    },
    {
        path:"/auth",
        element: <Login/>
    }
]);

export default router; 