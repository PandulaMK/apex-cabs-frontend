import { useEffect, useState } from "react";
import api from "../../services/api";
import "./adminTable.css";

export default function AdminMaintenance() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/maintenance?search=${encodeURIComponent(search)}`);
      setRows(data);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load maintenance list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  return (
    <div>
      <h1>Maintenance</h1>

      <form className="admin-search" onSubmit={(e)=>{e.preventDefault(); load();}}>
        <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search vehicles..." />
        <button type="submit" disabled={loading}>{loading ? "..." : "Search"}</button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Number</th>
              <th>Current Mileage</th>
              <th>Next Service</th>
              <th>Service Status</th>
              <th>Reminder</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 18 }}>
                  {loading ? "Loading..." : "No vehicles"}
                </td>
              </tr>
            ) : (
              rows.map((v) => {
                const current = Number(v.current_mileage || 0);
                const next = Number(v.next_service_mileage || 0);
                const status = String(v.service_status || "ok").toLowerCase();

                const isDue = next > 0 && (current >= next || status !== "ok");

                return (
                  <tr key={v.vehicle_id}>
                    <td>{v.title || "-"}</td>
                    <td>{v.vehicle_number || "-"}</td>
                    <td>{v.current_mileage ?? "-"}</td>
                    <td>{v.next_service_mileage ?? "-"}</td>
                    <td>{v.service_status || "OK"}</td>

                    {/* ✅ Only show if DUE */}
                    <td>
                      {isDue ? (
                        <button
                          className="edit-btn"
                          type="button"
                          onClick={async () => {
                            try {
                              await api.post(`/admin/vehicles/${v.vehicle_id}/remind-maintenance`);
                              alert("✅ Maintenance reminder sent");
                            } catch (e) {
                              alert(e?.response?.data?.message || "Failed to send reminder");
                            }
                          }}
                        >
                          Send Reminder
                        </button>
                      ) : (
                        <span style={{ color: "#64748B", fontWeight: 700 }}>Not due</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}