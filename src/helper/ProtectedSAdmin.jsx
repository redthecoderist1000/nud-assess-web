import { useContext } from "react";
import { userContext } from "../App";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedSAdmin() {
  const { user } = useContext(userContext);

  let isSAdmin = user.role == "SuperAdmin";

  return isSAdmin ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedSAdmin;
