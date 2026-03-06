import fleetImg from "../assets/about/fleet.png";

export default function About() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <section style={styles.section}>
        <h2 style={styles.title}>About Us</h2>

        <div style={styles.aboutGrid}>
          <div style={styles.aboutTextBox}>
            <p style={styles.aboutText}>
              Apex Cabs is a modern car rental service designed to simplify the way
              vehicles are rented and managed. We provide reliable, well-maintained
              vehicles for customers while offering vehicle owners and administrators
              a smart digital platform to manage bookings, payments, and maintenance
              efficiently.
            </p>
            <p style={styles.aboutText}>
              Our system focuses on transparency, convenience, and reliability by
              automating key processes such as rent tracking, maintenance reminders,
              and booking management — ensuring a smoother rental experience for all
              users.
            </p>

            <div style={styles.points}>
              <div style={styles.point}>✅ Trusted & well-maintained vehicles</div>
              <div style={styles.point}>✅ Easy online booking & tracking</div>
              <div style={styles.point}>✅ Transparent pricing and records</div>
              <div style={styles.point}>✅ Support for customers & vehicle owners</div>
            </div>
          </div>

          <div style={styles.aboutImageBox}>
            <img
              src={fleetImg}
              alt="Apex Cabs Fleet"
              style={{
                width: "100%",
                height: "260px",
                objectFit: "cover",
                borderRadius: "14px",
              }}
            />
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
    marginBottom: 18,
    fontWeight: 900,
    color: "#1F2937",
    fontSize: 28,
  },
  aboutGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
    alignItems: "center",
  },
  aboutTextBox: {
    background: "#2563EB",
    borderRadius: 16,
    padding: 18,
    color: "#fff",
  },
  aboutText: {
    margin: 0,
    marginBottom: 12,
    lineHeight: 1.6,
    fontWeight: 500,
  },
  points: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    fontWeight: 700,
  },
  point: {
    background: "rgba(255,255,255,0.15)",
    padding: "10px 12px",
    borderRadius: 12,
  },
  aboutImageBox: {
    borderRadius: 16,
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    padding: 12,
  },
};