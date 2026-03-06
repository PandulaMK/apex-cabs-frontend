export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.row}>
        <div style={styles.brand}>
          <div style={styles.brandName}>Apex Cabs</div>
          <div style={styles.brandText}>Reliable rides. Smarter rentals.</div>
        </div>

        <div style={styles.contactGrid}>
          <div style={styles.item}>
            <span style={styles.icon}>📍</span>
            <div>
              <div style={styles.label}>Address</div>
              <div style={styles.value}>Kandy, Sri Lanka</div>
            </div>
          </div>

          <div style={styles.item}>
            <span style={styles.icon}>✉️</span>
            <div>
              <div style={styles.label}>Email</div>
              <div style={styles.value}>info@apexcabs.lk</div>
            </div>
          </div>

          <div style={styles.item}>
            <span style={styles.icon}>📞</span>
            <div>
              <div style={styles.label}>Phone</div>
              <div style={styles.value}>+94 7X XXX XXXX</div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.bottom}>
        © {new Date().getFullYear()} Apex Cabs. All Rights Reserved.
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: "40px",
    borderTop: "1px solid #E2E8F0",
    background: "#FFFFFF",
    padding: "22px 24px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    flexWrap: "wrap",
  },
  brand: { minWidth: "220px" },
  brandName: { fontWeight: 800, color: "#1F2937" },
  brandText: { marginTop: "6px", color: "#64748B", fontSize: "14px" },
  contactGrid: {
    display: "flex",
    gap: "22px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  item: { display: "flex", gap: "10px", alignItems: "center" },
  icon: { fontSize: "18px" },
  label: { fontSize: "12px", color: "#64748B" },
  value: { fontSize: "14px", fontWeight: 600, color: "#1F2937" },
  bottom: {
    marginTop: "14px",
    paddingTop: "12px",
    borderTop: "1px solid #E2E8F0",
    color: "#64748B",
    fontSize: "13px",
    textAlign: "center",
  },
};
