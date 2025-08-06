import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/UserContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";

export const server = "http://localhost:5000";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <ChatProvider>
        <RouterProvider router={router}/>
      </ChatProvider>
    </UserProvider>
  </React.StrictMode>
);
