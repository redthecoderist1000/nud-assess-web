import React, { useContext } from "react";
import { userContext } from "../App";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedAdmin() {
  const userCon = useContext(userContext);

  let isAdmin = userCon.user.role == "Admin" ? true : false;

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedAdmin;
