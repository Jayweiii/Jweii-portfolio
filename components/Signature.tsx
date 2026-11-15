"use client";

import { useEffect, useRef, useState } from "react";

const KEY = "sheet-signature";
const W = 240;
const H = 64;

type Saved = { strokes: string[]; date: string };
type Point = [number, number];

/** Smooth a stroke through the midpoints of its samples. */
function toPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const [x, y] = points[0];
    return `M${x} ${y} l0.1 0`;
  }
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const mx = ((x + points[i + 1][0]) / 2).toFixed(1);
    const my = ((y + points[i + 1][1]) / 2).toFixed(1);
    d += ` Q${x} ${y} ${mx} ${my}`;
  }
  const last = points[points.length - 1];
  return `${d} L${last[0]} ${last[1]}`;
}

function today(): string {
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" }).format(new Date());
}

/** Pre-drawn squiggle for people signing from a keyboard. */
const STAMP =
  "M20 46 C30 14 46 8 42 34 S52 58 64 30 S82 12 88 38 S104 54 116 26 S134 18 130 40 S142 52 156 32 C166 20 180 24 218 18";

/**
 * "Checked by" box in the title block. Visitors sign it with a finger, pen or mouse.
 * The signature is kept only in their own browser.
 */
export function Signature() {
  const [saved, setSaved] = useState<Saved | null>(null);
  const [strokes, setStrokes] = useState<string[]>([]);
  const [signing, setSigning] = useState(false);
  const current = useRef<Point[] | null>(null);
  const pad = useRef<SVGSVGElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSaved(JSON.parse(raw) as Saved);
    } catch {
      /* storage blocked or bad data: start unsigned */
    }
  }, []);

  function persist(next: Saved | null) {
    setSaved(next);
    try {
      if (next) localStorage.setItem(KEY, JSON.stringify(next));
      else localStorage.removeItem(KEY);
    } catch {
      /* fine — it just won't be remembered */
    }
  }

  function point(event: React.PointerEvent): Point {
    const rect = pad.current!.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * W;
    const y = ((event.clientY - rect.top) / rect.height) * H;
    return [Math.round(Math.max(0, Math.min(W, x)) * 10) / 10, Math.round(Math.max(0, Math.min(H, y)) * 10) / 10];
  }

  function down(event: React.PointerEvent<SVGSVGElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    current.current = [point(event)];
    setStrokes((s) => [...s, toPath(current.current!)]);
  }

  function move(event: React.PointerEvent<SVGSVGElement>) {
    if (!current.current) return;
    const p = point(event);
    const prev = current.current[current.current.length - 1];
    if (Math.hypot(p[0] - prev[0], p[1] - prev[1]) < 1.5) return;
    current.current.push(p);
    const d = toPath(current.current);
    setStrokes((s) => [...s.slice(0, -1), d]);
  }

  function up() {
    current.current = null;
  }

  const sigClass = "h-16 w-full max-w-[15rem] text-accent";
  const strokeProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
  };
  const small =
    "inline-flex min-h-11 items-center px-1 font-mono text-[0.64rem] uppercase tracking-[0.12em] underline underline-offset-2 transition-colors hover:text-accent active:translate-y-px";

  if (saved) {
    return (
      <div aria-live="polite">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={sigClass} role="img" aria-label="Your signature">
          {saved.strokes.map((d, i) => (
            <path key={i} d={d} {...strokeProps} />
          ))}
        </svg>
        <div className="flex flex-wrap items-center gap-x-3 text-xs">
          <span>
            Checked by you · <span className="font-mono text-muted">{saved.date}</span>
          </span>
          <button type="button" onClick={() => persist(null)} className={`${small} text-muted`}>
            Erase
          </button>
        </div>
      </div>
    );
  }

  if (!signing) {
    return (
      <button
        type="button"
        onClick={() => {
          setStrokes([]);
          setSigning(true);
        }}
        className="inline-flex min-h-11 w-full items-center justify-between gap-3 border border-dashed border-line-strong px-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted transition-colors hover:border-accent hover:text-accent active:translate-y-px"
      >
        <span>✎ Sign the sheet</span>
        <span aria-hidden="true" className="h-px flex-1 border-b border-dotted border-current opacity-60" />
      </button>
    );
  }

  return (
    <div>
      <div className="relative max-w-[15rem] border border-line-strong bg-card">
        <svg
          ref={pad}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className={`${sigClass} block cursor-crosshair touch-none`}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          aria-label="Signature pad: draw your signature with a mouse, pen or finger"
          role="img"
        >
          <line x1="14" y1={H - 14} x2={W - 10} y2={H - 14} stroke="var(--line)" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
          {strokes.map((d, i) => (
            <path key={i} d={d} {...strokeProps} />
          ))}
        </svg>
        <span aria-hidden="true" className="pointer-events-none absolute bottom-2 left-1.5 font-mono text-xs text-muted">
          ×
        </span>
        {strokes.length === 0 ? (
          <span className="pointer-events-none absolute right-2 top-1.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted">
            Draw here
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-x-2">
        <button
          type="button"
          disabled={strokes.length === 0}
          onClick={() => {
            persist({ strokes, date: today() });
            setSigning(false);
          }}
          className={`${small} text-accent disabled:cursor-not-allowed disabled:text-muted disabled:no-underline`}
        >
          Done
        </button>
        <button type="button" onClick={() => setStrokes([])} disabled={strokes.length === 0} className={`${small} text-muted disabled:no-underline disabled:opacity-50`}>
          Clear
        </button>
        <button type="button" onClick={() => setSigning(false)} className={`${small} text-muted`}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            persist({ strokes: [STAMP], date: today() });
            setSigning(false);
          }}
          className="sr-only focus:not-sr-only focus:inline-flex focus:min-h-11 focus:items-center focus:px-1 focus:font-mono focus:text-[0.64rem] focus:uppercase"
        >
          Sign without drawing
        </button>
      </div>
    </div>
  );
}
