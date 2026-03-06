import { useEffect, useState } from "react";
import api from "../../services/api";
import "./adminTable.css";

export default function Users() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Create user form
  const [createForm, setCreateForm] = useState({
    full_name: "",
    email: "",
    password: "",
    nic: "",
    address: "",
    phone_1: "",
    phone_2: "",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/users?search=${encodeURIComponent(search)}`);
      setRows(data);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const openEdit = (u) => {
    setEditUser({
      user_id: u.user_id,
      full_name: u.full_name || "",
      address: u.address || "",
      phone_1: u.phone_1 || "",
      phone_2: u.phone_2 || "",
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    try {
      await api.put(`/admin/users/${editUser.user_id}`, {
        full_name: editUser.full_name,
        address: editUser.address,
        phone_1: editUser.phone_1,
        phone_2: editUser.phone_2,
      });

      setEditOpen(false);
      setEditUser(null);
      fetchUsers();
      alert("✅ Updated");
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  const onCreateChange = (e) =>
    setCreateForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/users", createForm);
      alert("✅ User created");

      setCreateForm({
        full_name: "",
        email: "",
        password: "",
        nic: "",
        address: "",
        phone_1: "",
        phone_2: "",
      });

      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div>
      <h1>Users</h1>

      <form className="admin-search" onSubmit={onSearch}>
        <input
          placeholder="Search (name / email / NIC / phone)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
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
              <th>Updates</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 18 }}>
                  {loading ? "Loading..." : "No users found"}
                </td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr key={u.user_id}>
                  <td>{u.full_name}</td>
                  <td>{u.nic}</td>
                  <td>{u.address || "-"}</td>
                  <td>{u.phone_1 || "-"}</td>
                  <td>{u.phone_2 || "-"}</td>
                  <td>{u.email}</td>
                  <td>
                    <button type="button" className="edit-btn" onClick={() => openEdit(u)}>
                      Edit
                    </button>
                    <button
                      className="edit-btn"
                      type="button"
                      style={{ background: "#0f172a" }}
                      onClick={async () => {
                        if (!window.confirm(`Delete user: ${u.full_name}?`)) return;
                        try {
                          await api.delete(`/admin/users/${u.user_id}`);
                          alert("✅ User deleted");
                          load(); // reload list
                        } catch (e) {
                          alert(e?.response?.data?.message || "Delete failed");
                        }
                      }}
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

      {/* ✅ Add user form under table */}
      <h2 className="section-title">Add New User</h2>

      <form onSubmit={createUser} className="add-user-form">
        <input name="full_name" placeholder="Full Name" value={createForm.full_name} onChange={onCreateChange} required />
        <input name="email" placeholder="Email" value={createForm.email} onChange={onCreateChange} required />
        <input name="password" placeholder="Password" type="password" value={createForm.password} onChange={onCreateChange} required />
        <input name="nic" placeholder="NIC" value={createForm.nic} onChange={onCreateChange} required />
        <input name="address" placeholder="Address" value={createForm.address} onChange={onCreateChange} />
        <input name="phone_1" placeholder="Phone 1" value={createForm.phone_1} onChange={onCreateChange} />
        <input name="phone_2" placeholder="Phone 2" value={createForm.phone_2} onChange={onCreateChange} />

        <button type="submit">Create User</button>
      </form>

      {/* ✅ Edit modal */}
      {editOpen && editUser && (
        <div className="modal-backdrop" onClick={() => setEditOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit User</h2>

            <label>Full Name</label>
            <input
              value={editUser.full_name}
              onChange={(e) => setEditUser((p) => ({ ...p, full_name: e.target.value }))}
            />

            <label>Address</label>
            <input
              value={editUser.address}
              onChange={(e) => setEditUser((p) => ({ ...p, address: e.target.value }))}
            />

            <label>Phone 1</label>
            <input
              value={editUser.phone_1}
              onChange={(e) => setEditUser((p) => ({ ...p, phone_1: e.target.value }))}
            />

            <label>Phone 2</label>
            <input
              value={editUser.phone_2}
              onChange={(e) => setEditUser((p) => ({ ...p, phone_2: e.target.value }))}
            />

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setEditOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}