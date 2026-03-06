import { useEffect, useState } from "react";
import api from "../../services/api";
import "../admin/adminTable.css";

export default function OwnerBookings() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/owner/bookings?search=${encodeURIComponent(search)}`);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h1>Bookings</h1>

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
          placeholder="Search by vehicle number / status / customer..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "..." : "Search"}
        </button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Vehicle No.</th>
              <th>Vehicle</th>
              <th>Customer</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Advance</th>
              <th>Amount</th>
              <th>Odo Start</th>
              <th>Odo End</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ textAlign: "center", padding: 18 }}>
                  {loading ? "Loading..." : "No bookings"}
                </td>
              </tr>
            ) : (
              rows.map((b) => (
                <tr key={b.booking_id}>
                  <td>{b.booking_id}</td>
                  <td>{b.vehicle_number}</td>
                  <td>{b.vehicle_title || "—"}</td>
                  <td>
                    <div style={{ fontWeight: 900 }}>{b.customer_name || "—"}</div>
                    <div style={{ color: "#64748B", fontSize: 12 }}>{b.customer_email || ""}</div>
                  </td>
                  <td>{formatDate(b.rental_date)}</td>
                  <td>{formatDate(b.return_date)}</td>
                  <td>
                    <span style={statusStyle(b.booking_status)}>
                      {b.booking_status}
                    </span>
                  </td>
                  <td>{Number(b.advance_paid) === 1 ? "Yes" : "No"}</td>
                  <td>{b.advance_amount ? `Rs. ${Number(b.advance_amount).toLocaleString()}` : "—"}</td>
                  <td>{b.odometer_start ?? "—"}</td>
                  <td>{b.odometer_end ?? "—"}</td>
                  <td>{formatDateTime(b.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// helpers
function formatDate(v) {
  if (!v) return "—";
  const d = new Date(v);
  return d.toLocaleDateString();
}

function formatDateTime(v) {
  if (!v) return "—";
  const d = new Date(v);
  return d.toLocaleString();
}

function statusStyle(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("confirm")) return { fontWeight: 900, color: "#15803d" };
  if (s.includes("pend")) return { fontWeight: 900, color: "#b45309" };
  if (s.includes("cancel")) return { fontWeight: 900, color: "#b91c1c" };
  return { fontWeight: 900, color: "#0f172a" };
}