import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoutes = () => {
    const { authUser, loading } = useContext(AuthContext);

    if (loading) return <div className="text-center p-5">Loading...</div>;

    return authUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
