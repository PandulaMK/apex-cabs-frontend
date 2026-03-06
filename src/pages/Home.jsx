// Home.jsx (UPDATED PART)
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "../components/CountUp";
import api from "../services/api";

import heroCar from "../assets/hero/car.png";
import fleetImg from "../assets/about/fleet.png";
import carIcon from "../assets/icons/car.png";
import suvIcon from "../assets/icons/suv.png";
import vanIcon from "../assets/icons/van.png";

export default function Home() {
  const navigate = useNavigate();

  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // ✅ available vehicles only
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [loadingAvail, setLoadingAvail] = useState(false);

  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [rentalDate, setRentalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ✅ Fetch available vehicles for selected dates
  const loadAvailableVehicles = async () => {
    try {
      if (!rentalDate || !returnDate) return alert("Select rental and return dates");

      setLoadingAvail(true);

      const { data } = await api.get(
        `/vehicles/available?start=${rentalDate}&end=${returnDate}`
      );

      const list = data || [];
      setAvailableVehicles(list);

      // auto-select first available vehicle
      setSelectedVehicleId(list?.[0]?.vehicle_id ? String(list[0].vehicle_id) : "");

      if (list.length === 0) alert("❌ No vehicles available for selected dates");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to load available vehicles");
    } finally {
      setLoadingAvail(false);
    }
  };

  const checkAvailability = async () => {
    try {
      if (!selectedVehicleId) return alert("Select a vehicle first");
      if (!rentalDate || !returnDate) return alert("Select rental and return dates");

      const { data } = await api.get(
        `/bookings/availability?vehicle_id=${selectedVehicleId}&start=${rentalDate}&end=${returnDate}`
      );

      if (data?.available) alert("✅ Vehicle is available");
      else alert("❌ Not available for selected dates");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to check availability");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      {/* HERO */}
      <section style={styles.heroWrap}>
        <div className="heroInner">
          {/* Left */}
          <div style={styles.heroLeft}>
            <h1 style={styles.heroTitle}>
              Drive smart.
              <br />
              Rent easy.
            </h1>

            {/* ✅ redirect */}
            <button
              style={styles.primaryBtn}
              type="button"
              onClick={() => navigate("/vehicles")}
            >
              View all vehicles
            </button>

            <div style={styles.carImgHolder}>
              <img
                src={heroCar}
                alt="Car"
                style={{ width: "100%", maxHeight: "180px", objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Right Booking Widget (UPDATED) */}
          <div style={styles.bookingCard}>
            <h3 style={styles.bookingTitle}>Book your ride</h3>

            <label style={styles.label}>Rental date</label>
            <input
              style={styles.input}
              type="date"
              value={rentalDate}
              onChange={(e) => setRentalDate(e.target.value)}
            />

            <label style={styles.label}>Return date</label>
            <input
              style={styles.input}
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />

            {/* ✅ fetch available vehicles */}
            <button
              style={{ ...styles.accentBtn, marginTop: 12 }}
              type="button"
              onClick={loadAvailableVehicles}
              disabled={loadingAvail}
            >
              {loadingAvail ? "Loading..." : "Load Available Vehicles"}
            </button>

            <label style={styles.label}>Available vehicles</label>
            <select
              style={styles.input}
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              disabled={loadingAvail || availableVehicles.length === 0}
            >
              {availableVehicles.length === 0 ? (
                <option value="">No vehicles found</option>
              ) : (
                availableVehicles.map((v) => (
                  <option key={v.vehicle_id} value={String(v.vehicle_id)}>
                    {v.title} ({v.vehicle_number}) - Rs.{v.daily_rate}/day
                  </option>
                ))
              )}
            </select>

            
          </div>
        </div>
      </section>

      {/* VEHICLE TYPE */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Select Your Vehicle Type</h2>

        <div style={styles.typeRow}>
          <button
            style={styles.typeBtn}
            type="button"
            onClick={() => setVehicleType("car")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(37,99,235,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <img src={carIcon} alt="Cars" style={styles.typeImg} />
            <span style={styles.typeText}>Cars</span>
          </button>

          <button
            style={styles.typeBtn}
            type="button"
            onClick={() => setVehicleType("suv")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(37,99,235,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <img src={suvIcon} alt="SUVs" style={styles.typeImg} />
            <span style={styles.typeText}>SUVs</span>
          </button>

          <button
            style={styles.typeBtn}
            type="button"
            onClick={() => setVehicleType("van")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(37,99,235,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <img src={vanIcon} alt="Vans" style={styles.typeImg} />
            <span style={styles.typeText}>Vans</span>
          </button>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} style={styles.statsBar}>
        <h3 style={styles.statsTitle}>Our Journey in Present</h3>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🚘</div>
            <div>
              <div style={styles.statValue}>
                {statsVisible ? <CountUp end={100} duration={900} suffix="+" /> : "0+"}
              </div>
              <div style={styles.statLabel}>Cars</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>👥</div>
            <div>
              <div style={styles.statValue}>
                {statsVisible ? <CountUp end={1000} duration={1200} suffix="+" /> : "0+"}
              </div>
              <div style={styles.statLabel}>Customers</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>📅</div>
            <div>
              <div style={styles.statValue}>
                {statsVisible ? <CountUp end={10} duration={800} suffix="+" /> : "0+"}
              </div>
              <div style={styles.statLabel}>Years</div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section style={styles.section}>
        <h2 style={{ ...styles.sectionTitle, color: "#1F2937" }}>About Us</h2>

        <div style={styles.aboutGrid}>
          <div style={styles.aboutTextBox}>
            <p style={styles.aboutText}>
              Apex Cabs is a modern car rental service designed to simplify the way vehicles
              are rented and managed...
            </p>
            <p style={styles.aboutText}>
              Our system focuses on transparency, convenience, and reliability...
            </p>
          </div>

          <div style={styles.aboutImageBox}>
            <img
              src={fleetImg}
              alt="Fleet"
              style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "14px" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  heroWrap: { background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" },
  heroInner: {
    background: "#2563EB",
    padding: 26,
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: 26,
    alignItems: "center",
    borderRadius: 16,
  },
  heroLeft: { color: "#fff", display: "flex", flexDirection: "column", gap: 14 },
  heroTitle: { fontSize: 44, lineHeight: 1.05, margin: 0, fontWeight: 800 },
  primaryBtn: { width: 170, height: 38, border: "none", borderRadius: 10, background: "#F59E0B", color: "#111827", fontWeight: 700, cursor: "pointer" },
  carImgHolder: { marginTop: 8 },

  bookingCard: { background: "#FFFFFF", borderRadius: 16, padding: 18, border: "1px solid rgba(255,255,255,0.35)" },
  bookingTitle: { margin: 0, marginBottom: 10, fontWeight: 800, color: "#1F2937", textAlign: "center" },
  label: { fontSize: 12, color: "#334155", fontWeight: 700, marginTop: 10 },
  input: { width: "100%", height: 36, borderRadius: 10, border: "1px solid #E2E8F0", padding: "0 10px", outline: "none", marginTop: 6, background: "#F8FAFC" },
  accentBtn: { marginTop: 14, width: "100%", height: 38, borderRadius: 10, border: "none", background: "#F59E0B", color: "#111827", fontWeight: 800, cursor: "pointer" },

  section: { background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 22 },
  sectionTitle: { textAlign: "center", margin: 0, marginBottom: 18, fontWeight: 900, color: "#F59E0B", fontSize: 26 },

  typeRow: { display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" },
  typeBtn: { width: 190, height: 140, borderRadius: 16, border: "1px solid #E2E8F0", background: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", transition: "all 0.3s ease" },
  typeImg: { width: 70, height: 70, objectFit: "contain" },
  typeText: { fontWeight: 800, fontSize: 16, color: "#1F2937" },

  statsBar: { background: "#2563EB", borderRadius: 16, padding: 22 },
  statsTitle: { margin: 0, textAlign: "center", color: "#fff", fontWeight: 900, marginBottom: 14 },
  statsRow: { display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" },
  statCard: { background: "#FFFFFF", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, minWidth: 200, border: "1px solid #E2E8F0" },
  statIcon: { fontSize: 26 },
  statValue: { fontWeight: 900, fontSize: 18, color: "#1F2937" },
  statLabel: { color: "#64748B", fontWeight: 700, fontSize: 12 },

  aboutGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, alignItems: "center" },
  aboutTextBox: { background: "#2563EB", borderRadius: 16, padding: 18, color: "#fff" },
  aboutText: { margin: 0, marginBottom: 12, lineHeight: 1.6, fontWeight: 500 },
  aboutImageBox: { borderRadius: 16, border: "1px solid #E2E8F0", background: "#F8FAFC", padding: 12 },
};