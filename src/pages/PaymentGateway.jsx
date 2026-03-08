import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

export default function PaymentGateway() {
  const nav = useNavigate();
  const { state } = useLocation();

  const booking = state?.booking || null;
  const vehicle = state?.vehicle || null;
  const rental_date = state?.rental_date || "";
  const return_date = state?.return_date || "";

  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  // Support both flows:
  // 1. From profile => booking exists
  // 2. From vehicles => vehicle exists, booking may not exist yet
  const title = booking?.title || booking?.vehicle?.title || vehicle?.title || "Selected Vehicle";

  const daily =
    Number(
      booking?.daily_rate ??
      booking?.pricePerDay ??
      vehicle?.price_per_day ??
      vehicle?.daily_rate ??
      vehicle?.pricePerDay ??
      0
    ) || 0;

  const advanceAmount = Math.round(daily * 0.2);

  const payNow = async () => {
    try {
      setLoading(true);

      let finalBookingId = booking?.booking_id;

      // If user came from Vehicles page and booking doesn't exist yet,
      // create booking first before recording advance payment
      if (!finalBookingId) {
        if (!vehicle?.vehicle_id || !rental_date || !return_date) {
          alert("Missing booking details");
          return;
        }

        const { data: createdBooking } = await api.post("/bookings", {
          vehicle_id: vehicle.vehicle_id,
          rental_date,
          return_date,
        });

        finalBookingId =
          createdBooking?.booking_id ||
          createdBooking?.data?.booking_id ||
          createdBooking?.booking?.booking_id;

        if (!finalBookingId) {
          throw new Error("Booking created, but booking_id was not returned");
        }
      }

      // Record / update advance payment in backend
      await api.post("/payments/advance", {
        booking_id: finalBookingId,
        amount: advanceAmount,
        method,
        payment_status: "paid",
      });

      alert("✅ Advance payment successful");
      nav("/profile");
    } catch (e) {
      console.error("Advance payment failed:", e);
      alert(e?.response?.data?.message || e?.message || "❌ Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!booking && !vehicle) {
    return (
      <div style={{ padding: 24 }}>
        <h2>No booking selected</h2>
        <button onClick={() => nav("/vehicles")}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ fontWeight: 900 }}>Payment Gateway</h2>
      <p style={{ color: "#64748B", fontWeight: 700 }}>
        {booking?.booking_id ? `Booking #${booking.booking_id} • ` : ""}
        {title}
      </p>

      <div style={box}>
        <div style={row}>
          <span>Advance amount</span>
          <b>Rs. {advanceAmount.toLocaleString()}</b>
        </div>

        {rental_date && return_date && (
          <div style={{ marginTop: 10, color: "#475569", fontWeight: 700 }}>
            {rental_date} → {return_date}
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Payment Method</div>

          <label style={radio}>
            <input
              type="radio"
              name="method"
              checked={method === "card"}
              onChange={() => setMethod("card")}
            />
            Card
          </label>

          <label style={radio}>
            <input
              type="radio"
              name="method"
              checked={method === "bank"}
              onChange={() => setMethod("bank")}
            />
            Bank Transfer
          </label>

          <label style={radio}>
            <input
              type="radio"
              name="method"
              checked={method === "cash"}
              onChange={() => setMethod("cash")}
            />
            Cash
          </label>
        </div>

        <button
          onClick={payNow}
          disabled={loading}
          style={{
            marginTop: 16,
            width: "100%",
            height: 40,
            borderRadius: 12,
            border: "none",
            background: "#16A34A",
            color: "#fff",
            fontWeight: 900,
            cursor: "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <button
          onClick={() => nav(-1)}
          style={{
            marginTop: 10,
            width: "100%",
            height: 40,
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            background: "#fff",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

const box = {
  border: "1px solid #E2E8F0",
  borderRadius: 14,
  padding: 16,
  background: "#fff",
  marginTop: 12,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  fontWeight: 800,
};

const radio = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  fontWeight: 800,
  marginTop: 8,
};