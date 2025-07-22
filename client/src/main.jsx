import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <ChatProvider>
            <RouterProvider router={routes} />
        </ChatProvider>
    </AuthProvider>
);

