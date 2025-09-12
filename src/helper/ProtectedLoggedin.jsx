import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { userContext } from "../App";

function ProtectedLoggedin() {
  const { user } = useContext(userContext);

  const isLoggedIn = user?.email && user?.user_id;

  return isLoggedIn ? <Navigate to="/" /> : <Outlet />;
}

export default ProtectedLoggedin;
