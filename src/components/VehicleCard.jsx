import { useState } from "react";

export default function VehicleCard({ vehicle, selected, onSelect }) {
  const [hover, setHover] = useState(false);

  if (!vehicle) return null;

  const price = Number(vehicle?.daily_rate ?? 0).toLocaleString();

  // ✅ fixed image URL
  const imgSrc = vehicle.image_path
    ? vehicle.image_path.startsWith("http")
      ? vehicle.image_path
      : `${import.meta.env.VITE_API_URL}${vehicle.image_path}`
    : "/no-car.png";

  const cardStyle = {
    border: selected ? "2px solid #2563EB" : "1px solid #E2E8F0",
    borderRadius: 16,
    padding: 14,
    width: 270,
    cursor: "pointer",
    background: "#fff",
    transition: "all 220ms ease",
    boxShadow: selected
      ? "0 14px 30px rgba(37, 99, 235, 0.20)"
      : hover
      ? "0 14px 30px rgba(15, 23, 42, 0.12)"
      : "0 6px 18px rgba(15, 23, 42, 0.06)",
    transform: hover ? "translateY(-4px) scale(1.01)" : "none",
    position: "relative",
    overflow: "hidden",
  };

  const imgWrap = {
    width: "100%",
    height: 145,
    borderRadius: 12,
    overflow: "hidden",
    background: "#F1F5F9",
    border: "1px solid #E2E8F0",
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 260ms ease",
    transform: hover ? "scale(1.05)" : "scale(1)",
  };

  const badgeStyle = {
    position: "absolute",
    top: 12,
    left: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background: selected ? "#2563EB" : "rgba(15,23,42,0.65)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.2,
  };

  const metaPill = {
    display: "inline-flex",
    gap: 6,
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    color: "#0F172A",
    fontSize: 12,
    fontWeight: 700,
  };

  return (
    <div
      onClick={onSelect}
      style={cardStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={badgeStyle}>{selected ? "Selected" : "Tap to select"}</div>

      <div style={imgWrap}>
        <img
          src={imgSrc}
          alt={vehicle.title}
          style={imgStyle}
          onError={(e) => (e.currentTarget.src = "/no-car.png")}
        />
      </div>

      <div style={{ paddingTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#0F172A" }}>
            {vehicle.title}
          </h3>

          <div style={{ fontSize: 12, fontWeight: 800, color: "#64748B" }}>
            {vehicle.vehicle_number || ""}
          </div>
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={metaPill}>{vehicle.vehicle_type}</span>
          <span style={metaPill}>{vehicle.transmission}</span>
          <span style={metaPill}>{vehicle.fuel_type}</span>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 950, color: "#0F172A", fontSize: 16 }}>
            Rs. {price} <span style={{ fontSize: 12, color: "#64748B" }}>/ day</span>
          </div>

          <div style={{ fontSize: 12, color: "#475569", fontWeight: 800 }}>
            {Number(vehicle.current_mileage || 0).toLocaleString()} km
          </div>
        </div>
      </div>
    </div>
  );
}