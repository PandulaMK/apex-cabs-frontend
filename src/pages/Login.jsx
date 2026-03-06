import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import  api  from "../services/api";
import LoginLoader from "../components/LoginLoader";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
  e.preventDefault();
  if (loading) return <LoginLoader/>;

  try {
    setLoading(true);

    const { data } = await api.post("/auth/login", {
      email: form.email,
      password: form.password,
    });

    // ✅ save auth
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("userRole", data.user.role); // optional, but ok

    

    const role = data?.user?.role;

    if (role === "admin") {
      alert("✅ Admin login successful");
      return navigate("/admin/dashboard");
    }

    if (role === "owner") {
      alert("✅ Owner login successful");
      return navigate("/owner/dashboard");
    }

    alert("✅ Login successful");
    return navigate("/profile");
  } catch (err) {
    alert(err?.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.sub}>Login to manage your bookings and profile</p>

        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={onChange}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={onChange}
            required
          />

          <button style={styles.btn} disabled={loading} type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={styles.bottom}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.link}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    justifyContent: "center",
    padding: "40px 12px",
  },
  card: {
  width: "100%",
  maxWidth: 420,
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
  bottom: {
    marginTop: 14,
    textAlign: "center",
    fontWeight: 700,
    color: "#64748B",
  },
  link: { color: "#2563EB", fontWeight: 900, textDecoration: "none" },
};