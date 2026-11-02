/** Decorative racing-line trace. Draws once on load; static under prefers-reduced-motion. */
export function LapTrace({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`lap-trace ${className}`}
      viewBox="0 0 400 160"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="line"
        pathLength={1}
        d="M30 120 C 30 60, 90 40, 150 50 S 230 110, 280 90 S 360 30, 350 80 S 300 140, 220 135 S 60 150, 30 120 Z"
        stroke="var(--color-accent)"
        strokeOpacity="0.7"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle className="car" cx="30" cy="120" r="3.5" fill="var(--color-accent)" />
    </svg>
  );
}
