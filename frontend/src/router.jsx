// router.jsx
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Verify from "./pages/Verify";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/verify",
        element: <Verify />,
    },

],
  {
    future: {
      v7_startTransition: true,
    },
  }
);
