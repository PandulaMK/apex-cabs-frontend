import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import OwnerLayout from "../layouts/OwnerLayout";

import Home from "../pages/Home";
import Vehicles from "../pages/Vehicles";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";

import Dashboard from "../pages/admin/Dashboard";
import RoleGuard from "./RoleGuard";
import Users from "../pages/admin/Users";
import AdminVehicles from "../pages/admin/Vehicles";
import AdminBookings from "../pages/admin/Bookings";
import AdminOwners from "../pages/admin/Owners";
import AdminPayments from "../pages/admin/Payments";
import AdminMaintenance from "../pages/admin/Maintenance";

import OwnerDashboard from "../pages/owner/OwnerDashboard";
import OwnerVehicles from "../pages/owner/OwnerVehicles";
import OwnerBookings from "../pages/owner/Bookings";
import OwnerPayments from "../pages/owner/Payments";
import OwnerMaintenance from "../pages/owner/Maintenance";
import PaymentGateway from "../pages/PaymentGateway";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ Public/Customer layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<PaymentGateway />} />

        {/* ✅ Customer-only pages */}
        <Route element={<RoleGuard allow={["customer"]} />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* ✅ Admin-only layout */}
      <Route element={<RoleGuard allow={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="owners" element={<AdminOwners />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="maintenance" element={<AdminMaintenance />} />
          
        </Route>
      </Route>

      {/* ✅ Owner-only layout */}
      <Route element={<RoleGuard allow={["owner"]} />}>
        <Route path="/owner" element={<OwnerLayout />}>
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="vehicles" element={<OwnerVehicles />} />
          <Route path="bookings" element={<OwnerBookings />} />
          <Route path="payments" element={<OwnerPayments />} />
          <Route path="maintenance" element={<OwnerMaintenance />} />
        </Route>
      </Route>

      {/* optional: fallback */}
      <Route path="*" element={<div style={{ padding: 30 }}>404 Not Found</div>} />
    </Routes>
  );
}