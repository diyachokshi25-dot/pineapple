"use client";

// Counter-style animation for the big square rating window.
// It counts 0.0 up to the value the API handed it — pure display,
// it never computes the average itself.
import { useEffect, useState } from "react";

export default function RatingCounter({
  value,
  className = "",
}: {
  value: number | null;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === null) return;
    const duration = 1200;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out
      setDisplay(value * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  if (value === null) {
    return (
      <span className={`block text-6xl font-black text-cream/80 ${className}`}>
        –
      </span>
    );
  }

  return (
    <span className={`block text-6xl font-black text-white tabular-nums ${className}`}>
      {display.toFixed(1)}
    </span>
  );
}
