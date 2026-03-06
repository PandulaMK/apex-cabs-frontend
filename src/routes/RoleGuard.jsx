import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RoleGuard({ allow = [] }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const role = user?.role; // ✅ best source

  // not logged in
  if (!token || !role) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // logged in but not allowed
  if (!allow.includes(role)) {
    // you can change this redirect if you want
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}