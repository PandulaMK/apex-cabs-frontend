import { useEffect, useState } from "react";
import api from "../../services/api";
import "./adminTable.css";

export default function AdminBookings() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [createForm, setCreateForm] = useState({
    customer_id: "",
    vehicle_id: "",
    rental_date: "",
    return_date: "",
    booking_status: "pending",
    advance_paid: 0,
    advance_amount: "",
  });

  const is25th = new Date().getDate() === 25;

const calcDays = (from, to) => {
  const a = new Date(String(from).slice(0, 10));
  const b = new Date(String(to).slice(0, 10));
  const diff = b.getTime() - a.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const isLongTerm = (b) => {
  // preferred: backend provides is_long_term (0/1)
  if (b.is_long_term !== undefined && b.is_long_term !== null) {
    return Number(b.is_long_term) === 1;
  }
  // fallback: calculate from dates
  return calcDays(b.rental_date, b.return_date) >= 30;
};

const paymentReminderDue = (b) => {
  const okStatus = b.booking_status === "confirmed"; // only confirmed
  const longTerm = isLongTerm(b);
  return is25th && okStatus && longTerm;
};

  // ✅ local row editing helper (YOU NEED THIS)
  const updateRowLocal = (booking_id, patch) => {
    setRows((prev) =>
      prev.map((r) => (r.booking_id === booking_id ? { ...r, ...patch } : r))
    );
  };

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/admin/bookings?search=${encodeURIComponent(search)}`
      );
      setRows(data || []);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const loadDropdowns = async () => {
  try {
    const [vRes, cRes] = await Promise.all([
      api.get("/admin/vehicles"),
      api.get("/admin/users"), // ✅ remove ?role=customer
    ]);
    setVehicles(vRes.data || []);
    setCustomers(cRes.data || []);
  } catch (e) {
    alert(e?.response?.data?.message || "Failed to load dropdown data");
  }
};

  useEffect(() => {
    load();
    loadDropdowns();
    // eslint-disable-next-line
  }, []);

  // ✅ FULL update endpoint (PUT /api/admin/bookings/:id)
  
const updateBooking = async (booking_id, patch) => {
  try {
    await api.put(`/admin/bookings/${booking_id}`, patch);
    await load();
    alert("✅ Updated");
  } catch (e) {
    alert(e?.response?.data?.message || e.message || "Update failed");
    console.log("UPDATE ERROR:", e?.response?.status, e?.response?.data);
  }
};

  const createBooking = async () => {
    try {
      await api.post("/admin/bookings", createForm);

      setCreateForm({
        customer_id: "",
        vehicle_id: "",
        rental_date: "",
        return_date: "",
        booking_status: "pending",
        advance_paid: 0,
        advance_amount: "",
      });

      await load();
      alert("Booking created");
    } catch (e) {
      alert(e?.response?.data?.message || "Create failed");
    }
  };

  return (
    <div>
      <h1>Bookings</h1>

      {/* Manual booking form */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <h3 style={{ marginBottom: 10 }}>Add Manual Booking</h3>

        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 10,
          }}
        >
          <select
            value={createForm.customer_id}
            onChange={(e) =>
              setCreateForm({ ...createForm, customer_id: e.target.value })
            }
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.user_id} value={c.user_id}>
                {c.full_name} ({c.phone_1})
              </option>
            ))}
          </select>

          <select
            value={createForm.vehicle_id}
            onChange={(e) =>
              setCreateForm({ ...createForm, vehicle_id: e.target.value })
            }
          >
            <option value="">Select Vehicle</option>
            {vehicles.map((v) => (
              <option key={v.vehicle_id} value={v.vehicle_id}>
                {v.title} ({v.vehicle_number || v.vehicle_id})
              </option>
            ))}
          </select>

          <input
            type="date"
            value={createForm.rental_date}
            onChange={(e) =>
              setCreateForm({ ...createForm, rental_date: e.target.value })
            }
          />

          <input
            type="date"
            value={createForm.return_date}
            onChange={(e) =>
              setCreateForm({ ...createForm, return_date: e.target.value })
            }
          />

          <select
            value={createForm.booking_status}
            onChange={(e) =>
              setCreateForm({ ...createForm, booking_status: e.target.value })
            }
          >
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="cancelled">cancelled</option>
            <option value="completed">completed</option>
          </select>

          <div style={{ display: "flex", gap: 8 }}>
            <select
              value={createForm.advance_paid}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  advance_paid: Number(e.target.value),
                  // if No -> clear amount
                  advance_amount: Number(e.target.value) ? createForm.advance_amount : "",
                })
              }
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>

            <input
              type="number"
              placeholder="Advance Amount"
              value={createForm.advance_amount}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  advance_amount: e.target.value,
                })
              }
              disabled={!Number(createForm.advance_paid)}
            />
          </div>
        </div>

        <button
          className="btn btn-primary"
          style={{ marginTop: 12 }}
          type="button"
          onClick={createBooking}
        >
          Create Booking
        </button>
      </div>

      {/* Search */}
      <form
        className="admin-search"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bookings..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "..." : "Search"}
        </button>
      </form>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>User</th>
              <th>Contact</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Advance Paid</th>
              <th>Advance Amount</th>
              <th>Updates</th>
              <th>Reminder</th>
            </tr>
          </thead>

          <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: 18 }}>
                    {loading ? "Loading..." : "No bookings"}
                  </td>
                </tr>
              ) : (
                rows.map((b) => (
                  <tr key={b.booking_id}>
                    <td>
                      {b.vehicle_number} - {b.vehicle_title}
                    </td>
                    <td>{b.customer_name}</td>
                    <td>{b.customer_phone}</td>
                    <td>{String(b.rental_date).slice(0, 10)}</td>
                    <td>{String(b.return_date).slice(0, 10)}</td>

                    {/* Status (local) */}
                    <td>
                      <select
                        value={b.booking_status}
                        onChange={(e) =>
                          updateRowLocal(b.booking_id, { booking_status: e.target.value })
                        }
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="cancelled">cancelled</option>
                        <option value="completed">completed</option>
                      </select>
                    </td>

                    {/* Advance Paid (local) */}
                    <td>
                      <select
                        value={Number(b.advance_paid) ? 1 : 0}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          updateRowLocal(b.booking_id, {
                            advance_paid: val,
                            advance_amount: val ? (b.advance_amount ?? "") : null,
                          });
                        }}
                      >
                        <option value={0}>No</option>
                        <option value={1}>Yes</option>
                      </select>
                    </td>

                    {/* Advance Amount */}
                    <td>
                      {Number(b.advance_paid) ? (
                        <input
                          type="number"
                          placeholder="Amount"
                          value={b.advance_amount ?? ""}
                          onChange={(e) =>
                            updateRowLocal(b.booking_id, { advance_amount: e.target.value })
                          }
                          style={{ width: 120 }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* Updates */}
                    <td style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <button
                        className="edit-btn"
                        type="button"
                        onClick={() =>
                          updateBooking(b.booking_id, {
                            booking_status: b.booking_status,
                            advance_paid: Number(b.advance_paid) ? 1 : 0,
                            advance_amount: Number(b.advance_paid)
                              ? b.advance_amount === "" || b.advance_amount == null
                                ? null
                                : Number(b.advance_amount)
                              : null,
                          })
                        }
                      >
                        Save
                      </button>

                      
                    </td>
                    <td>
                      {/* ✅ Show ONLY if due (25th + confirmed + long-term) */}
                      {paymentReminderDue(b) ? (
                        <button
                          className="edit-btn"
                          type="button"
                          style={{ background: "#0f172a" }}
                          onClick={async () => {
                            try {
                              await api.post(`/admin/bookings/${b.booking_id}/remind-payment`);
                              alert("✅ Reminder sent");
                            } catch (e) {
                              alert(e?.response?.data?.message || "Failed to send reminder");
                            }
                          }}
                        >
                          Send Reminder
                        </button>
                      ) : (
                        <span style={{ color: "#64748B", fontWeight: 700 }}>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
        </table>
      </div>
    </div>
  );
}