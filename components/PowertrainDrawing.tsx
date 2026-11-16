"use client";

import { useState } from "react";

/**
 * Hero drawing: plan view of a generic dual-motor EV with its powertrain laid out —
 * floor battery pack, HV distribution, and front and rear drive units. Lines draw
 * themselves once on load. Hovering or tapping a system zooms into it as a detail
 * view with its internals labelled; X-ray shows every system's internals at once.
 */

export type Part = "battery" | "hv" | "front" | "rear";

const PARTS: { id: Part; n: string; label: string; short: string; note: string }[] = [
  {
    id: "battery",
    n: "1",
    label: "Battery pack",
    short: "Battery",
    note: "The floor of the car. Modules of cylindrical cells (2170s and their bigger cousins) joined by busbars, with a cooling plate underneath.",
  },
  {
    id: "hv",
    n: "2",
    label: "HV distribution",
    short: "HV",
    note: "Contactors, fuses and busbars that route pack power out to the drive units, plus the signal harnesses that watch every cell. Orange means high voltage. This is the part I design today.",
  },
  {
    id: "front",
    n: "3",
    label: "Front drive unit",
    short: "Front DU",
    note: "Motor, inverter and a single-speed reduction gearbox in one housing. The inverter turns the pack’s DC into three-phase AC; a second unit up front makes the car all-wheel drive.",
  },
  {
    id: "rear",
    n: "4",
    label: "Rear drive unit",
    short: "Rear DU",
    note: "The primary drive unit. Same recipe — inverter, motor, gearbox — sending torque through half-shafts to the rear wheels. It also recovers energy back into the pack under braking.",
  },
];

const BALLOONS: Record<Part, { x: number; label: string; to: [number, number] }> = {
  front: { x: 70, label: "FRONT DU", to: [140, 136] },
  hv: { x: 190, label: "HV DIST.", to: [202, 154] },
  battery: { x: 300, label: "BATTERY", to: [300, 106] },
  rear: { x: 520, label: "REAR DU", to: [472, 136] },
};

/** The region each detail view zooms to, in drawing units, and its drawing-style name. */
const DETAILS: Record<Part, { x: number; y: number; w: number; h: number; name: string }> = {
  battery: { x: 176, y: 90, w: 286, h: 162, name: "DETAIL A — BATTERY PACK" },
  hv: { x: 130, y: 118, w: 150, h: 92, name: "DETAIL B — HV DISTRIBUTION" },
  front: { x: 66, y: 112, w: 176, h: 116, name: "DETAIL C — FRONT DRIVE UNIT" },
  rear: { x: 386, y: 112, w: 176, h: 116, name: "DETAIL D — REAR DRIVE UNIT" },
};

/** Where a detail view is drawn: below the balloon row, above the view label. */
const STAGE = { x: 16, y: 50, w: 608, h: 262 };

function zoomFor(part: Part | null): { transform: string; scale: number } {
  if (!part) return { transform: "translate(0px, 0px) scale(1)", scale: 1 };
  const f = DETAILS[part];
  const s = Math.min(STAGE.w / f.w, STAGE.h / f.h);
  const tx = STAGE.x + (STAGE.w - f.w * s) / 2 - f.x * s;
  const ty = STAGE.y + (STAGE.h - f.h * s) / 2 - f.y * s;
  return { transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${s.toFixed(3)})`, scale: s };
}

const BODY =
  "M108 72 L462 68 C530 68 566 84 576 116 L580 170 L576 224 C566 256 530 272 462 272 L108 268 C80 264 64 236 60 170 C64 104 80 76 108 72 Z";
const GLASS =
  "M232 92 C250 88 418 88 436 92 C446 120 446 220 436 248 C418 252 250 252 232 248 C222 220 222 120 232 92 Z";

const MODULE_X = [220, 271, 322, 373];
const MODULE_Y = [110, 174];

type Stroke = React.CSSProperties;

type DrawingProps = {
  className?: string;
  compact?: boolean;
  active: Part | null;
  zoomed: boolean;
  xray: boolean;
  onPick: (part: Part) => void;
  onHover: (part: Part) => void;
};

/** A small leader-line label used inside detail views. Sized to read ~11px at any zoom. */
function Tag({ x, y, to, children, s, anchor = "start" }: { x: number; y: number; to?: [number, number]; children: string; s: number; anchor?: "start" | "middle" | "end" }) {
  // s already folds in the phone factor (see `t` below), so this reads ~10.5px everywhere.
  const size = 10.5 / s;
  return (
    <g className="fade-in" style={{ ["--d" as string]: "0.35s" } as React.CSSProperties}>
      {to ? <line x1={x} y1={y - size * 0.35} x2={to[0]} y2={to[1]} stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" /> : null}
      {to ? <circle cx={to[0]} cy={to[1]} r={1.6 / s} fill="currentColor" stroke="none" /> : null}
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        stroke="var(--paper)"
        strokeWidth={3 / s}
        paintOrder="stroke"
        style={{ fontFamily: "var(--font-mono)", fontSize: size, letterSpacing: "0.1em", fill: "currentColor" }}
      >
        {children}
      </text>
    </g>
  );
}

function DriveUnit({ x, flip, xray, thick, thin }: { x: number; flip: boolean; xray: boolean; thick: Stroke; thin: Stroke }) {
  // Housing centred on the axle at x; the motor sits toward the pack, the gearbox outboard.
  const motorX = flip ? x - 22 : x - 8;
  const gearX = flip ? x + 14 : x - 16;
  return (
    <g>
      <rect className="draw" pathLength={1} x={x - 24} y="136" width="48" height="68" rx="4" style={thick} />
      {/* Half-shafts to the wheels */}
      <line x1={x} y1="136" x2={x} y2="82" style={{ ...thin, strokeWidth: 2.4 }} />
      <line x1={x} y1="204" x2={x} y2="258" style={{ ...thin, strokeWidth: 2.4 }} />
      {xray ? (
        <g style={thin}>
          {/* Motor: stator with windings */}
          <rect x={motorX} y="150" width="22" height="48" rx="2" />
          {[156, 163, 170, 177, 184, 191].map((y) => (
            <line key={y} x1={motorX + 3} y1={y} x2={motorX + 19} y2={y} />
          ))}
          {/* Gearbox: reduction gear */}
          <circle cx={gearX} cy="174" r="8" />
          <circle cx={gearX} cy="174" r="2.5" />
          {/* Inverter on top of the housing */}
          <rect x={x - 20} y="139" width="40" height="8" rx="1" fill="var(--paper)" />
        </g>
      ) : null}
    </g>
  );
}

export function PowertrainDrawing({ className = "", compact = false, active, zoomed, xray, onPick, onHover }: DrawingProps) {
  const thick: Stroke = { strokeWidth: 2, vectorEffect: "non-scaling-stroke" };
  const thin: Stroke = { strokeWidth: 1, vectorEffect: "non-scaling-stroke" };
  const centre: Stroke = { ...thin, strokeDasharray: "14 3 3 3" };
  const hidden: Stroke = { ...thin, strokeDasharray: "6 4" };
  const text = {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    letterSpacing: "0.12em",
    fill: "currentColor",
    stroke: "none",
  };
  const d = (seconds: number) => ({ ["--d" as string]: `${seconds}s` }) as React.CSSProperties;
  const focus = zoomed ? active : null;
  const { transform, scale: s } = zoomFor(focus);
  // Tags are sized in drawing units; on phones the drawing renders ~0.56x, so make them larger there.
  const t = compact ? s * 0.6 : s;
  const part = (p: Part) =>
    `transition-opacity duration-300 ${active === p ? "text-accent" : active ? (focus ? "opacity-15" : "opacity-25") : ""}`;
  // A zoomed-in system always shows its internals; X-ray shows them for every system.
  const inside = (p: Part) => xray || focus === p;
  const cellsId = compact ? "cells-c" : "cells-f";
  const r = compact ? 20 : 13;
  const hoverPart = (p: Part) => (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && !focus) onHover(p);
  };

  return (
    <svg viewBox="0 0 640 336" aria-hidden="true" className={`select-none overflow-hidden ${className}`} fill="none" stroke="currentColor">
      <defs>
        <pattern id={cellsId} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.7" fill="none" stroke="currentColor" strokeWidth="0.7" />
        </pattern>
        <clipPath id={`${cellsId}-stage`}>
          <rect x="0" y={focus ? STAGE.y - 4 : 0} width="640" height={focus ? STAGE.h + 8 : 336} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${cellsId}-stage)`}>
        <g className="zoom-stage" style={{ transform, transformOrigin: "0 0" }}>
          {/* Car body, plan view (front to the left) */}
          <g className={`transition-opacity duration-300 ${xray || focus ? "opacity-45" : ""} ${active && !focus ? "opacity-60" : ""}`}>
            <g style={d(0)}>
              <path className="draw" pathLength={1} d={BODY} style={thick} />
            </g>
            <g style={d(0.3)}>
              <path className="draw" pathLength={1} d={GLASS} style={thin} />
              <path className="draw" pathLength={1} d="M262 96 C254 130 254 210 262 244" style={thin} />
              <path className="draw" pathLength={1} d="M410 96 C416 130 416 210 410 244" style={thin} />
              <path className="draw" pathLength={1} d="M236 71 L240 61 H254 L252 70 M236 269 L240 279 H254 L252 270" style={thin} />
            </g>
            <g style={d(0.2)}>
              {[150, 470].flatMap((x) => [
                <rect key={`${x}t`} className="draw" pathLength={1} x={x - 28} y="56" width="56" height="24" rx="5" style={thick} />,
                <rect key={`${x}b`} className="draw" pathLength={1} x={x - 28} y="260" width="56" height="24" rx="5" style={thick} />,
              ])}
            </g>
          </g>

          {/* Centre lines: car axis and both axles */}
          <g style={d(0.9)} className="text-muted">
            <line className="draw" pathLength={1} x1="40" y1="170" x2="600" y2="170" style={centre} />
            <line className="draw" pathLength={1} x1="150" y1="44" x2="150" y2="296" style={centre} />
            <line className="draw" pathLength={1} x1="470" y1="44" x2="470" y2="296" style={centre} />
          </g>

          {/* 1 — Battery pack */}
          <g className={part("battery")} onPointerEnter={hoverPart("battery")}>
            <rect x="214" y="104" width="210" height="132" fill="transparent" stroke="none" />
            {inside("battery") ? (
              <g>
                <rect x="214" y="104" width="210" height="132" rx="4" style={thick} />
                {MODULE_X.flatMap((x) =>
                  MODULE_Y.map((y) => (
                    <rect key={`${x}-${y}`} x={x} y={y} width="45" height="56" rx="1.5" fill={`url(#${cellsId})`} style={thin} />
                  )),
                )}
                {/* Busbars linking the modules */}
                <path
                  d="M266 138 H271 M317 138 H322 M368 138 H373 M266 202 H271 M317 202 H322 M368 202 H373 M418 138 V202"
                  style={{ ...thin, strokeWidth: 2 }}
                />
              </g>
            ) : (
              <g style={d(0.6)} className={active === "battery" ? "" : "text-muted"}>
                <rect className="draw" pathLength={1} x="214" y="104" width="210" height="132" rx="4" style={hidden} />
              </g>
            )}
            {focus === "battery" ? (
              <g>
                <Tag s={t} x={222} y={98} to={[232, 118]}>MODULE ×8</Tag>
                <Tag s={t} x={300} y={98} to={[340, 128]}>CYLINDRICAL CELLS</Tag>
                <Tag s={t} x={432} y={246} to={[418, 202]} anchor="end">BUSBARS</Tag>
                <Tag s={t} x={226} y={248} to={[240, 236]}>PACK ENCLOSURE · COOLING PLATE BELOW</Tag>
              </g>
            ) : null}
          </g>

          {/* 2 — HV distribution: junction box and orange HV cables */}
          <g className={`${part("hv")} ${active === "hv" ? "" : "text-accent"}`} onPointerEnter={hoverPart("hv")}>
            <rect x="186" y="148" width="28" height="44" fill="transparent" stroke="none" />
            <g style={d(0.8)}>
              <rect
                className="draw"
                pathLength={1}
                x="192"
                y="154"
                width="16"
                height="32"
                rx="2"
                fill={inside("hv") ? "var(--paper)" : "none"}
                style={inside("hv") ? thick : hidden}
              />
              <path className="draw" pathLength={1} d="M192 170 H176" style={{ ...(inside("hv") ? thick : hidden), strokeWidth: inside("hv") ? 3 : 1.5 }} />
              <path className="draw" pathLength={1} d="M200 154 V98 H458 V136" style={{ ...(inside("hv") ? thick : hidden), strokeWidth: inside("hv") ? 3 : 1.5 }} />
              {inside("hv") ? (
                <g style={thin}>
                  {/* Contactors and main fuse inside the junction box */}
                  <rect x="195" y="157" width="10" height="7" rx="1" />
                  <rect x="195" y="176" width="10" height="7" rx="1" />
                  <rect x="197.5" y="167" width="5" height="6" rx="0.8" />
                  {/* Pack output busbar into the first module */}
                  <path d="M208 162 H220" style={{ ...thin, strokeWidth: 2 }} />
                </g>
              ) : null}
            </g>
            {focus === "hv" ? (
              <g>
                <Tag s={t} x={226} y={134} to={[205, 160]}>CONTACTORS</Tag>
                <Tag s={t} x={232} y={176} to={[203, 170]}>MAIN FUSE</Tag>
                <Tag s={t} x={176} y={136} to={[194, 156]} anchor="end">JUNCTION BOX</Tag>
                <Tag s={t} x={170} y={198} to={[184, 170]} anchor="end">HV TO FRONT DU</Tag>
                <Tag s={t} x={214} y={128} to={[200, 112]}>HV TO REAR DU</Tag>
              </g>
            ) : null}
          </g>

          {/* 3 — Front drive unit */}
          <g className={part("front")} style={d(0.4)} onPointerEnter={hoverPart("front")}>
            <rect x="120" y="130" width="60" height="80" fill="transparent" stroke="none" />
            <DriveUnit x={150} flip={false} xray={inside("front")} thick={thick} thin={thin} />
            {focus === "front" ? (
              <g>
                <Tag s={t} x={150} y={128} to={[150, 143]} anchor="middle">INVERTER</Tag>
                <Tag s={t} x={190} y={186} to={[160, 180]}>MOTOR</Tag>
                <Tag s={t} x={110} y={194} to={[134, 178]} anchor="end">GEARBOX</Tag>
                <Tag s={t} x={158} y={226} to={[150, 222]}>HALF-SHAFT</Tag>
              </g>
            ) : null}
          </g>

          {/* 4 — Rear drive unit */}
          <g className={part("rear")} style={d(0.4)} onPointerEnter={hoverPart("rear")}>
            <rect x="440" y="130" width="60" height="80" fill="transparent" stroke="none" />
            <DriveUnit x={470} flip xray={inside("rear")} thick={thick} thin={thin} />
            {focus === "rear" ? (
              <g>
                <Tag s={t} x={470} y={128} to={[470, 143]} anchor="middle">INVERTER</Tag>
                <Tag s={t} x={430} y={186} to={[452, 180]} anchor="end">MOTOR</Tag>
                <Tag s={t} x={510} y={194} to={[484, 178]}>GEARBOX</Tag>
                <Tag s={t} x={478} y={226} to={[470, 222]}>HALF-SHAFT</Tag>
              </g>
            ) : null}
          </g>

          {/* Wheelbase dimension */}
          <g className={`transition-opacity duration-300 ${focus ? "opacity-0" : active ? "opacity-40" : ""}`}>
          <g className="fade-in" style={d(1.2)}>
            <g style={thin}>
              <line x1="150" y1="290" x2="150" y2="316" />
              <line x1="470" y1="290" x2="470" y2="316" />
              <line x1="150" y1="310" x2="470" y2="310" />
            </g>
            <g fill="currentColor" stroke="none">
              <path d="M150 310 l10 -3.5 v7 z" />
              <path d="M470 310 l-10 -3.5 v7 z" />
            </g>
            <rect x="262" y="301" width="96" height="16" fill="var(--paper)" stroke="none" />
            <text x="310" y="313" textAnchor="middle" style={{ ...text, fontSize: compact ? 15 : 11 }}>
              WHEELBASE
            </text>
            {compact ? null : (
              <text x="40" y="160" textAnchor="start" style={{ ...text, fontSize: 10 }} transform="rotate(-90 40 160)">
                ← FRONT
              </text>
            )}
          </g>
          </g>
        </g>
      </g>

      {/* Detail frame: thin border round the stage while zoomed */}
      <rect
        x={STAGE.x - 8}
        y={STAGE.y - 4}
        width={STAGE.w + 16}
        height={STAGE.h + 8}
        className={`text-line transition-opacity duration-300 ${focus ? "opacity-100" : "opacity-0"}`}
        style={{ ...thin, strokeDasharray: "2 4" }}
      />

      {/* Callout balloons — fixed in place so the pointer can move between them while zoomed */}
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
                if (e.pointerType === "mouse") onHover(id);
              }}
            >
              <line
                x1={b.x}
                y1={26 + r}
                x2={b.to[0]}
                y2={b.to[1]}
                className={`transition-opacity duration-200 ${focus ? "opacity-0" : ""}`}
                style={thin}
              />
              <circle cx={b.x} cy="26" r={r + 9} fill="transparent" stroke="none" />
              <circle cx={b.x} cy="26" r={r} fill={on ? "currentColor" : "var(--paper)"} style={{ strokeWidth: 1.5 }} />
              <text
                x={b.x}
                y={compact ? 32 : 30}
                textAnchor="middle"
                style={{ ...text, fontSize: compact ? 18 : 12, letterSpacing: 0, fill: on ? "var(--paper)" : "currentColor" }}
              >
                {n}
              </text>
              {compact ? null : (
                <text x={b.x + 20} y="30" style={text}>
                  {b.label}
                </text>
              )}
            </g>
          );
        })}
      </g>

      {/* View label: names the detail and its scale while zoomed */}
      <g className="fade-in" style={d(1.7)}>
        {focus ? (
          <text x="624" y="330" textAnchor="end" style={{ ...text, fontSize: compact ? 15 : 10, fill: "var(--accent)" }}>
            {compact ? `SCALE ${s.toFixed(1)} : 1` : `${DETAILS[focus].name} · SCALE ${s.toFixed(1)} : 1`}
          </text>
        ) : compact ? null : (
          <text x="600" y="330" textAnchor="end" className="text-muted" style={xray ? { ...text, fontSize: 10, fill: "var(--accent)" } : { ...text, fontSize: 10 }}>
            {xray ? "PLAN VIEW · X-RAY · NTS" : "PLAN VIEW · DUAL-MOTOR EV · NTS"}
          </text>
        )}
      </g>
    </svg>
  );
}

/** The drawing plus its controls: hover or tap a system to zoom in, or X-ray the car. */
export function PowertrainExplorer() {
  const [active, setActive] = useState<Part | null>(null);
  // A system chosen by click or tap stays zoomed; one picked by hovering zooms out when the pointer leaves.
  const [sticky, setSticky] = useState(false);
  const [xray, setXray] = useState(false);
  const note = PARTS.find((p) => p.id === active)?.note;

  const hover = (part: Part) => {
    if (!sticky) setActive(part);
  };
  const toggle = (part: Part) => {
    const off = active === part && sticky;
    setActive(off ? null : part);
    setSticky(!off);
  };

  return (
    <div className="w-full" onPointerLeave={(e) => e.pointerType === "mouse" && !sticky && setActive(null)}>
      <figure>
        <figcaption className="sr-only">
          Plan-view drawing of a dual-motor electric car showing its powertrain: a floor battery pack, high-voltage
          distribution, and front and rear drive units. Choosing a system zooms into a labelled detail view of it.
        </figcaption>
        <PowertrainDrawing compact active={active} zoomed xray={xray} onPick={toggle} onHover={hover} className="mx-auto w-full sm:hidden" />
        <PowertrainDrawing active={active} zoomed xray={xray} onPick={toggle} onHover={hover} className="mx-auto hidden w-full max-w-[44rem] sm:block" />
      </figure>

      <div className="mx-auto mt-2 max-w-[44rem]">
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Zoom into a system" className="flex flex-1 border border-line-strong">
            {PARTS.map(({ id, n, label, short }) => {
              const on = active === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  aria-label={label}
                  onClick={() => toggle(id)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && hover(id)}
                  className={`flex min-h-11 flex-1 items-center justify-center gap-1.5 border-r border-line-strong px-1.5 font-mono text-[0.66rem] uppercase tracking-[0.08em] whitespace-nowrap transition-colors last:border-r-0 active:translate-y-px ${
                    on ? "bg-accent text-accent-ink" : "bg-card hover:text-accent"
                  }`}
                >
                  <span aria-hidden="true" className="grid h-5 w-5 flex-none place-items-center rounded-full border border-current text-[0.62rem]">
                    {n}
                  </span>
                  <span aria-hidden="true">{short}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            aria-pressed={xray}
            onClick={() => setXray((x) => !x)}
            className={`flex min-h-11 items-center gap-2 border border-line-strong px-3 font-mono text-[0.68rem] uppercase tracking-[0.1em] whitespace-nowrap transition-colors active:translate-y-px max-sm:w-full max-sm:justify-center ${
              xray ? "bg-ink text-paper" : "bg-card hover:text-accent"
            }`}
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
              <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" />
              <path d="M4 6.5h2M4 9.5h2M8 6.5h4M8 9.5h4" strokeDasharray="1.5 1" />
            </svg>
            {xray ? "Hide internals" : "X-ray the car"}
          </button>
        </div>
        <p aria-live="polite" className="mt-3 min-h-[4.6rem] text-sm leading-relaxed text-muted sm:min-h-[3.2rem]">
          {note ?? (
            <span className="font-mono text-xs uppercase tracking-[0.1em]">
              ↑ Hover or tap a system to zoom in, or X-ray the whole car.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
