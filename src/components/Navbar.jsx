// Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/icons/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/");
  };

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <img src={logo} alt="Apex Cabs" className="nav-logo" />
          <span>Apex Cabs</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/vehicles">Vehicles</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>

          {!token ? (
            <>
              <Link to="/login" className="loginBtn">Login</Link>
              <Link to="/register" className="signupBtn">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="loginBtn">
                {user?.full_name || "Profile"}
              </Link>
              <button onClick={logout} className="logoutBtn">Logout</button>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button className="nav-toggle" onClick={() => setOpen((s) => !s)}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="nav-mobile">
          <button onClick={() => go("/")}>Home</button>
          <button onClick={() => go("/vehicles")}>Vehicles</button>
          <button onClick={() => go("/about")}>About</button>
          <button onClick={() => go("/contact")}>Contact</button>

          {!token ? (
            <>
              <button onClick={() => go("/login")}>Login</button>
              <button className="signupBtn" onClick={() => go("/register")}>Sign Up</button>
            </>
          ) : (
            <>
              <button onClick={() => go("/profile")}>
                {user?.full_name || "Profile"}
              </button>
              <button className="logoutBtn" onClick={logout}>Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}