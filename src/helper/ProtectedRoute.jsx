import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { userContext } from "../App";
import { supabase } from "./Supabase";
import LoadingScreen from "../components/elements/LoadingScreen";

const ProtectedRoutes = () => {
  const { user, loading } = useContext(userContext);

  if (loading) return <LoadingScreen />;

  // for testing purposes, force loading screen, uncomment this
  // if (true) return <LoadingScreen />;

  const isAuthenticated = user?.email && user?.user_id;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
