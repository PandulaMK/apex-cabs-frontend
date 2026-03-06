import { Outlet, NavLink } from "react-router-dom";
import "./admin.css";     // keep same admin layout structure
import "./owner.css";     // override only colors
const navigate = useNavigate();
export default function OwnerLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="admin-container owner-theme">
      <aside className="sidebar">
        <h2>Hello {user?.full_name || "Owner"}</h2>

        <NavLink to="/owner/dashboard">Dashboard</NavLink>
        <NavLink to="/owner/vehicles">Vehicles</NavLink>
        <NavLink to="/owner/bookings">Bookings</NavLink>
        <NavLink to="/owner/payments">Payments</NavLink>
        <NavLink to="/owner/maintenance">Maintenance</NavLink>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
localStorage.removeItem("user");
localStorage.removeItem("role");
navigate("/login", { replace: true });
          }}
        >
          Logout
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}