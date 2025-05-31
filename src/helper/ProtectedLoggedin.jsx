import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { userContext } from "../App";

function ProtectedLoggedin() {
  const userCon = useContext(userContext);
  let isLoggedIn = false;

  if (userCon.user.email && userCon.user.user_id) {
    isLoggedIn = true;
  }

  return isLoggedIn ? <Navigate to="/dashboard" /> : <Outlet />;
}

export default ProtectedLoggedin;
