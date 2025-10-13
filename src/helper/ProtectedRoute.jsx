import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { userContext } from "../App";
import LoadingScreen from "../components/elements/LoadingScreen";

const ProtectedRoutes = () => {
  const { user, loading } = useContext(userContext);

  if (loading) return <LoadingScreen />;

  const isAuthenticated = user?.email && user?.user_id;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (user.role === "SuperAdmin") {
    // console.log(user.role);
    return <Navigate to="/superadmin" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
