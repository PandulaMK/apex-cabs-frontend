import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./adminTable.css";

const emptyForm = {
  _id: "", 
  title: "",
  vehicle_number: "",
  vehicle_type: "",
  transmission: "auto",
  fuel_type: "petrol",
  daily_rate: "",
  status: "available",
  current_mileage: 0,
  last_service_mileage: 0,
  service_interval: 5000,
  next_service_mileage: 5000,
};
export default function AdminVehicles() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // add form
  const [form, setForm] = useState({ ...emptyForm });
  const [imageFile, setImageFile] = useState(null);

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [editImage, setEditImage] = useState(null);

  const fileBase = useMemo(() => {
  const base = api.defaults?.baseURL || "";
  return base.replace(/\/api\/?$/, ""); // removes /api at the end
}, []);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/vehicles?search=${encodeURIComponent(search)}`);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };
  const [owners, setOwners] = useState([]);

const loadOwners = async () => {
  try {
    const { data } = await api.get("/admin/vehicle-owners");
    setOwners(Array.isArray(data) ? data : []);
  } catch (e) {
    alert(e?.response?.data?.message || "Failed to load owners");
  }
};

  useEffect(() => {
  load();
  loadOwners();
  // eslint-disable-next-line
}, []);

  const onCreate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v ?? "")));
      if (imageFile) fd.append("image", imageFile);

      await api.post("/admin/vehicles", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Vehicle added");
      setForm({ ...emptyForm });
      setImageFile(null);
      await load();
    } catch (e2) {
      alert(e2?.response?.data?.message || "Failed to add vehicle");
    }
  };

  const openEdit = (v) => {
    setEdit({
      owner_id: v.owner_id ?? "",
      vehicle_id: v.vehicle_id,
      title: v.title || "",
      vehicle_number: v.vehicle_number || "",
      vehicle_type: v.vehicle_type || "",
      transmission: v.transmission || "auto",
      fuel_type: v.fuel_type || "petrol",
      daily_rate: v.daily_rate ?? "",
      status: v.status || "available",
      current_mileage: v.current_mileage ?? 0,
      last_service_mileage: v.last_service_mileage ?? 0,
      service_interval: v.service_interval ?? 5000,
      next_service_mileage: v.next_service_mileage ?? 5000,
      image_path: v.image_path || null,
    });
    setEditImage(null);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    try {
      if (!edit?.vehicle_id) return;

      const fd = new FormData();
      Object.entries(edit).forEach(([k, v]) => {
        if (k === "vehicle_id" || k === "image_path") return;
        fd.append(k, String(v ?? ""));
      });
      if (editImage) fd.append("image", editImage);

      await api.put(`/admin/vehicles/${edit.vehicle_id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Vehicle updated");
      setEditOpen(false);
      setEdit(null);
      setEditImage(null);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    }
  };

  const remove = async (vehicleId) => {
    if (!window.confirm("Delete this vehicle?")) return;
    try {
      await api.delete(`/admin/vehicles/${vehicleId}`);
      alert("✅ Vehicle deleted");
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
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
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: "center", padding: 18 }}>
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
                  <td>{v.daily_rate}</td>
                  <td>{v.status}</td>
                  <td>{v.current_mileage}</td>
                  <td>{v.next_service_mileage}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="edit-btn" type="button" onClick={() => openEdit(v)}>
                      Edit
                    </button>
                    <button
                      className="edit-btn"
                      type="button"
                      onClick={() => remove(v.vehicle_id)}
                      style={{ background: "#0f172a" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ✅ Add Vehicle Form UNDER table */}
<h3 className="section-title">Add Vehicle</h3>

<form className="add-user-form" onSubmit={onCreate}>

  <div className="field">
  <label>
    Vehicle Owner <span className="hint">(optional)</span>
  </label><br/>
  <select
    value={form.owner_id}
    onChange={(e) => setForm((p) => ({ ...p, owner_id: e.target.value }))}
  >
    <option value="">— Select Owner —</option>
    {owners.map((o) => (
      <option key={o.user_id} value={o.user_id}>
        {o.full_name} ({o.phone_1 || o.email})
      </option>
    ))}
  </select>
</div>

  <div className="field">
    <label>
      Title <span className="hint">(e.g., Toyota Axio)</span>
    </label><br/>
    <input
      placeholder="Toyota Axio"
      value={form.title}
      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
      required
    />
  </div>

  <div className="field">
    <label>
      Vehicle Number <span className="hint">(e.g., CAA-1234)</span>
    </label><br/>
    <input
      placeholder="CAA-1234"
      value={form.vehicle_number}
      onChange={(e) => setForm((p) => ({ ...p, vehicle_number: e.target.value }))}
      required
    />
  </div>

  <div className="field">
    <label>
      Vehicle Type <span className="hint">(e.g., Sedan / SUV)</span>
    </label><br/>
    <input
      placeholder="Sedan"
      value={form.vehicle_type}
      onChange={(e) => setForm((p) => ({ ...p, vehicle_type: e.target.value }))}
      required
    />
  </div>

  <div className="field">
    <label>
      Daily Rate <span className="hint">(LKR per day)</span>
    </label><br/>
    <input
      placeholder="10000"
      type="number"
      value={form.daily_rate}
      onChange={(e) => setForm((p) => ({ ...p, daily_rate: e.target.value }))}
      required
    />
  </div>

  <div className="field">
    <label>
      Transmission <span className="hint">(Auto / Manual)</span>
    </label><br/>
    <select
      value={form.transmission}
      onChange={(e) => setForm((p) => ({ ...p, transmission: e.target.value }))}
    >
      <option value="auto">auto</option>
      <option value="manual">manual</option>
    </select>
  </div>

  <div className="field">
    <label>
      Fuel Type <span className="hint">(Petrol / Diesel / Hybrid)</span>
    </label><br/>
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

  <div className="field">
    <label>
      Status <span className="hint">(Availability)</span>
    </label><br/>
    <select
      value={form.status}
      onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
    >
      <option value="available">available</option>
      <option value="unavailable">unavailable</option>
      <option value="maintenance">maintenance</option>
    </select>
  </div>

  <div className="field">
    <label>
      Current Mileage <span className="hint">(km)</span>
    </label><br/>
    <input
      type="number"
      placeholder="0"
      value={form.current_mileage}
      onChange={(e) => setForm((p) => ({ ...p, current_mileage: e.target.value }))}
    />
  </div>

  <div className="field">
    <label>
      Last Service Mileage <span className="hint">(km)</span>
    </label><br/>
    <input
      type="number"
      placeholder="0"
      value={form.last_service_mileage}
      onChange={(e) => setForm((p) => ({ ...p, last_service_mileage: e.target.value }))}
    />
  </div>

  <div className="field">
    <label>
      Service Interval <span className="hint">(km, default 5000)</span>
    </label><br/>
    <input
      type="number"
      placeholder="5000"
      value={form.service_interval}
      onChange={(e) => setForm((p) => ({ ...p, service_interval: e.target.value }))}
    />
  </div>

  <div className="field">
    <label>
      Next Service Mileage <span className="hint">(km)</span>
    </label><br/>
    <input
      type="number"
      placeholder="5000"
      value={form.next_service_mileage}
      onChange={(e) => setForm((p) => ({ ...p, next_service_mileage: e.target.value }))}
    />
  </div>

  <div className="field file-field" style={{ gridColumn: "span 2" }}>
    <label>
      Vehicle Image <span className="hint">(JPG/PNG/WEBP)</span>
    </label><br/>
    <input
      type="file"
      accept="image/png,image/jpeg,image/webp"
      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
    />
  </div>

  <button type="submit" className="submit-btn" style={{ gridColumn: "span 2" }}>
    Add Vehicle
  </button>
</form>
</div>

      {/* ✅ Edit Modal */}
{editOpen && edit && (
  <div className="modal-backdrop" onClick={() => setEditOpen(false)}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <h2 style={{ marginTop: 0 }}>Edit Vehicle</h2>

      {edit.image_path && (
        <img
          alt="current"
          src={edit.image_path ? `${fileBase}${edit.image_path}` : "/no-image.png"}
          className="modal-image"
        />
      )}


      <div className="field">
  <label>
    Vehicle Owner <span className="hint">(optional)</span>
  </label>
  <select
    value={edit.owner_id ?? ""}
    onChange={(e) => setEdit((p) => ({ ...p, owner_id: e.target.value }))}
  >
    <option value="">— Select Owner —</option>
    {owners.map((o) => (
      <option key={o.user_id} value={o.user_id}>
        {o.full_name} ({o.phone_1 || o.email})
      </option>
    ))}
  </select>
</div>

      <div className="field">
        <label>
          Title <span className="hint">(e.g., Toyota Axio)</span>
        </label>
        <input
          value={edit.title}
          onChange={(e) => setEdit((p) => ({ ...p, title: e.target.value }))}
        />
      </div>

      <div className="field">
        <label>
          Vehicle Number <span className="hint">(e.g., CAA-1234)</span>
        </label>
        <input
          value={edit.vehicle_number}
          onChange={(e) => setEdit((p) => ({ ...p, vehicle_number: e.target.value }))}
        />
      </div>

      <div className="field">
        <label>
          Vehicle Type <span className="hint">(Sedan / SUV)</span>
        </label>
        <input
          value={edit.vehicle_type}
          onChange={(e) => setEdit((p) => ({ ...p, vehicle_type: e.target.value }))}
        />
      </div>

      <div className="field">
        <label>
          Transmission <span className="hint">(Auto / Manual)</span>
        </label>
        <select
          value={edit.transmission}
          onChange={(e) => setEdit((p) => ({ ...p, transmission: e.target.value }))}
        >
          <option value="auto">auto</option>
          <option value="manual">manual</option>
        </select>
      </div>

      <div className="field">
        <label>
          Fuel Type <span className="hint">(Petrol / Diesel / Hybrid)</span>
        </label>
        <select
          value={edit.fuel_type}
          onChange={(e) => setEdit((p) => ({ ...p, fuel_type: e.target.value }))}
        >
          <option value="petrol">petrol</option>
          <option value="diesel">diesel</option>
          <option value="hybrid">hybrid</option>
          <option value="electric">electric</option>
        </select>
      </div>

      <div className="field">
        <label>
          Rate per Day <span className="hint">(LKR)</span>
        </label>
        <input
          type="number"
          value={edit.daily_rate}
          onChange={(e) => setEdit((p) => ({ ...p, daily_rate: e.target.value }))}
        />
      </div>

      <div className="field">
        <label>
          Status <span className="hint">(Availability)</span>
        </label>
        <select
          value={edit.status}
          onChange={(e) => setEdit((p) => ({ ...p, status: e.target.value }))}
        >
          <option value="available">available</option>
          <option value="unavailable">unavailable</option>
          <option value="maintenance">maintenance</option>
        </select>
      </div>

      <div className="field">
        <label>
          Current Mileage <span className="hint">(km)</span>
        </label>
        <input
          type="number"
          value={edit.current_mileage}
          onChange={(e) => setEdit((p) => ({ ...p, current_mileage: e.target.value }))}
        />
      </div>

      <div className="field">
        <label>
          Next Service Mileage <span className="hint">(km)</span>
        </label>
        <input
          type="number"
          value={edit.next_service_mileage}
          onChange={(e) => setEdit((p) => ({ ...p, next_service_mileage: e.target.value }))}
        />
      </div>

      <div className="field">
        <label>
          Change Image <span className="hint">(optional)</span>
        </label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setEditImage(e.target.files?.[0] || null)}
        />
      </div>

      <div className="modal-actions">
        <button className="btn-secondary" type="button" onClick={() => setEditOpen(false)}>
          Cancel
        </button>
        <button className="btn-primary" type="button" onClick={saveEdit}>
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}