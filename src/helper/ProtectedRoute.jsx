import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { userContext } from "../App";

const ProtectedRoutes = () => {
  const userCon = useContext(userContext);
  let isAuthtenticated = false;

  if (userCon.user.email && userCon.user.user_id) {
    isAuthtenticated = true;
  }

  return userCon.user.email && userCon.user.user_id ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoutes;
