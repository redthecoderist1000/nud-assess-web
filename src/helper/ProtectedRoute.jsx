import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { userContext } from "../App";
import { supabase } from "./Supabase";

const ProtectedRoutes = () => {
  const { user, loading } = useContext(userContext);

  if (loading) return <div>Loading...</div>;

  const isAuthenticated = user?.email && user?.user_id;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
