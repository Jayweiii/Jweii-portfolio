"use client";

import { useState } from "react";

/**
 * Hero drawing: a 2170 cylindrical cell in third-angle projection, the cell
 * format in the FSAE packs. Lines draw themselves once on load. Callouts can be
 * inspected, and the front view can be cut into a section.
 */

export type Part = "can" | "jelly" | "terminal";

const PARTS: { id: Part; n: string; label: string; note: string }[] = [
  {
    id: "can",
    n: "1",
    label: "Can",
    note: "Steel can, 21 mm across and 70 mm long — that’s the “2170”. On most cylindrical cells the can is the negative terminal.",
  },
  {
    id: "jelly",
    n: "2",
    label: "Jelly roll",
    note: "Anode, separator and cathode sheets wound into a tight spiral. This is where the energy lives.",
  },
  {
    id: "terminal",
    n: "3",
    label: "+ Terminal",
    note: "Positive cap. In the GR24 modules every cell is wire-bonded to the busbar, and the bond doubles as that cell’s fuse.",
  },
];

const BALLOONS: Record<Part, { x: number; label: string; leader: [number, number, number, number] }> = {
  can: { x: 80, label: "CAN", leader: [84, 84, 110, 130] },
  jelly: { x: 160, label: "JELLY ROLL", leader: [166, 84, 176, 137] },
  terminal: { x: 288, label: "+ TERMINAL", leader: [294, 84, 345, 158] },
};

function spiral(cx: number, cy: number, r0: number, r1: number, turns: number): string {
  const steps = turns * 48;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * Math.PI * 2;
    const r = r0 + (r1 - r0) * t;
    points.push(`${(cx + r * Math.cos(angle)).toFixed(1)} ${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return `M${points.join(" L")}`;
}

const SPIRAL = spiral(480, 172, 5, 31, 5);

type DrawingProps = {
  className?: string;
  compact?: boolean;
  active: Part | null;
  section: boolean;
  onPick: (part: Part) => void;
};

export function CellDrawing({ className = "", compact = false, active, section, onPick }: DrawingProps) {
  const thick = { strokeWidth: 2, vectorEffect: "non-scaling-stroke" as const };
  const thin = { strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const };
  const centre = { ...thin, strokeDasharray: "14 3 3 3" };
  const hidden = { ...thin, strokeDasharray: "6 4" };
  const text = {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    letterSpacing: "0.12em",
    fill: "currentColor",
    stroke: "none",
  };
  const d = (seconds: number) => ({ ["--d" as string]: `${seconds}s` }) as React.CSSProperties;
  const part = (p: Part) =>
    `transition-opacity duration-200 ${active === p ? "text-accent" : active ? "opacity-25" : ""}`;
  const hatchId = compact ? "hatch-c" : "hatch-f";

  return (
    <svg
      viewBox={compact ? "0 44 400 290" : "0 0 600 340"}
      aria-hidden="true"
      className={`select-none ${className}`}
      fill="none"
      stroke="currentColor"
    >
      <defs>
        <pattern id={hatchId} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="currentColor" strokeWidth="1.2" />
        </pattern>
      </defs>

      {/* Can */}
      <g className={part("can")}>
        <g style={d(0)}>
          <rect className="draw" pathLength={1} x="60" y="130" width="280" height="84" style={thick} />
        </g>
        <g style={d(0.35)}>
          <line className="draw" pathLength={1} x1="322" y1="130" x2="322" y2="214" style={thin} />
          <line className="draw" pathLength={1} x1="329" y1="130" x2="329" y2="214" style={thin} />
          <line className="draw" pathLength={1} x1="68" y1="130" x2="68" y2="214" style={thin} />
        </g>
        {section ? (
          <g stroke="none" fill={`url(#${hatchId})`}>
            <rect x="60" y="130" width="262" height="6" />
            <rect x="60" y="208" width="262" height="6" />
            <rect x="60" y="130" width="8" height="84" />
          </g>
        ) : null}
        {compact ? null : (
          <g style={d(0.2)}>
            <circle className="draw" pathLength={1} cx="480" cy="172" r="42" style={thick} />
          </g>
        )}
      </g>

      {/* Jelly roll */}
      <g className={part("jelly")}>
        {section ? (
          <g style={thin}>
            <rect x="76" y="137" width="240" height="70" />
            {[144, 151, 158, 165, 179, 186, 193, 200].map((y) => (
              <line key={y} x1="76" y1={y} x2="316" y2={y} />
            ))}
          </g>
        ) : (
          <g style={d(0.7)} className={active === "jelly" ? "" : "text-muted"}>
            <rect className="draw" pathLength={1} x="76" y="137" width="240" height="70" style={hidden} />
          </g>
        )}
        {compact ? null : section ? (
          <path d={SPIRAL} style={thin} />
        ) : (
          <g style={d(0.2)}>
            <circle className="draw" pathLength={1} cx="480" cy="172" r="33" style={thin} />
          </g>
        )}
      </g>

      {/* Positive terminal */}
      <g className={part("terminal")}>
        <g style={d(0)}>
          <rect className="draw" pathLength={1} x="340" y="158" width="9" height="28" style={thick} />
        </g>
        {compact ? null : (
          <g style={d(0.2)}>
            <circle
              className="draw"
              pathLength={1}
              cx="480"
              cy="172"
              r="14"
              style={thick}
              fill={section ? "var(--paper)" : "none"}
            />
          </g>
        )}
      </g>

      {/* Centre lines */}
      <g style={d(0.9)} className="text-muted">
        <line className="draw" pathLength={1} x1="40" y1="172" x2="366" y2="172" style={centre} />
        {compact ? null : (
          <>
            <line className="draw" pathLength={1} x1="426" y1="172" x2="534" y2="172" style={centre} />
            {section ? null : (
              <line className="draw" pathLength={1} x1="480" y1="118" x2="480" y2="226" style={centre} />
            )}
          </>
        )}
      </g>

      {/* Cutting plane A–A on the end view */}
      {section && !compact ? (
        <g className="text-accent">
          <line x1="480" y1="114" x2="480" y2="230" style={{ ...thick, strokeDasharray: "18 4 4 4" }} />
          <path d="M480 114 h14 M480 230 h14" style={thick} />
          <path d="M498 114 l-7 -3.5 v7 z M498 230 l-7 -3.5 v7 z" fill="currentColor" stroke="none" />
          <text x="506" y="118" style={{ ...text, fontSize: 12 }}>
            A
          </text>
          <text x="506" y="234" style={{ ...text, fontSize: 12 }}>
            A
          </text>
        </g>
      ) : null}

      {/* Projection lines between views */}
      {compact ? null : (
        <g style={d(1)} className="text-line">
          <line className="draw" pathLength={1} x1="356" y1="130" x2="476" y2="130" style={{ ...thin, strokeDasharray: "2 4" }} />
          <line className="draw" pathLength={1} x1="356" y1="214" x2="476" y2="214" style={{ ...thin, strokeDasharray: "2 4" }} />
        </g>
      )}

      {/* Dimensions */}
      <g className={`fade-in transition-opacity duration-200 ${active ? "opacity-40" : ""}`} style={d(1.2)}>
        <g style={thin}>
          <line x1="60" y1="220" x2="60" y2="276" />
          <line x1="340" y1="220" x2="340" y2="276" />
          <line x1="60" y1="268" x2="340" y2="268" />
          <line x1="54" y1="130" x2="18" y2="130" />
          <line x1="54" y1="214" x2="18" y2="214" />
          <line x1="26" y1="130" x2="26" y2="214" />
        </g>
        <g fill="currentColor" stroke="none">
          <path d="M60 268 l10 -3.5 v7 z" />
          <path d="M340 268 l-10 -3.5 v7 z" />
          <path d="M26 130 l-3.5 10 h7 z" />
          <path d="M26 214 l-3.5 -10 h7 z" />
        </g>
        <rect x="186" y="260" width="28" height="16" fill="var(--paper)" stroke="none" />
        <text x="200" y="272" textAnchor="middle" style={text}>
          70
        </text>
        <rect x="16" y="156" width="20" height="32" fill="var(--paper)" stroke="none" />
        <text x="26" y="176" textAnchor="middle" transform="rotate(-90 26 172)" style={text}>
          Ø21
        </text>
      </g>

      {/* Callout balloons — clickable; the buttons under the drawing do the same for keyboards */}
      <g className="fade-in" style={d(1.5)}>
        {PARTS.map(({ id, n }) => {
          const b = BALLOONS[id];
          const on = active === id;
          return (
            <g
              key={id}
              className={`cursor-pointer text-accent transition-opacity duration-200 ${active && !on ? "opacity-40" : ""}`}
              onClick={() => onPick(id)}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") onPick(id);
              }}
            >
              <line x1={b.leader[0]} y1={b.leader[1]} x2={b.leader[2]} y2={b.leader[3]} style={thin} />
              <circle cx={b.x} cy="72" r="22" fill="transparent" stroke="none" />
              <circle
                cx={b.x}
                cy="72"
                r="13"
                fill={on ? "currentColor" : "var(--paper)"}
                style={{ strokeWidth: 1.5 }}
              />
              <text
                x={b.x}
                y="76"
                textAnchor="middle"
                style={{ ...text, fontSize: 12, letterSpacing: 0, fill: on ? "var(--paper)" : "currentColor" }}
              >
                {n}
              </text>
              <text x={b.x + 20} y="76" style={text}>
                {b.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* View labels */}
      <g className="fade-in text-muted" style={d(1.7)}>
        <text x="200" y="318" textAnchor="middle" style={section ? { ...text, fill: "var(--accent)" } : text}>
          {section ? "SECTION A–A" : "FRONT VIEW"}
        </text>
        {compact ? null : (
          <>
            <text x="480" y="258" textAnchor="middle" style={text}>
              END VIEW
            </text>
            <text x="480" y="318" textAnchor="middle" style={{ ...text, fontSize: 10 }}>
              2170 CELL · MM · NTS
            </text>
          </>
        )}
      </g>
    </svg>
  );
}

/** The drawing plus its controls: inspect a callout, or cut a section. */
export function CellExplorer() {
  const [active, setActive] = useState<Part | null>(null);
  const [section, setSection] = useState(false);
  const base = PARTS.find((p) => p.id === active)?.note;
  const note = base && active === "jelly" && !section ? `${base} Cut a section to see the spiral.` : base;

  const pick = (part: Part) => setActive(part);
  const toggle = (part: Part) => setActive((current) => (current === part ? null : part));

  return (
    <div className="w-full" onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}>
      <figure>
        <figcaption className="sr-only">
          Drawing of a 2170 battery cell: front and end views, 21 mm in diameter and 70 mm long, with the can, jelly
          roll and positive terminal called out.
        </figcaption>
        <CellDrawing compact active={active} section={section} onPick={pick} className="mx-auto w-full sm:hidden" />
        <CellDrawing active={active} section={section} onPick={pick} className="mx-auto hidden w-full max-w-[44rem] sm:block" />
      </figure>

      <div className="mx-auto mt-2 max-w-[44rem]">
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Inspect a part" className="flex flex-1 border border-line-strong">
            {PARTS.map(({ id, n, label }) => {
              const on = active === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(id)}
                  className={`flex min-h-11 flex-1 items-center justify-center gap-2 border-r border-line-strong px-2 font-mono text-[0.68rem] uppercase tracking-[0.1em] whitespace-nowrap transition-colors last:border-r-0 active:translate-y-px ${
                    on ? "bg-accent text-accent-ink" : "bg-card hover:text-accent"
                  }`}
                >
                  <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full border border-current text-[0.62rem]">
                    {n}
                  </span>
                  <span className={id === "jelly" ? "hidden min-[380px]:inline" : ""}>{label}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            aria-pressed={section}
            onClick={() => setSection((s) => !s)}
            className={`flex min-h-11 items-center gap-2 border border-line-strong px-3 font-mono text-[0.68rem] uppercase tracking-[0.1em] whitespace-nowrap transition-colors active:translate-y-px max-sm:w-full max-sm:justify-center ${
              section ? "bg-ink text-paper" : "bg-card hover:text-accent"
            }`}
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="4" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <path d="M5.5 10.5 12 2M10.5 10.5 4 2" />
            </svg>
            {section ? "Close section" : "Cut section A–A"}
          </button>
        </div>
        <p aria-live="polite" className="mt-3 min-h-[3.2rem] text-sm leading-relaxed text-muted">
          {note ?? (
            <span className="font-mono text-xs uppercase tracking-[0.1em]">
              ↑ Tap a callout to inspect a part, or cut the cell open.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
