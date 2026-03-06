import { useEffect, useRef, useState } from "react";

export default function CountUp({ end = 100, duration = 1200, suffix = "" }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const startVal = 0;
    const endVal = Number(end) || 0;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const current = Math.floor(startVal + (endVal - startVal) * progress);
      setValue(current);

      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration]);

  return (
    <span>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}