import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "../admin/adminTable.css"; // reuse same table styles

const emptyForm = {
  title: "",
  vehicle_number: "",
  vehicle_type: "",
  transmission: "auto",
  fuel_type: "petrol",
  current_mileage: 0,
  last_service_mileage: 0,
  service_interval: 5000,
  next_service_mileage: 5000,
};

export default function OwnerVehicles() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ ...emptyForm });
  const [imageFile, setImageFile] = useState(null);

  const fileBase = useMemo(() => {
    const base = api.defaults?.baseURL || "";
    return base.replace(/\/api\/?$/, "");
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/owner/vehicles?search=${encodeURIComponent(search)}`);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v ?? "")));
      if (imageFile) fd.append("image", imageFile);

      await api.post("/owner/vehicles", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Vehicle submitted (Pending admin approval)");
      setForm({ ...emptyForm });
      setImageFile(null);
      await load();
    } catch (e2) {
      alert(e2?.response?.data?.message || "Failed to add vehicle");
    }
  };

  return (
    <div>
      <h1>Vehicles</h1>

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
          placeholder="Search by title / number / type..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "..." : "Search"}
        </button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Vehicle No.</th>
              <th>Type</th>
              <th>Trans.</th>
              <th>Fuel</th>
              <th>Rate/Day</th>
              <th>Status</th>
              <th>Mileage</th>
              <th>Next Service</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", padding: 18 }}>
                  {loading ? "Loading..." : "No vehicles"}
                </td>
              </tr>
            ) : (
              rows.map((v) => (
                <tr key={v.vehicle_id}>
                  <td style={{ width: 86 }}>
                    {v.image_path ? (
                      <img
                        alt="vehicle"
                        src={v.image_path ? `${fileBase}${v.image_path}` : "/no-image.png"}
                        style={{ width: 72, height: 44, objectFit: "cover", borderRadius: 10 }}
                      />
                    ) : (
                      <span style={{ color: "#64748B" }}>—</span>
                    )}
                  </td>
                  <td>{v.title}</td>
                  <td>{v.vehicle_number}</td>
                  <td>{v.vehicle_type}</td>
                  <td>{v.transmission}</td>
                  <td>{v.fuel_type}</td>
                  <td>{v.daily_rate ? v.daily_rate : "—"}</td>
                  <td>
                    {v.status === "pending" ? (
                      <span style={{ color: "#b45309", fontWeight: 900 }}>pending</span>
                    ) : (
                      v.status
                    )}
                  </td>
                  <td>{v.current_mileage}</td>
                  <td>{v.next_service_mileage}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ✅ Add Vehicle Form UNDER table */}
        <h3 className="section-title">Add Vehicle</h3>

        <form className="add-user-form" onSubmit={onCreate}>
          <div className="field">
            <label>Title</label><br />
            <input
              placeholder="Toyota Axio"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>

          <div className="field">
            <label>Vehicle Number</label><br />
            <input
              placeholder="CAA-1234"
              value={form.vehicle_number}
              onChange={(e) => setForm((p) => ({ ...p, vehicle_number: e.target.value }))}
              required
            />
          </div>

          <div className="field">
            <label>Vehicle Type</label><br />
            <input
              placeholder="Sedan"
              value={form.vehicle_type}
              onChange={(e) => setForm((p) => ({ ...p, vehicle_type: e.target.value }))}
              required
            />
          </div>

          {/* ❌ Daily rate removed */}

          <div className="field">
            <label>Transmission</label><br />
            <select
              value={form.transmission}
              onChange={(e) => setForm((p) => ({ ...p, transmission: e.target.value }))}
            >
              <option value="auto">auto</option>
              <option value="manual">manual</option>
            </select>
          </div>

          <div className="field">
            <label>Fuel Type</label><br />
            <select
              value={form.fuel_type}
              onChange={(e) => setForm((p) => ({ ...p, fuel_type: e.target.value }))}
            >
              <option value="petrol">petrol</option>
              <option value="diesel">diesel</option>
              <option value="hybrid">hybrid</option>
              <option value="electric">electric</option>
            </select>
          </div>

          {/* ❌ Status removed (always pending) */}

          <div className="field">
            <label>Current Mileage (km)</label><br />
            <input
              type="number"
              value={form.current_mileage}
              onChange={(e) => setForm((p) => ({ ...p, current_mileage: e.target.value }))}
            />
          </div>

          <div className="field">
            <label>Last Service Mileage (km)</label><br />
            <input
              type="number"
              value={form.last_service_mileage}
              onChange={(e) => setForm((p) => ({ ...p, last_service_mileage: e.target.value }))}
            />
          </div>

          <div className="field">
            <label>Service Interval (km)</label><br />
            <input
              type="number"
              value={form.service_interval}
              onChange={(e) => setForm((p) => ({ ...p, service_interval: e.target.value }))}
            />
          </div>

          <div className="field">
            <label>Next Service Mileage (km)</label><br />
            <input
              type="number"
              value={form.next_service_mileage}
              onChange={(e) => setForm((p) => ({ ...p, next_service_mileage: e.target.value }))}
            />
          </div>

          <div className="field file-field" style={{ gridColumn: "span 2" }}>
            <label>Vehicle Image (JPG/PNG/WEBP)</label><br />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          <button type="submit" className="submit-btn" style={{ gridColumn: "span 2" }}>
            Submit Vehicle (Admin Approval)
          </button>
        </form>
      </div>
    </div>
  );
}