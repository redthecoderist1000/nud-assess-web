import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { userContext } from "../App";
import { supabase } from "./Supabase";

const ProtectedRoutes = () => {
  const userCon = useContext(userContext);
  let isAuthenticated = false;

  if (userCon.user.email && userCon.user.user_id) {
    isAuthenticated = true;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
