import CountUp from "../CountUp"; // ✅ adjust path if needed
import "./gauge.css";

export default function GaugeCard({ label, value, max = 10 }) {
  const safeMax = Math.max(1, Number(max) || 1);
  const safeVal = Math.max(0, Number(value) || 0);

  // 0..1
  const pct = Math.min(1, safeVal / safeMax);

  // semi circle degrees 0..180
  let angle = pct * 180;

  // ✅ if value > 0 but angle tiny, force a minimum visible slice
  if (safeVal > 0 && angle < 10) angle = 10;

  return (
    <div className="gaugeCard">
      <div className="gaugeWrap">
        <div
          className="gauge"
          style={{
            background: `conic-gradient(
              #fbbf24 0deg ${Math.min(angle, 90)}deg,
              #ef4444 ${Math.min(angle, 90)}deg ${angle}deg,
              #e5e7eb ${angle}deg 180deg,
              transparent 180deg 360deg
            )`,
          }}
        />
        <div className="gaugeCut" />
      </div>

      <div className="gaugeLabel">{label}</div>

      {/* ✅ Animated number below gauge */}
      <div className="gaugeNumber">
        <CountUp end={safeVal} duration={900} />
      </div>
    </div>
  );
}