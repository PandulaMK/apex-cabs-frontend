import { useEffect, useState } from "react";
import api from "../../services/api";
import "./adminTable.css";

export default function AdminOwners() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [createForm, setCreateForm] = useState({
    full_name: "",
    email: "",
    password: "",
    nic: "",
    address: "",
    phone_1: "",
    phone_2: "",
  });

  // ✅ edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/owners?search=${encodeURIComponent(search)}`);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load owners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const createOwner = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/owners", createForm);
      alert("✅ Owner created");
      setCreateForm({
        full_name: "",
        email: "",
        password: "",
        nic: "",
        address: "",
        phone_1: "",
        phone_2: "",
      });
      load();
    } catch (e) {
      alert(e?.response?.data?.message || "Create failed");
    }
  };

  // ✅ open edit modal
  const openEdit = (o) => {
    setEditForm({
      user_id: o.user_id,
      full_name: o.full_name || "",
      email: o.email || "",
      nic: o.nic || "",
      address: o.address || "",
      phone_1: o.phone_1 || "",
      phone_2: o.phone_2 || "",
      // optional (only if you want to update password)
      password: "",
    });
    setEditOpen(true);
  };

  // ✅ save edit
  const saveEdit = async () => {
    try {
      if (!editForm?.user_id) return;

      // If password is empty, don’t send it (avoid resetting password)
      const payload = { ...editForm };
      if (!payload.password) delete payload.password;

      await api.put(`/admin/owners/${editForm.user_id}`, payload);

      alert("✅ Owner updated");
      setEditOpen(false);
      setEditForm(null);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    }
  };

  // ✅ delete owner
  const removeOwner = async (o) => {
    if (!window.confirm(`Delete owner: ${o.full_name}?`)) return;
    try {
      await api.delete(`/admin/owners/${o.user_id}`);
      alert("✅ Owner deleted");
      load();
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h1>Vehicle Owners</h1>

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
          placeholder="Search owners..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "..." : "Search"}
        </button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>NIC</th>
              <th>Address</th>
              <th>Contact 01</th>
              <th>Contact 02</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 18 }}>
                  {loading ? "Loading..." : "No owners"}
                </td>
              </tr>
            ) : (
              rows.map((o) => (
                <tr key={o.user_id}>
                  <td>{o.full_name}</td>
                  <td>{o.nic}</td>
                  <td>{o.address || "-"}</td>
                  <td>{o.phone_1 || "-"}</td>
                  <td>{o.phone_2 || "-"}</td>
                  <td>{o.email}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="edit-btn" type="button" onClick={() => openEdit(o)}>
                      Edit
                    </button>

                    <button
                      className="edit-btn"
                      type="button"
                      style={{ background: "#0f172a" }}
                      onClick={() => removeOwner(o)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Add New Owner</h2>
      <form className="add-user-form" onSubmit={createOwner}>
        <input
          name="full_name"
          placeholder="Full Name"
          value={createForm.full_name}
          onChange={(e) => setCreateForm((p) => ({ ...p, [e.target.name]: e.target.value }))}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={createForm.email}
          onChange={(e) => setCreateForm((p) => ({ ...p, [e.target.name]: e.target.value }))}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={createForm.password}
          onChange={(e) => setCreateForm((p) => ({ ...p, [e.target.name]: e.target.value }))}
          required
        />
        <input
          name="nic"
          placeholder="NIC"
          value={createForm.nic}
          onChange={(e) => setCreateForm((p) => ({ ...p, [e.target.name]: e.target.value }))}
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={createForm.address}
          onChange={(e) => setCreateForm((p) => ({ ...p, [e.target.name]: e.target.value }))}
        />
        <input
          name="phone_1"
          placeholder="Phone 1"
          value={createForm.phone_1}
          onChange={(e) => setCreateForm((p) => ({ ...p, [e.target.name]: e.target.value }))}
        />
        <input
          name="phone_2"
          placeholder="Phone 2"
          value={createForm.phone_2}
          onChange={(e) => setCreateForm((p) => ({ ...p, [e.target.name]: e.target.value }))}
        />

        <button type="submit">Create Owner</button>
      </form>

      {/* ✅ Edit Modal */}
      {editOpen && editForm && (
        <div
          className="modal-backdrop"
          onClick={() => {
            setEditOpen(false);
            setEditForm(null);
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>Edit Owner</h2>

            <div className="field">
              <label>Full Name</label>
              <input
                value={editForm.full_name}
                onChange={(e) => setEditForm((p) => ({ ...p, full_name: e.target.value }))}
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                value={editForm.email}
                onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>

            <div className="field">
              <label>NIC</label>
              <input
                value={editForm.nic}
                onChange={(e) => setEditForm((p) => ({ ...p, nic: e.target.value }))}
              />
            </div>

            <div className="field">
              <label>Address</label>
              <input
                value={editForm.address}
                onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
              />
            </div>

            <div className="field">
              <label>Phone 1</label>
              <input
                value={editForm.phone_1}
                onChange={(e) => setEditForm((p) => ({ ...p, phone_1: e.target.value }))}
              />
            </div>

            <div className="field">
              <label>Phone 2</label>
              <input
                value={editForm.phone_2}
                onChange={(e) => setEditForm((p) => ({ ...p, phone_2: e.target.value }))}
              />
            </div>

            <div className="field">
              <label>New Password (optional)</label>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                value={editForm.password}
                onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))}
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                type="button"
                onClick={() => {
                  setEditOpen(false);
                  setEditForm(null);
                }}
              >
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