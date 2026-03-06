import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    alert(" Message saved.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <section style={styles.section}>
        <h2 style={styles.title}>Contact Us</h2>
        <p style={styles.subtitle}>
          Need help with a booking or want to ask about a vehicle? Contact Apex Cabs anytime.
        </p>

        {/* Contact Cards */}
        <div style={styles.cardRow}>
          <div style={styles.infoCard}>
            <div style={styles.icon}>📍</div>
            <div>
              <div style={styles.label}>Address</div>
              <div style={styles.value}>Kandy, Sri Lanka</div>
            </div>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.icon}>✉️</div>
            <div>
              <div style={styles.label}>Email</div>
              <div style={styles.value}>info@apexcabs.lk</div>
            </div>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.icon}>📞</div>
            <div>
              <div style={styles.label}>Phone</div>
              <div style={styles.value}>+94 7X XXX XXXX</div>
            </div>
          </div>
        </div>

        {/* Form + Map */}
        <div style={styles.grid}>
          {/* Form */}
          <form onSubmit={onSubmit} style={styles.form}>
            <h3 style={styles.formTitle}>Send a message</h3>

            <label style={styles.formLabel}>Your Name</label>
            <input
              style={styles.input}
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Enter your name"
              required
            />

            <label style={styles.formLabel}>Email</label>
            <input
              style={styles.input}
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />

            <label style={styles.formLabel}>Message</label>
            <textarea
              style={styles.textarea}
              name="message"
              value={form.message}
              onChange={onChange}
              placeholder="Type your message..."
              required
            />

            <button type="submit" style={styles.btn}>
              Send Message
            </button>
          </form>

          {/* Map Placeholder (later replace with Google Map iframe) */}
          <div style={styles.mapBox}>
            <div style={styles.mapTitle}>Our Location</div>
            
              <div style={styles.mapContainer}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3957.461442323402!2d80.58745207400196!3d7.301940992705761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwMTgnMDcuMCJOIDgwwrAzNScyNC4xIkU!5e0!3m2!1sen!2slk!4v1772107152402!5m2!1sen!2slk"
                  width="100%"
                  height="250"
                  style={{ border: 0, borderRadius: 14 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Apex Cabs Location"
                ></iframe>
              </div>
            

            <div style={styles.hours}>
              <div style={styles.hoursTitle}>Working Hours</div>
              <div style={styles.hoursLine}>Mon – Sat: 8.30 AM – 7.00 PM</div>
              <div style={styles.hoursLine}>Sunday: 9.00 AM – 2.00 PM</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  section: {
    background: "#FFFFFF",
    borderRadius: 16,
    border: "1px solid #E2E8F0",
    padding: 22,
  },
  title: {
    textAlign: "center",
    margin: 0,
    marginBottom: 10,
    fontWeight: 900,
    color: "#1F2937",
    fontSize: 28,
  },
  subtitle: {
    textAlign: "center",
    margin: 0,
    marginBottom: 18,
    color: "#64748B",
    fontWeight: 700,
  },

  cardRow: {
    display: "flex",
    gap: 14,
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 18,
  },
  infoCard: {
    minWidth: 240,
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
  },
  icon: { fontSize: 20 },
  label: { fontSize: 12, color: "#64748B", fontWeight: 800 },
  value: { fontSize: 14, color: "#1F2937", fontWeight: 900 },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
    alignItems: "start",
  },

  form: {
    borderRadius: 16,
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    padding: 18,
  },
  formTitle: { margin: 0, marginBottom: 12, fontWeight: 900, color: "#1F2937" },
  formLabel: { marginTop: 10, display: "block", fontWeight: 800, fontSize: 12, color: "#334155" },
  input: {
    width: "100%",
    height: 38,
    borderRadius: 10,
    border: "1px solid #E2E8F0",
    padding: "0 12px",
    marginTop: 6,
    outline: "none",
    background: "#F8FAFC",
    fontWeight: 700,
  },
  textarea: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    border: "1px solid #E2E8F0",
    padding: 12,
    marginTop: 6,
    outline: "none",
    background: "#F8FAFC",
    fontWeight: 700,
    resize: "none",
  },
  btn: {
    marginTop: 14,
    width: "100%",
    height: 40,
    borderRadius: 10,
    border: "none",
    background: "#2563EB",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  mapBox: {
    borderRadius: 16,
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    padding: 18,
  },
  mapTitle: { fontWeight: 900, color: "#1F2937", marginBottom: 10 },
  mapPlaceholder: {
    height: 200,
    borderRadius: 14,
    background: "#FFFFFF",
    border: "2px dashed #CBD5E1",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    color: "#64748B",
    textAlign: "center",
  },
  hours: { marginTop: 14 },
  hoursTitle: { fontWeight: 900, color: "#1F2937", marginBottom: 6 },
  hoursLine: { color: "#334155", fontWeight: 700, fontSize: 13 },

  mapContainer: {
  borderRadius: 14,
  overflow: "hidden",
  border: "1px solid #E2E8F0",
},
};