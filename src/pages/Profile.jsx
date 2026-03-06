import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingCard from "../components/BookingCard";
import {
  getMyProfile,
  getMyBookings,
  cancelBooking,
  updateMyProfile,
  changePassword,
} from "../services/profile.service";

export default function Profile() {
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);

  // Edit states
  const [editName, setEditName] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [editPhone1, setEditPhone1] = useState(false);
  const [editPhone2, setEditPhone2] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        console.log("Loading profile...");

        const profileData = await getMyProfile();
        console.log("Profile response:", profileData);
        setProfile(profileData);

        const bookingData = await getMyBookings();
        console.log("Bookings response:", bookingData);
        setBookings(bookingData);
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const saveField = async (partial, closeEdit) => {
    try {
      const payload = {
        full_name: profile?.full_name ?? "",
        address: profile?.address ?? "",
        phone_1: profile?.phone_1 ?? "",
        phone_2: profile?.phone_2 ?? "",
        ...partial,
      };

      const updated = await updateMyProfile(payload);
      setProfile(updated);
      closeEdit(false);
      alert("✅ Saved successfully");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Save failed (400)");
    }
  };

  const onChangePassword = async () => {
    try {
      await changePassword({ currentPassword, newPassword });
      alert("✅ Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e) {
      alert(e?.response?.data?.message || "Password change failed");
    }
  };

  const onCancel = async (bookingId) => {
    const ok = confirm("Cancel this booking?");
    if (!ok) return;

    try {
      await cancelBooking(bookingId);
      const b = await getMyBookings();
      setBookings([...b]);
    } catch (e) {
      alert(e?.response?.data?.message || "Cancel failed");
    }
  };

  // ✅ NEW: Go to dummy payment gateway with the booking info
  const handlePayAdvance = (booking) => {
    nav("/payment", { state: { booking } });
  };

  if (loading) return <div style={{ padding: 18, fontWeight: 800 }}>Loading...</div>;
  if (!profile) return <div style={{ padding: 18 }}>No profile data</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* My Profile */}
      <section style={styles.section}>
        <h3 style={styles.h3}>My Profile</h3>

        <div style={styles.profileGrid}>
          {/* Left */}
          <div style={styles.leftCol}>
            <div style={styles.avatarWrap}>
              <div style={styles.avatar}>👤</div>
              <button style={styles.smallBtn}>Edit</button>
            </div>

            {/* Name */}
            <div style={styles.field}>
              <label style={styles.label}>Name</label>
              <div style={styles.row}>
                <input
                  style={{ ...styles.input, flex: 1 }}
                  value={profile.full_name || ""}
                  disabled={!editName}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, full_name: e.target.value }))
                  }
                />
                <button
                  style={styles.redBtn}
                  onClick={() => {
                    if (!editName) return setEditName(true);
                    saveField({ full_name: profile.full_name }, setEditName);
                  }}
                >
                  {editName ? "Save" : "Edit"}
                </button>
              </div>
            </div>

            {/* NIC */}
            <div style={styles.field}>
              <label style={styles.label}>Identity Card No.</label>
              <input style={styles.input} value={profile.nic || ""} disabled />
              <div style={styles.noteRed}>(Cannot be edited without permission)</div>
            </div>

            {/* Address */}
            <div style={styles.field}>
              <label style={styles.label}>Address</label>
              <div style={styles.row}>
                <input
                  style={{ ...styles.input, flex: 1 }}
                  value={profile?.address ?? ""}
                  placeholder="Add your address"
                  disabled={!editAddress}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, address: e.target.value }))
                  }
                />
                <button
                  style={styles.redBtn}
                  onClick={() => {
                    if (!editAddress) return setEditAddress(true);
                    saveField({ address: profile.address }, setEditAddress);
                  }}
                >
                  {editAddress ? "Save" : "Edit"}
                </button>
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={styles.rightCol}>
            {/* Phone 1 */}
            <div style={styles.field}>
              <label style={styles.labelCenter}>Contact Number 01</label>
              <div style={styles.row}>
                <input
                  style={{ ...styles.input, flex: 1 }}
                  value={profile?.phone_1 ?? ""}
                  placeholder="Add your phone number 1"
                  disabled={!editPhone1}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, phone_1: e.target.value }))
                  }
                />
                <button
                  style={styles.redBtn}
                  onClick={() => {
                    if (!editPhone1) return setEditPhone1(true);
                    saveField({ phone_1: profile.phone_1 }, setEditPhone1);
                  }}
                >
                  {editPhone1 ? "Save" : "Edit"}
                </button>
              </div>
            </div>

            {/* Phone 2 */}
            <div style={styles.field}>
              <label style={styles.labelCenter}>Contact Number 02</label>
              <div style={styles.row}>
                <input
                  style={{ ...styles.input, flex: 1 }}
                  value={profile?.phone_2 ?? ""}
                  placeholder="Add your phone number 2"
                  disabled={!editPhone2}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, phone_2: e.target.value }))
                  }
                />
                <button
                  style={styles.redBtn}
                  onClick={() => {
                    if (!editPhone2) return setEditPhone2(true);
                    saveField({ phone_2: profile.phone_2 }, setEditPhone2);
                  }}
                >
                  {editPhone2 ? "Save" : "Edit"}
                </button>
              </div>
            </div>

            {/* Change password */}
            <div style={{ ...styles.field, marginTop: 18 }}>
              <label style={styles.labelCenter}>Change Login Password</label>

              <input
                style={styles.input}
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <input
                style={{ ...styles.input, marginTop: 10 }}
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button style={styles.redBtn} onClick={onChangePassword}>
                Change
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* My Bookings */}
      <section style={styles.section}>
        <h3 style={styles.h3}>My Bookings</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {bookings.length === 0 ? (
            <div style={{ color: "#64748B", fontWeight: 700 }}>No bookings found</div>
          ) : (
            bookings.map((b) => (
            <div
              key={b.booking_id}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <BookingCard
                booking={b}
                onCancel={onCancel}
                onPayAdvance={handlePayAdvance}
              />

              {/* ✅ Show odometer update ONLY on 25th AND only for long-term bookings */}
              {new Date().getDate() === 25 && Number(b.is_long_term) === 1 && (
                <MonthlyOdometer bookingId={b.booking_id} />
              )}
            </div>
          ))
          )}
        </div>
      </section>
    </div>
  );
  function MonthlyOdometer({ bookingId }) {
  const [mileage, setMileage] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    try {
      setSaving(true);

      const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/odometer`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ mileage, note }),
  }
);

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      alert("✅ Mileage submitted");
      setMileage("");
      setNote("");
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: "#FFF7ED", border: "1px solid #FDBA74", padding: 12, borderRadius: 12 }}>
      <div style={{ fontWeight: 900, marginBottom: 8 }}>
        Monthly Odometer Update (25th)
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="number"
          placeholder="Enter mileage"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          style={{ flex: 1, height: 36, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px" }}
        />

        <button
          onClick={submit}
          disabled={saving}
          style={{ height: 36, borderRadius: 8, border: "none", background: "#EA580C", color: "white", fontWeight: 900, padding: "0 14px" }}
        >
          {saving ? "..." : "Submit"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ marginTop: 8, width: "100%", height: 36, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px" }}
      />
    </div>
  );
}
}

const styles = {
  section: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: 16,
    padding: 18,
  },
  h3: { margin: 0, fontWeight: 900, color: "#1F2937", marginBottom: 14 },

  profileGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 22,
    alignItems: "start",
  },
  leftCol: { display: "flex", flexDirection: "column", gap: 14 },
  rightCol: { display: "flex", flexDirection: "column", gap: 14 },

  avatarWrap: { display: "flex", alignItems: "center", gap: 12 },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: "50%",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    display: "grid",
    placeItems: "center",
    fontSize: 28,
  },
  smallBtn: {
    height: 34,
    padding: "0 12px",
    borderRadius: 10,
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    fontWeight: 800,
    cursor: "pointer",
  },

  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 900, color: "#1F2937" },
  labelCenter: { fontSize: 12, fontWeight: 900, color: "#1F2937" },

  row: { display: "flex", gap: 10, alignItems: "center" },

  input: {
    height: 34,
    borderRadius: 8,
    border: "1px solid #CBD5E1",
    padding: "0 10px",
    outline: "none",
    background: "#F8FAFC",
    fontWeight: 700,
    color: "#1F2937",
  },

  redBtn: {
    height: 34,
    minWidth: 70,
    borderRadius: 8,
    border: "none",
    background: "#EF4444",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  noteRed: { fontSize: 12, color: "#EF4444", fontWeight: 800 },
};