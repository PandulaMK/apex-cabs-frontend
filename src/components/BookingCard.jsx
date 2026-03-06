// BookingCard.jsx
import { useMemo } from "react";

const placeholderSvg =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="260" height="140">
    <rect width="100%" height="100%" fill="#F1F5F9"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      font-family="Arial" font-size="14" fill="#64748B">No Image</text>
  </svg>`);

function formatDate(d) {
  if (!d) return "";
  // supports both "2026-02-25" and ISO strings
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return String(d);
  return dt.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function BookingCard({ booking, onCancel, onPayAdvance }) {
  if (!booking) return null;

  const v = booking.vehicle || booking;

  const title = v.title || "Vehicle";
  const type = v.type || v.vehicle_type || "";
  const transmission = v.transmission || "";
  const fuel = v.fuel || v.fuel_type || "";
  const dailyRate = Number(v.pricePerDay ?? v.daily_rate ?? 0) || 0;

  const status = booking.status || booking.booking_status || "pending";
  const from = formatDate(booking.from || booking.rental_date);
  const to = formatDate(booking.to || booking.return_date);

  const rawImg =
    v.imageUrl || booking.imageUrl || v.image_path || booking.image_path || "";
  const imgSrc =
    rawImg && rawImg.startsWith("http")
      ? rawImg
      : rawImg
        ? `http://localhost:5000/${rawImg}`
        : placeholderSvg;

  const isCancelled = status === "cancelled";
  const isPaid = booking.advance_paid === 1 || booking.advance_paid === true; // supports future db field
  const bookingId = booking.booking_id;

  const statusColor = useMemo(() => {
    if (status === "confirmed") return "#2563EB";
    if (status === "pending") return "#F59E0B";
    if (status === "cancelled") return "#DC2626";
    return "#64748B";
  }, [status]);

  return (
    <div style={styles.card}>
      <div style={styles.left}>
        <div style={styles.imgWrap}>
          <img
            src={imgSrc}
            alt={title}
            style={styles.img}
            onError={(e) => (e.currentTarget.src = placeholderSvg)}
          />
        </div>

        <div style={styles.info}>
          <div style={styles.title}>{title}</div>
          <div style={styles.sub}>{type}</div>

          <div style={styles.metaRow}>
            <span style={styles.meta}>⚙ {transmission}</span>
            <span style={styles.meta}>⛽ {fuel}</span>
          </div>

          <div style={styles.price}>
            Rs. {dailyRate.toLocaleString()} <span style={styles.per}>per day</span>
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.dateBox}>
          <div>
            <div style={styles.dateLabel}>From</div>
            <div style={styles.dateVal}>{from}</div>
          </div>
          <div>
            <div style={styles.dateLabel}>To</div>
            <div style={styles.dateVal}>{to}</div>
          </div>
        </div>

        <div style={styles.status}>
          Status: <b style={{ color: statusColor }}>{status}</b>
        </div>

        <div style={styles.actions}>
          <button
            style={{
              ...styles.payBtn,
              opacity: isCancelled || isPaid ? 0.6 : 1,
              cursor: isCancelled || isPaid ? "not-allowed" : "pointer",
            }}
            disabled={isCancelled || isPaid}
            onClick={() => onPayAdvance?.(booking)}
          >
            {isPaid ? "Advance Paid" : "Pay Advance"}
          </button>

          <button
            style={{
              ...styles.cancelBtn,
              opacity: isCancelled ? 0.6 : 1,
              cursor: isCancelled ? "not-allowed" : "pointer",
            }}
            disabled={isCancelled}
            onClick={() => onCancel?.(bookingId)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: "100%",
    border: "1px solid #E2E8F0",
    borderRadius: 14,
    background: "#FFFFFF",
    padding: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  left: { display: "flex", alignItems: "center", gap: 12, minWidth: 320 },
  imgWrap: {
    width: 120,
    height: 72,
    borderRadius: 12,
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    overflow: "hidden",
    flexShrink: 0,
  },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  info: { lineHeight: 1.15 },
  title: { fontWeight: 900, color: "#1F2937", fontSize: 16 },
  sub: { fontSize: 12, fontWeight: 700, color: "#64748B", marginTop: 4 },
  metaRow: { display: "flex", gap: 12, marginTop: 8 },
  meta: { fontSize: 12, fontWeight: 700, color: "#334155" },
  price: { marginTop: 10, fontWeight: 900, color: "#0F172A" },
  per: { fontSize: 12, fontWeight: 700, color: "#64748B", marginLeft: 6 },

  right: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 },
  dateBox: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    border: "1px solid #E2E8F0",
    borderRadius: 12,
    padding: "10px 12px",
    background: "#F8FAFC",
    minWidth: 240,
  },
  dateLabel: { fontSize: 11, fontWeight: 800, color: "#64748B" },
  dateVal: { fontSize: 12, fontWeight: 800, color: "#1F2937", marginTop: 2 },
  status: { fontSize: 12, fontWeight: 700, color: "#334155" },
  actions: { display: "flex", gap: 10 },
  payBtn: {
    height: 34,
    padding: "0 14px",
    borderRadius: 10,
    border: "1px solid #1D4ED8",
    background: "#EFF6FF",
    color: "#1D4ED8",
    fontWeight: 900,
  },
  cancelBtn: {
    height: 34,
    padding: "0 14px",
    borderRadius: 10,
    border: "none",
    background: "#2563EB",
    color: "#fff",
    fontWeight: 900,
  },
};