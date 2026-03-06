import { Outlet, NavLink } from "react-router-dom";
import "./admin.css";

export default function AdminLayout() {
  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2>Hello Admin</h2>

        <NavLink to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/vehicles">Vehicles</NavLink>
        <NavLink to="/admin/bookings">Bookings</NavLink>
        <NavLink to="/admin/owners">Vehicle Owners</NavLink>
        <NavLink to="/admin/payments">Payments</NavLink>
        <NavLink to="/admin/maintenance">Maintenance</NavLink>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
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