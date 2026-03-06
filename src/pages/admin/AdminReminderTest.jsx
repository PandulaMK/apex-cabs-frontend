import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminReminderTest() {
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);

  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedOwnerEmail, setSelectedOwnerEmail] = useState("");

  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [uRes, oRes] = await Promise.all([
          api.get("/admin/users?search="), // customers list
          api.get("/admin/owners?search="), // owners list
        ]);
        setUsers(uRes.data || []);
        setOwners(oRes.data || []);
      } catch (e) {
        alert(e?.response?.data?.message || "Failed to load users/owners");
      }
    })();
  }, []);

  const sendTest = async (to, type) => {
    try {
      setSending(true);
      await api.post("/admin/reminders/test-email", { to, type });
      alert(`✅ Test email sent to ${to}`);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to send test email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="admin-table-wrap" style={{ marginTop: 18 }}>
      <h3 style={{ margin: "8px 0 14px" }}>Reminder Test Panel (Manual)</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Customer test */}
        <div style={{ background: "#fff", padding: 14, borderRadius: 12 }}>
          <b>Test Payment Reminder (Customer)</b>
          <select
            style={{ width: "100%", height: 40, marginTop: 10 }}
            value={selectedUserEmail}
            onChange={(e) => setSelectedUserEmail(e.target.value)}
          >
            <option value="">Select customer email</option>
            {users
              .filter((u) => u.role === "customer")
              .map((u) => (
                <option key={u.user_id} value={u.email}>
                  {u.full_name} - {u.email}
                </option>
              ))}
          </select>

          <button
            disabled={!selectedUserEmail || sending}
            style={{ marginTop: 10 }}
            className="edit-btn"
            onClick={() => sendTest(selectedUserEmail, "payment")}
            type="button"
          >
            {sending ? "Sending..." : "Send Test Payment Email"}
          </button>
        </div>

        {/* Owner test */}
        <div style={{ background: "#fff", padding: 14, borderRadius: 12 }}>
          <b>Test Maintenance Reminder (Owner)</b>
          <select
            style={{ width: "100%", height: 40, marginTop: 10 }}
            value={selectedOwnerEmail}
            onChange={(e) => setSelectedOwnerEmail(e.target.value)}
          >
            <option value="">Select owner email</option>
            {owners.map((o) => (
              <option key={o.user_id} value={o.email}>
                {o.full_name} - {o.email}
              </option>
            ))}
          </select>

          <button
            disabled={!selectedOwnerEmail || sending}
            style={{ marginTop: 10 }}
            className="edit-btn"
            onClick={() => sendTest(selectedOwnerEmail, "maintenance")}
            type="button"
          >
            {sending ? "Sending..." : "Send Test Maintenance Email"}
          </button>
        </div>
      </div>
    </div>
  );
}