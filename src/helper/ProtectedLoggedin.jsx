import React, { useContext } from "react";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "./Supabase";
import { userContext } from "../App";

function ProtectedLoggedin() {
  const navigate = useNavigate();
  const userCon = useContext(userContext);
  let isLoggedIn = false;

  if (userCon.user.email && userCon.user.user_id) {
    isLoggedIn = true;
  }

  return isLoggedIn ? <Navigate to="/dashboard" /> : <Outlet />;
}

export default ProtectedLoggedin;
