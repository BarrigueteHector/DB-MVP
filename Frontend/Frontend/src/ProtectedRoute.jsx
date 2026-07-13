import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext"

const ProtectedRoute = () => {
    const {loading, isAuthenticated} = useAuth();

    if (!loading && !isAuthenticated) return <Navigate to="/inicio-sesion" />

    return <Outlet/>;
}

export default ProtectedRoute