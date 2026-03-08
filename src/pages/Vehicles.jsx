import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleCard from "../components/VehicleCard";
import api from "../services/api";
import { createBooking } from "../services/booking.service";
import ModernLoader from "../components/ModernLoader";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const pageSize = 3;
  const [page, setPage] = useState(1);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [rentalDate, setRentalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const requireLogin = () => {
    alert("Please login to book");
    navigate("/login");
  };

  // ✅ today string YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // ✅ return min = rentalDate + 1 day (or today if rental not selected)
  const returnMin = useMemo(() => {
    if (!rentalDate) return todayStr;
    const d = new Date(`${rentalDate}T00:00:00`);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, [rentalDate, todayStr]);

  // ✅ IMPORTANT: this builds a correct file base (removes /api if your baseURL is .../api)
  const fileBase = useMemo(() => {
    const base = api.defaults?.baseURL || `${import.meta.env.VITE_API_URL}/api`;
    return base.replace(/\/api\/?$/, "");
  }, []);

  useEffect(() => {
    async function loadVehicles() {
      try {
        const { data } = await api.get("/vehicles");
        setVehicles(data || []);
      } catch (err) {
        console.error(err);
        alert(err?.response?.data?.message || "Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    }
    loadVehicles();
  }, []);

  const totalPages = Math.max(1, Math.ceil(vehicles.length / pageSize));

  const pageVehicles = useMemo(
    () => vehicles.slice((page - 1) * pageSize, page * pageSize),
    [vehicles, page]
  );

  // ✅ shared frontend validation
  const validateBookingDates = () => {
    if (!rentalDate || !returnDate) {
      alert("Select rental and return dates");
      return false;
    }

    if (rentalDate < todayStr) {
      alert("Rental date cannot be in the past");
      return false;
    }

    // rental must be strictly before return
    if (rentalDate >= returnDate) {
      alert("Return date must be after rental date");
      return false;
    }

    return true;
  };

  const checkAvailability = async () => {
    try {
      if (!selectedVehicle) return alert("Select a vehicle first");
      if (!validateBookingDates()) return;

      const { data } = await api.get(
        `/bookings/availability?vehicle_id=${selectedVehicle.vehicle_id}&start=${rentalDate}&end=${returnDate}`
      );

      if (data.available) alert("✅ Vehicle is available");
      else alert("❌ Not available for selected dates");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to check availability");
    }
  };

  const onBookNow = async () => {
    try {
      if (!token) return requireLogin();
      if (!selectedVehicle?.vehicle_id) return alert("Select a vehicle first");
      if (!validateBookingDates()) return;

      await createBooking({
        vehicle_id: selectedVehicle.vehicle_id,
        rental_date: rentalDate,
        return_date: returnDate,
      });

      alert("✅ Booking saved to database");
    } catch (err) {
      console.error(err);

      if (
        err?.response?.status === 401 ||
        String(err?.response?.data?.message || "").toLowerCase().includes("token")
      ) {
        return requireLogin();
      }

      alert(err?.response?.data?.message || "Booking failed");
    }
  };

  const payAdvance = () => {
  if (!token) return requireLogin();
  if (!selectedVehicle?.vehicle_id) return alert("Select a vehicle first");
  if (!validateBookingDates()) return;

  navigate("/payment", {
    state: {
      vehicle: selectedVehicle,
      rental_date: rentalDate,
      return_date: returnDate,
    },
  });
};

  if (loading) return <ModernLoader/>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={styles.heading}>Choose the vehicle that suits you</h2>

      {/* Cards */}
      <div style={styles.cardRow}>
        {pageVehicles.map((v) => (
          <VehicleCard
            key={v.vehicle_id}
            vehicle={v}
            selected={selectedVehicle?.vehicle_id === v.vehicle_id}
            onSelect={() => setSelectedVehicle(v)}
            fileBase={fileBase}
          />
        ))}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          const active = p === page;
          return (
            <button
              key={p}
              style={{
                ...styles.pageBtn,
                background: active ? "#2563EB" : "#FFFFFF",
                color: active ? "#fff" : "#2563EB",
              }}
              onClick={() => setPage(p)}
              type="button"
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          style={styles.nextBtn}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          next
        </button>
      </div>

      {/* Booking Panel */}
      <div id="booking-panel" style={styles.bookingWrap}>
        <div style={styles.bookingBox}>
          <h3 style={styles.bookingTitle}>Book your ride</h3>

          <div style={styles.smallText}>
            {selectedVehicle ? (
              <>
                Selected: <b>{selectedVehicle.title}</b>
              </>
            ) : (
              "Select a vehicle from above"
            )}
          </div>

          <label style={styles.label}>Rental date</label>
          <input
            style={styles.input}
            type="date"
            min={todayStr}             // ✅ prevent past dates
            value={rentalDate}
            onChange={(e) => {
              const val = e.target.value;
              setRentalDate(val);

              // ✅ if returnDate is now invalid, clear it
              if (returnDate && val && returnDate <= val) {
                setReturnDate("");
              }
            }}
          />

          <label style={styles.label}>Return date</label>
          <input
            style={styles.input}
            type="date"
            min={returnMin}            // ✅ enforce at least +1 day
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />

          <button style={styles.btnOrange} onClick={checkAvailability} type="button">
            Check Availability
          </button>

          <button style={styles.btnBlue} onClick={onBookNow} type="button">
            Book now
          </button>

          <button style={styles.btnGreen} onClick={payAdvance} type="button">
            Pay Advance amount
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  heading: { margin: 0, fontWeight: 900, color: "#1F2937" },
  cardRow: { display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" },
  pagination: { display: "flex", gap: 8, justifyContent: "center", alignItems: "center" },
  pageBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    border: "1px solid #2563EB",
    fontWeight: 800,
    cursor: "pointer",
  },
  nextBtn: {
    height: 34,
    padding: "0 12px",
    borderRadius: 8,
    border: "1px solid #2563EB",
    background: "#2563EB",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  bookingWrap: { display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 10 },
  bookingBox: {
    width: "100%",
    maxWidth: 360,
    background: "#E5E7EB",
    borderRadius: 18,
    padding: 18,
    border: "1px solid #CBD5E1",
  },
  bookingTitle: { margin: 0, textAlign: "center", fontWeight: 900, color: "#111827" },
  smallText: { marginTop: 8, textAlign: "center", color: "#334155", fontWeight: 600, fontSize: 13 },
  label: { display: "block", marginTop: 12, fontSize: 12, fontWeight: 800, color: "#111827", textAlign: "center" },
  input: { width: "100%", height: 34, borderRadius: 8, border: "1px solid #9CA3AF", padding: "0 10px", marginTop: 6, outline: "none", background: "#fff" },
  btnOrange: { marginTop: 14, width: "100%", height: 34, borderRadius: 8, border: "none", background: "#F59E0B", fontWeight: 900, cursor: "pointer" },
  btnBlue: { marginTop: 10, width: "100%", height: 34, borderRadius: 8, border: "none", background: "#2563EB", color: "#fff", fontWeight: 900, cursor: "pointer" },
  btnGreen: { marginTop: 10, width: "100%", height: 34, borderRadius: 8, border: "none", background: "#22C55E", color: "#fff", fontWeight: 900, cursor: "pointer" },
};