import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../services/api";

export default function PaymentGateway() {
  const nav = useNavigate();
  const { state } = useLocation(); // contains booking
  const booking = state?.booking;

  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  if (!booking) {
    return (
      <div style={{ padding: 24 }}>
        <h2>No booking selected</h2>
        <button onClick={() => nav("/profile")}>Back</button>
      </div>
    );
  }

  // Example: 20% advance of 1 day rate (dummy)
  const daily = Number(booking.daily_rate ?? booking.pricePerDay ?? 0) || 0;
  const advanceAmount = Math.round(daily * 0.2);

  const payNow = async () => {
    setLoading(true);
    try {
      // DUMMY payment success -> mark paid in backend (dummy endpoint)
      await api.post(`/payments/advance`, {
        booking_id: booking.booking_id,
        amount: advanceAmount,
        method,
      });

      alert("✅ Payment Successful (Dummy)");
      nav("/profile");
    } catch (e) {
      console.error(e);
      alert("❌ Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ fontWeight: 900 }}>Dummy Payment Gateway</h2>
      <p style={{ color: "#64748B", fontWeight: 700 }}>
        Booking #{booking.booking_id} • {booking.title || booking.vehicle?.title}
      </p>

      <div style={box}>
        <div style={row}>
          <span>Advance amount</span>
          <b>Rs. {advanceAmount.toLocaleString()}</b>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Payment Method</div>

          <label style={radio}>
            <input
              type="radio"
              name="method"
              checked={method === "card"}
              onChange={() => setMethod("card")}
            />
            Card (dummy)
          </label>

          <label style={radio}>
            <input
              type="radio"
              name="method"
              checked={method === "bank"}
              onChange={() => setMethod("bank")}
            />
            Bank Transfer (dummy)
          </label>

          <label style={radio}>
            <input
              type="radio"
              name="method"
              checked={method === "cash"}
              onChange={() => setMethod("cash")}
            />
            Cash (dummy)
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
          onClick={() => nav("/profile")}
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