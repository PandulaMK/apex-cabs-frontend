import { useEffect, useState } from "react";
import api from "../../services/api";
import "./adminTable.css";

export default function AdminPayments() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/payments?search=${encodeURIComponent(search)}`);
      setRows(data);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  return (
    <div>
      <h1>Payments</h1>

      <form className="admin-search" onSubmit={(e)=>{e.preventDefault(); load();}}>
        <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search payments..." />
        <button type="submit" disabled={loading}>{loading ? "..." : "Search"}</button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking</th>
              <th>User</th>
              <th>Vehicle</th>
              <th>Total</th>
              <th>Advance</th>
              <th>Advance Paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign:"center", padding:18}}>{loading ? "Loading..." : "No records"}</td></tr>
            ) : rows.map(r => (
              <tr key={r.booking_id}>
                <td>{r.booking_id}</td>
                <td>{r.user_name || r.customer_name || "-"}</td>
                <td>{r.vehicle_number} - {r.vehicle_name}</td>
                <td>{r.total_amount ?? "-"}</td>
                <td>{r.advance_amount ?? "-"}</td>
                <td>{r.advance_paid ? "Yes" : "No"}</td>
                <td>{r.booking_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}