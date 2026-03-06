import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import  api  from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    nic: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    setLoading(true);
    await api.post("/auth/register", {
      full_name: form.full_name,
      email: form.email,
      password: form.password,
      nic: form.nic,
    });

    alert("✅ Account created successfully. Now login.");
    navigate("/login");
  } catch (err) {
    alert(err?.response?.data?.message || "Register failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.sub}>Sign up to rent vehicles and track bookings</p>

        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            name="full_name"
            placeholder="Enter full name"
            value={form.full_name}
            onChange={onChange}
          />

          <label style={styles.label}>NIC</label>
          <input
            style={styles.input}
            name="nic"
            placeholder="Enter NIC number"
            value={form.nic}
            onChange={onChange}
          />

          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            name="email"
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={onChange}
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            name="password"
            type="password"
            placeholder="Create password"
            value={form.password}
            onChange={onChange}
          />

          <label style={styles.label}>Confirm Password</label>
          <input
            style={styles.input}
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={onChange}
          />

          <button style={styles.btn} disabled={loading}>
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <div style={styles.bottom}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { display: "flex", justifyContent: "center", padding: "40px 12px" },
  card: {
  width: "100%",
  maxWidth: 460,
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 18,
  padding: 22,
},
  title: { margin: 0, fontWeight: 900, color: "#1F2937", textAlign: "center" },
  sub: {
    margin: "8px 0 18px",
    color: "#64748B",
    fontWeight: 700,
    textAlign: "center",
  },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  label: { fontSize: 12, fontWeight: 900, color: "#334155" },
  input: {
    height: 40,
    borderRadius: 10,
    border: "1px solid #E2E8F0",
    padding: "0 12px",
    outline: "none",
    background: "#F8FAFC",
    fontWeight: 700,
  },
  btn: {
    marginTop: 10,
    height: 42,
    borderRadius: 10,
    border: "none",
    background: "#2563EB",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  bottom: { marginTop: 14, textAlign: "center", fontWeight: 700, color: "#64748B" },
  link: { color: "#2563EB", fontWeight: 900, textDecoration: "none" },
};