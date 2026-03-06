import "./ownerGauge.css";

export default function OwnerGaugeCard({ title, value = 0, max = 50 }) {
  const v = Number(value) || 0;
  const m = Number(max) || 50;
  const pct = Math.max(0, Math.min(100, (v / m) * 100));

  return (
    <div className="og-card">
      <div className="og-gauge" style={{ "--pct": `${pct}%` }}>
        <div className="og-hole">
          <div className="og-value">{v}</div>
        </div>
      </div>

      <div className="og-title">{title}</div>
    </div>
  );
}