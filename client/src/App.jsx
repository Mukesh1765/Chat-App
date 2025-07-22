import { createBrowserRouter } from "react-router-dom";
import "./App.css";

import MainPage from "./pages/MainPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Error from "./pages/Error";
import ProtectedRoutes from "./components/ProtectedRoutes";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <MainPage />,
        errorElement: <Error />,
        children: [
            {
                path: "login",
                element: <Login />,
                action: async ({ request }) => {
                    const formData = await request.formData();
                    const name = formData.get("name");
                    const email = formData.get("email");
                    const password = formData.get("password");
                    const bio = formData.get("bio");

                    return {
                        success: true,
                        credentials: { name, email, password, bio },
                    };
                },
            },
            {
                element: <ProtectedRoutes />,
                children: [
                    {
                        index: true,
                        element: <Home />,
                    },
                    {
                        path: "profile",
                        element: <Profile />,
                        action: async ({ request }) => {
                            const formData = await request.formData();
                            const name = formData.get("name") || null;
                            const bio = formData.get("bio") || null;
                            const image = formData.get("image") || null;

                            return {
                                success: true,
                                credentials: { name, bio, image },
                            };
                        },
                    },
                ],
            },
        ],
    },
]);

export default routes;
