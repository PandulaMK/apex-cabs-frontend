import React, { useEffect, useState } from "react";
import api from "../../services/api";
import OwnerGaugeCard from "../../components/owner/OwnerGaugeCard";

export default function OwnerDashboard() {
  const [stats, setStats] = useState({
    activeRentals: 0,
    pendingPayments: 0,
    dueForMaintenance: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/owner/stats?ts=" + Date.now());
        setStats({
          activeRentals: Number(res.data?.activeRentals || 0),
          pendingPayments: Number(res.data?.pendingPayments || 0),
          dueForMaintenance: Number(res.data?.dueForMaintenance || 0),
        });
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Dashboard</h2>

      <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
        <OwnerGaugeCard title="Active Rentals" value={stats.activeRentals} max={50} />
        <OwnerGaugeCard title="Pending Payments" value={stats.pendingPayments} max={50} />
        <OwnerGaugeCard title="Vehicles Due for Maintenance" value={stats.dueForMaintenance} max={50} />
      </div>
    </div>
  );
}