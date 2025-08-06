// router.jsx
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        ),
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/verify",
        element: <Verify />,
    },
    {
        path:"*",
        element:<NotFound />,
    }
],
  {
    future: {
      v7_startTransition: true,
    },
  }
);
