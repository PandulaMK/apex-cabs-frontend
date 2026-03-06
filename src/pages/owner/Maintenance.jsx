import { useEffect, useState } from "react";
import api from "../../services/api";
import "../admin/adminTable.css";

export default function OwnerMaintenance() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [currentMileage, setCurrentMileage] = useState("");
  const [setAvailable, setSetAvailable] = useState(true);
  const [note, setNote] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/owner/maintenance?search=${encodeURIComponent(search)}`);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load maintenance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const openUpdate = (v) => {
    setSelected(v);
    setCurrentMileage(String(v.current_mileage ?? ""));
    setSetAvailable(true);
    setNote("");
    setOpen(true);
  };

  const save = async () => {
    if (!selected?.vehicle_id) return;
    try {
      await api.put(`/owner/maintenance/${selected.vehicle_id}`, {
        current_mileage: Number(currentMileage),
        set_available: setAvailable,
        note,
      });
      alert("✅ Updated");
      setOpen(false);
      setSelected(null);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div>
      <h1>Maintenance</h1>

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
          placeholder="Search by title / vehicle number..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "..." : "Search"}
        </button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Vehicle No.</th>
              <th>Vehicle</th>
              <th>Current Mileage</th>
              <th>Next Service</th>
              <th>Status</th>
              <th>Updates</th>
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
              rows.map((v) => (
                <tr key={v.vehicle_id}>
                  <td>{v.vehicle_number}</td>
                  <td>{v.title}</td>
                  <td>{v.current_mileage ?? "—"}</td>
                  <td>{v.next_service_mileage ?? "—"}</td>
                  <td>
                    <span className={`status-badge ${v.is_due ? "pending" : "paid"}`}>
                      {v.is_due ? "Due" : "OK"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      type="button"
                      onClick={() => openUpdate(v)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && selected && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>Update Maintenance</h2>
            <div style={{ color: "#64748B", fontWeight: 700, marginBottom: 12 }}>
              {selected.vehicle_number} — {selected.title}
            </div>

            <div className="field">
              <label>Current Mileage (km)</label>
              <input
                type="number"
                value={currentMileage}
                onChange={(e) => setCurrentMileage(e.target.value)}
              />
            </div>

            <div className="field" style={{ marginTop: 10 }}>
              <label>Notes (optional)</label>
              <input value={note} onChange={(e) => setNote(e.target.value)} />
            </div>

            <div className="field" style={{ marginTop: 10 }}>
              <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={setAvailable}
                  onChange={(e) => setSetAvailable(e.target.checked)}
                />
                Mark vehicle as <b>available</b> after service
              </label>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" type="button" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" type="button" onClick={save}>
                Save Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}