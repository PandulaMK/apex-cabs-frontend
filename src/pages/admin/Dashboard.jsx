import { useEffect, useState } from "react";
import  api  from "../../services/api";
import GaugeCard from "../../components/admin/GaugeCard";
import AdminReminderTest from "./AdminReminderTest";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeRentals: 0,
    pendingPayments: 0,
    maintenanceDue: 0,
  });

  useEffect(() => {
    api.get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err?.response?.data || err.message));
  }, []);

  // scaling: use totalVehicles as reference for the others
  const maxVehicles = Math.max(1, stats.totalVehicles);
  const smallMax = 10;


  return (
  <div>
    <h1>Dashboard</h1>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 240px)", gap: 35 }}>
      <GaugeCard label="Total Vehicles Registered" value={stats.totalVehicles} max={maxVehicles} />
      <GaugeCard label="Active Rentals" value={stats.activeRentals} max={smallMax} />
      <GaugeCard label="Pending Payments" value={stats.pendingPayments} max={smallMax} />
      <GaugeCard label="Vehicles Due for Maintenance" value={stats.maintenanceDue} max={smallMax} />
    </div>

    {/* ✅ Put test panel here so it can use full width */}
    <div style={{ marginTop: 20 }}>
      <AdminReminderTest />
    </div>
  </div>
);
}