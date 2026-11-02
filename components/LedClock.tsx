"use client";

import { useEffect, useState } from "react";

const DOTS = Array.from({ length: 60 }, (_, i) => i);
const R = 56;

/**
 * Decorative dot-ring clock, nodding to a hybrid POV LED clock: a lit minute bar
 * plus an hour hand that snaps to the hour. Updates once a minute (no sweep).
 * Reduced-motion users get a single static reading with no timer.
 */
export function LedClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<{ h: number; m: number } | null>(null);

  useEffect(() => {
    const read = () => {
      const d = new Date();
      setTime({ h: d.getHours() % 12, m: d.getMinutes() });
    };
    read();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const align = setTimeout(() => {
      read();
      interval = setInterval(read, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      clearTimeout(align);
      if (interval) clearInterval(interval);
    };
  }, []);

  const hourAngle = time ? (time.h / 12) * 2 * Math.PI : 0;

  return (
    <svg className={`led-clock ${className}`} viewBox="0 0 140 140" aria-hidden="true" focusable="false">
      {DOTS.map((i) => {
        const a = (i / 60) * 2 * Math.PI - Math.PI / 2;
        // Lit "bar": the current minute and the four dots behind it.
        const on = time ? (time.m - i + 60) % 60 < 5 : false;
        return (
          <circle
            key={i}
            className={on ? "dot on" : "dot"}
            cx={70 + R * Math.cos(a)}
            cy={70 + R * Math.sin(a)}
            r={i % 5 === 0 ? 2.4 : 1.6}
          />
        );
      })}
      {time ? (
        <line
          className="hand"
          x1="70"
          y1="70"
          x2={70 + 30 * Math.sin(hourAngle)}
          y2={70 - 30 * Math.cos(hourAngle)}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ) : null}
      <circle cx="70" cy="70" r="2.5" fill="var(--color-ink)" />
    </svg>
  );
}
