"use client";

import { useState } from "react";

/**
 * Hero drawing: plan view of a generic single-motor EV — floor battery pack, an HV
 * "penthouse" on the rear of the pack, and a rear drive unit. Lines draw themselves
 * once on load. Hovering or tapping a system zooms into it and the view changes
 * perspective to a detail drawing: one cell in section, a side section of the
 * penthouse, or a cross-section of the motor.
 */

export type Part = "battery" | "hv" | "du";

const PARTS: { id: Part; n: string; label: string; short: string; note: string }[] = [
  {
    id: "battery",
    n: "1",
    label: "Battery pack",
    short: "Battery",
    note: "All the way down to one cell: a steel can holding a jelly roll of anode, separator and cathode wound round a centre mandrel. Thousands of these, joined by busbars, make up the pack in the floor.",
  },
  {
    id: "hv",
    n: "2",
    label: "HV penthouse",
    short: "HV",
    note: "The penthouse: a compartment on the rear of the pack that holds the HV distribution — contactors, the main fuse, busbars — plus the BMS that watches every cell, and sends power out to the drive unit and charge port. Power and signal distribution is what I design today.",
  },
  {
    id: "du",
    n: "3",
    label: "Drive unit",
    short: "Drive unit",
    note: "One rear drive unit, cut through the motor: laminated steel stator with copper windings in its slots, a thin air gap, and a rotor carrying V-shaped permanent magnets on the shaft. The inverter switches the windings to spin the field; the rotor follows.",
  },
];

const BALLOONS: Record<Part, { x: number; label: string; to: [number, number] }> = {
  battery: { x: 150, label: "BATTERY", to: [232, 106] },
  hv: { x: 330, label: "HV PENTHOUSE", to: [400, 118] },
  du: { x: 500, label: "DRIVE UNIT", to: [470, 136] },
};

/** Where each zoom dives into the plan view, and the detail drawing that replaces it. */
const ZOOM: Record<Part, { x: number; y: number; w: number; h: number; name: string; short: string }> = {
  battery: { x: 199, y: 129, w: 28, h: 12, name: "DETAIL A — ONE CELL, SECTION", short: "DETAIL A · CELL" },
  hv: { x: 360, y: 108, w: 140, h: 124, name: "DETAIL B — HV PENTHOUSE, SIDE SECTION", short: "DETAIL B · PENTHOUSE" },
  du: { x: 444, y: 148, w: 30, h: 52, name: "DETAIL C — MOTOR, SECTION A–A", short: "DETAIL C · MOTOR" },
};

/** Where detail views are drawn: below the balloon row, above the view label. */
const STAGE = { x: 16, y: 50, w: 608, h: 262 };

/** Transform that maps rectangle `from` onto rectangle `to` (uniform scale, centred). */
function fit(from: { x: number; y: number; w: number; h: number }, to: { x: number; y: number; w: number; h: number }) {
  const s = Math.min(to.w / from.w, to.h / from.h);
  const tx = to.x + (to.w - from.w * s) / 2 - from.x * s;
  const ty = to.y + (to.h - from.h * s) / 2 - from.y * s;
  return `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${s.toFixed(3)})`;
}

const IDENTITY = "translate(0px, 0px) scale(1)";

const BODY =
  "M108 72 L462 68 C530 68 566 84 576 116 L580 170 L576 224 C566 256 530 272 462 272 L108 268 C80 264 64 236 60 170 C64 104 80 76 108 72 Z";
const GLASS =
  "M232 92 C250 88 418 88 436 92 C446 120 446 220 436 248 C418 252 250 252 232 248 C222 220 222 120 232 92 Z";

const MODULE_X = [202, 247, 292, 337];
const MODULE_Y = [110, 174];

type Stroke = React.CSSProperties;
const THICK: Stroke = { strokeWidth: 2, vectorEffect: "non-scaling-stroke" };
const THIN: Stroke = { strokeWidth: 1, vectorEffect: "non-scaling-stroke" };
const CENTRE: Stroke = { ...THIN, strokeDasharray: "14 3 3 3" };
const HIDDEN: Stroke = { ...THIN, strokeDasharray: "6 4" };

/** Leader-line label. `s` < 1 enlarges the text (phones render the drawing ~0.56x). */
function Tag({ x, y, to, children, s, anchor = "start" }: { x: number; y: number; to?: [number, number]; children: string; s: number; anchor?: "start" | "middle" | "end" }) {
  const size = 10.5 / s;
  return (
    <g>
      {to ? <line x1={x} y1={y - size * 0.35} x2={to[0]} y2={to[1]} stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" /> : null}
      {to ? <circle cx={to[0]} cy={to[1]} r={1.8 / s} fill="currentColor" stroke="none" /> : null}
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

function spiral(cx: number, cy: number, r0: number, r1: number, turns: number): string {
  const steps = turns * 48;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2;
    const r = r0 + (r1 - r0) * t;
    points.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${points.join(" L")}`;
}

const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  +(cx + r * Math.cos((deg * Math.PI) / 180)).toFixed(1),
  +(cy + r * Math.sin((deg * Math.PI) / 180)).toFixed(1),
];

/* ---------------------------------------------------------------- Detail A: one cell */

const CELL_SPIRAL = spiral(530, 181, 6, 44, 7);

function CellDetail({ hatch, s, compact }: { hatch: string; s: number; compact: boolean }) {
  const L = (long: string, short: string) => (compact ? short : long);
  const layers = [];
  for (let y = 147; y <= 216; y += 6) if (y < 175 || y > 187) layers.push(y);
  return (
    <g>
      {/* Front view in section: can walls hatched, jelly roll layers, hollow mandrel */}
      <g fill={`url(#${hatch})`} stroke="none">
        <rect x="70" y="132" width="322" height="6" />
        <rect x="70" y="224" width="322" height="6" />
        <rect x="70" y="132" width="7" height="98" />
      </g>
      <rect x="70" y="132" width="340" height="98" style={THICK} />
      <g style={THIN}>
        <rect x="84" y="142" width="300" height="78" />
        {layers.map((y) => (
          <line key={y} x1="84" y1={y} x2="384" y2={y} />
        ))}
        <line x1="84" y1="176" x2="384" y2="176" />
        <line x1="84" y1="186" x2="384" y2="186" />
        {/* Crimp groove and positive cap */}
        <path d="M392 132 V140 M392 222 V230" />
        <path d="M398 150 V212" strokeDasharray="4 3" />
      </g>
      <rect x="410" y="163" width="10" height="36" rx="1.5" style={THICK} />
      {/* Positive tab from the roll to the cap (in accent) */}
      <path d="M384 150 C396 150 398 170 410 174" className="text-accent" style={{ ...THICK, strokeWidth: 1.6 }} />
      <line x1="56" y1="181" x2="440" y2="181" className="text-muted" style={CENTRE} />

      {/* End view: wound layers */}
      <circle cx="530" cy="181" r="49" style={THICK} />
      <circle cx="530" cy="181" r="46" style={THIN} />
      <path d={CELL_SPIRAL} style={THIN} />
      <circle cx="530" cy="181" r="5" fill="var(--paper)" style={THIN} />
      <g className="text-muted" style={CENTRE}>
        <line x1="470" y1="181" x2="590" y2="181" />
        <line x1="530" y1="122" x2="530" y2="240" />
      </g>

      <g className="text-accent">
        <Tag s={s} x={70} y={112} to={[104, 133]}>{L("STEEL CAN (−)", "CAN (−)")}</Tag>
        <Tag s={s} x={compact ? 190 : 200} y={112} to={[230, 160]}>JELLY ROLL</Tag>
        <Tag s={s} x={compact ? 400 : 420} y={112} to={[415, 166]} anchor={compact ? "middle" : "start"}>{L("POSITIVE CAP (+)", "+ CAP")}</Tag>
        <Tag s={s} x={120} y={262} to={[150, 181]}>{L("HOLLOW MANDREL", "MANDREL")}</Tag>
        <Tag s={s} x={compact ? 300 : 330} y={262} to={[392, 152]}>{L("TAB", "TAB")}</Tag>
        <Tag s={s} x={530} y={compact ? 270 : 262} to={[556, 196]} anchor="middle">{L("ANODE · SEPARATOR · CATHODE", "LAYERS")}</Tag>
      </g>
    </g>
  );
}

/* ---------------------------------------------------------------- Detail B: the penthouse */

function PenthouseDetail({ hatch, s, compact }: { hatch: string; s: number; compact: boolean }) {
  const L = (long: string, short: string) => (compact ? short : long);
  const cells = [];
  for (let x = 40; x < 372; x += 12) cells.push(x);
  return (
    <g>
      {/* Pack: modules of upright cells along the floor */}
      <rect x="30" y="196" width="530" height="66" style={THICK} />
      <g style={THIN}>
        {cells.map((x) => (
          <rect key={x} x={x} y="206" width="8" height="46" rx="1" />
        ))}
        <line x1="30" y1="252" x2="380" y2="252" strokeDasharray="5 3" />
      </g>
      {/* Pack lid and floor in section */}
      <g fill={`url(#${hatch})`} stroke="none">
        <rect x="30" y="196" width="350" height="5" />
        <rect x="30" y="257" width="530" height="5" />
      </g>

      {/* Penthouse: raised enclosure on the rear of the pack */}
      <path d="M380 196 V100 H560 V196" style={THICK} />
      <rect x="380" y="96" width="180" height="5" fill={`url(#${hatch})`} stroke="none" />
      <g style={THIN}>
        {/* BMS board with chips */}
        <rect x="396" y="108" width="148" height="9" rx="1" />
        <path d="M410 108 v-3 h10 v3 M440 108 v-3 h14 v3 M478 108 v-3 h8 v3" />
        {/* Contactors */}
        {[396, 436].map((x) => (
          <g key={x}>
            <rect x={x} y="132" width="30" height="40" rx="3" />
            <path d={`M${x + 8} 146 h14 M${x + 8} 152 h14 M${x + 8} 158 h14`} />
          </g>
        ))}
        {/* Main fuse */}
        <rect x="482" y="146" width="40" height="14" rx="3" />
        <line x1="488" y1="153" x2="516" y2="153" strokeDasharray="3 2" />
      </g>
      {/* Busbars: pack → contactors → fuse → connectors (accent = high voltage) */}
      <g className="text-accent" style={{ ...THICK, strokeWidth: 3 }}>
        <path d="M372 210 H388 V172" />
        <path d="M411 132 V124 H451 V132" />
        <path d="M466 152 H482" />
        <path d="M522 153 H540 V126 H556" />
        <path d="M540 153 V174 H556" />
      </g>
      {/* HV connectors through the rear wall */}
      <g style={THICK}>
        <rect x="556" y="116" width="26" height="20" rx="2" />
        <rect x="556" y="164" width="26" height="20" rx="2" />
      </g>
      {/* Signal harness from the BMS down to the modules */}
      <path d="M404 117 V126 H372 V204" className="text-muted" style={{ ...THIN, strokeDasharray: "2 3" }} />

      <g className="text-accent">
        <Tag s={s} x={40} y={80} to={[396, 98]}>{L("PENTHOUSE COVER", "COVER")}</Tag>
        <Tag s={s} x={40} y={compact ? 112 : 106} to={[400, 112]}>{L("BMS · SIGNAL HARNESS", "BMS")}</Tag>
        <Tag s={s} x={40} y={compact ? 146 : 136} to={[398, 150]}>CONTACTORS</Tag>
        <Tag s={s} x={40} y={compact ? 180 : 166} to={[388, 186]}>BUSBARS</Tag>
        <Tag s={s} x={compact ? 470 : 500} y={compact ? 76 : 80} to={[502, 146]} anchor={compact ? "end" : "start"}>{L("MAIN FUSE", "FUSE")}</Tag>
        <Tag s={s} x={622} y={compact ? 112 : 106} to={[578, 120]} anchor="end">{L("→ DRIVE UNIT", "→ DU")}</Tag>
        <Tag s={s} x={622} y={compact ? 214 : 206} to={[578, 180]} anchor="end">{L("→ CHARGE PORT", "→ CHARGE")}</Tag>
        <Tag s={s} x={60} y={compact ? 290 : 284} to={[100, 236]}>{L("MODULES IN THE FLOOR", "MODULES")}</Tag>
      </g>
      <text x="30" y="306" className="text-muted" style={{ fontFamily: "var(--font-mono)", fontSize: compact ? 15 : 9.5, letterSpacing: "0.12em", fill: "currentColor" }}>
        ← FRONT OF PACK
      </text>
    </g>
  );
}

/* ---------------------------------------------------------------- Detail C: motor section */

const MOTOR = { cx: 320, cy: 181 };
const SLOTS = Array.from({ length: 36 }, (_, i) => i * 10);
const POLES = Array.from({ length: 8 }, (_, i) => i * 45);

function MotorDetail({ hatch, s, compact }: { hatch: string; s: number; compact: boolean }) {
  const { cx, cy } = MOTOR;
  const L = (long: string, short: string) => (compact ? short : long);
  const ring = (r1: number, r2: number) =>
    `M${cx - r1} ${cy} a${r1} ${r1} 0 1 0 ${2 * r1} 0 a${r1} ${r1} 0 1 0 ${-2 * r1} 0 Z M${cx - r2} ${cy} a${r2} ${r2} 0 1 0 ${2 * r2} 0 a${r2} ${r2} 0 1 0 ${-2 * r2} 0 Z`;
  return (
    <g>
      {/* Housing with cooling jacket, in section */}
      <path d={ring(124, 115)} fill={`url(#${hatch})`} fillRule="evenodd" stroke="none" />
      <circle cx={cx} cy={cy} r="124" style={THICK} />
      <circle cx={cx} cy={cy} r="115" style={THIN} />
      {/* Stator: lamination stack with 36 slots of copper windings */}
      <circle cx={cx} cy={cy} r="111" style={THICK} />
      <circle cx={cx} cy={cy} r="74" style={THIN} />
      {SLOTS.map((deg) => (
        <g key={deg} transform={`rotate(${deg} ${cx} ${cy})`}>
          <rect x={cx + 77} y={cy - 3.2} width="24" height="6.4" rx="1.5" fill="var(--paper)" style={THIN} />
          <rect x={cx + 80} y={cy - 2} width="19" height="4" rx="1" className="text-accent" fill="currentColor" stroke="none" opacity="0.85" />
        </g>
      ))}
      {/* Rotor: laminations, V-shaped magnets per pole, lightening holes */}
      <circle cx={cx} cy={cy} r="70" style={THICK} />
      {POLES.map((deg, i) => (
        <g key={deg} transform={`rotate(${deg} ${cx} ${cy})`}>
          <rect x={cx + 46} y={cy - 18} width="5" height="17" transform={`rotate(-28 ${cx + 48} ${cy - 9})`} fill={i % 2 ? "currentColor" : "var(--paper)"} style={THIN} />
          <rect x={cx + 46} y={cy + 1} width="5" height="17" transform={`rotate(28 ${cx + 48} ${cy + 9})`} fill={i % 2 ? "currentColor" : "var(--paper)"} style={THIN} />
        </g>
      ))}
      {POLES.map((deg) => {
        const [x, y] = polar(cx, cy, 33, deg + 22.5);
        return <circle key={`h${deg}`} cx={x} cy={y} r="7" style={THIN} />;
      })}
      {/* Shaft in section, with keyway */}
      <circle cx={cx} cy={cy} r="18" fill={`url(#${hatch})`} style={THICK} />
      <rect x={cx - 3} y={cy - 21} width="6" height="6" fill="var(--paper)" style={THIN} />
      <g className="text-muted" style={CENTRE}>
        <line x1={cx - 140} y1={cy} x2={cx + 140} y2={cy} />
        <line x1={cx} y1={cy - 138} x2={cx} y2={cy + 138} />
      </g>

      <g className="text-accent">
        <Tag s={s} x={24} y={80} to={polar(cx, cy, 120, 225)}>{L("HOUSING · COOLING JACKET", "HOUSING")}</Tag>
        <Tag s={s} x={24} y={compact ? 134 : 128} to={polar(cx, cy, 106, 196)}>{L("STATOR LAMINATIONS", "STATOR")}</Tag>
        <Tag s={s} x={24} y={compact ? 236 : 236} to={polar(cx, cy, 89, 160)}>{L("COPPER WINDINGS", "WINDINGS")}</Tag>
        <Tag s={s} x={616} y={80} to={polar(cx, cy, 72, -42)} anchor="end">AIR GAP</Tag>
        <Tag s={s} x={616} y={compact ? 150 : 146} to={polar(cx, cy, 50, 14)} anchor="end">{L("ROTOR · V MAGNETS", "MAGNETS")}</Tag>
        <Tag s={s} x={616} y={compact ? 262 : 268} to={polar(cx, cy, 12, 45)} anchor="end">SHAFT</Tag>
      </g>
    </g>
  );
}

/* ---------------------------------------------------------------- Plan view */

function DriveUnit({ inside }: { inside: boolean }) {
  const x = 470;
  return (
    <g>
      <rect className="draw" pathLength={1} x={x - 24} y="136" width="48" height="68" rx="4" style={THICK} />
      <line x1={x} y1="136" x2={x} y2="82" style={{ ...THIN, strokeWidth: 2.4 }} />
      <line x1={x} y1="204" x2={x} y2="258" style={{ ...THIN, strokeWidth: 2.4 }} />
      {inside ? (
        <g style={THIN}>
          <rect x={x - 22} y="150" width="22" height="48" rx="2" />
          {[156, 163, 170, 177, 184, 191].map((y) => (
            <line key={y} x1={x - 19} y1={y} x2={x - 3} y2={y} />
          ))}
          <circle cx={x + 14} cy="174" r="8" />
          <circle cx={x + 14} cy="174" r="2.5" />
          <rect x={x - 20} y="139" width="40" height="8" rx="1" fill="var(--paper)" />
        </g>
      ) : null}
    </g>
  );
}

type DrawingProps = {
  className?: string;
  compact?: boolean;
  active: Part | null;
  xray: boolean;
  onPick: (part: Part) => void;
  onHover: (part: Part) => void;
};

export function PowertrainDrawing({ className = "", compact = false, active, xray, onPick, onHover }: DrawingProps) {
  const text = {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    letterSpacing: "0.12em",
    fill: "currentColor",
    stroke: "none",
  };
  const d = (seconds: number) => ({ ["--d" as string]: `${seconds}s` }) as React.CSSProperties;
  const focus = active;
  const id = compact ? "c" : "f";
  const s = compact ? 0.6 : 1;
  const r = compact ? 20 : 13;
  const part = (p: Part) =>
    `transition-opacity duration-300 ${active === p ? "text-accent" : active ? "opacity-25" : ""}`;
  const inside = (p: Part) => xray || focus === p;
  const hoverPart = (p: Part) => (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && !focus) onHover(p);
  };

  // Plan view dives into the chosen spot and fades; the detail grows out of that spot and fades in.
  const planStyle: React.CSSProperties = {
    transform: focus ? fit(ZOOM[focus], STAGE) : IDENTITY,
    transformOrigin: "0 0",
    opacity: focus ? 0 : 1,
    transition: focus
      ? "transform 700ms cubic-bezier(0.65,0,0.25,1), opacity 300ms ease 380ms"
      : "transform 700ms cubic-bezier(0.65,0,0.25,1), opacity 300ms ease 120ms",
  };
  const detailStyle = (p: Part): React.CSSProperties => {
    const on = focus === p;
    // Start (and end) as a tiny drawing sitting on the zoom spot.
    const spot = ZOOM[p];
    return {
      transform: on ? IDENTITY : fit(STAGE, spot),
      transformOrigin: "0 0",
      opacity: on ? 1 : 0,
      transition: on
        ? "transform 700ms cubic-bezier(0.65,0,0.25,1), opacity 320ms ease 330ms"
        : "transform 600ms cubic-bezier(0.65,0,0.25,1), opacity 200ms ease",
      pointerEvents: "none",
    };
  };

  return (
    <svg viewBox="0 0 640 336" aria-hidden="true" className={`select-none overflow-hidden ${className}`} fill="none" stroke="currentColor">
      <defs>
        <pattern id={`cells-${id}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.7" fill="none" stroke="currentColor" strokeWidth="0.7" />
        </pattern>
        <pattern id={`hatch-${id}`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="currentColor" strokeWidth="1" />
        </pattern>
        <clipPath id={`stage-${id}`}>
          <rect x="0" y={focus ? STAGE.y - 6 : 0} width="640" height={focus ? STAGE.h + 12 : 336} />
        </clipPath>
      </defs>

      <g clipPath={`url(#stage-${id})`}>
        {/* ------------------------------------------------ Plan view */}
        <g className="zoom-stage" style={planStyle}>
          <g className={`transition-opacity duration-300 ${xray ? "opacity-45" : ""} ${active ? "opacity-60" : ""}`}>
            <g style={d(0)}>
              <path className="draw" pathLength={1} d={BODY} style={THICK} />
            </g>
            <g style={d(0.3)}>
              <path className="draw" pathLength={1} d={GLASS} style={THIN} />
              <path className="draw" pathLength={1} d="M262 96 C254 130 254 210 262 244" style={THIN} />
              <path className="draw" pathLength={1} d="M410 96 C416 130 416 210 410 244" style={THIN} />
              <path className="draw" pathLength={1} d="M236 71 L240 61 H254 L252 70 M236 269 L240 279 H254 L252 270" style={THIN} />
            </g>
            <g style={d(0.2)}>
              {[150, 470].flatMap((x) => [
                <rect key={`${x}t`} className="draw" pathLength={1} x={x - 28} y="56" width="56" height="24" rx="5" style={THICK} />,
                <rect key={`${x}b`} className="draw" pathLength={1} x={x - 28} y="260" width="56" height="24" rx="5" style={THICK} />,
              ])}
            </g>
          </g>

          <g style={d(0.9)} className="text-muted">
            <line className="draw" pathLength={1} x1="40" y1="170" x2="600" y2="170" style={CENTRE} />
            <line className="draw" pathLength={1} x1="150" y1="44" x2="150" y2="296" style={CENTRE} />
            <line className="draw" pathLength={1} x1="470" y1="44" x2="470" y2="296" style={CENTRE} />
          </g>

          {/* 1 — Battery pack */}
          <g className={part("battery")} onPointerEnter={hoverPart("battery")}>
            <rect x="196" y="104" width="244" height="132" fill="transparent" stroke="none" />
            {inside("battery") ? (
              <g>
                <rect x="196" y="104" width="244" height="132" rx="4" style={THICK} />
                {MODULE_X.flatMap((x) =>
                  MODULE_Y.map((y) => (
                    <rect key={`${x}-${y}`} x={x} y={y} width="40" height="56" rx="1.5" fill={`url(#cells-${id})`} style={THIN} />
                  )),
                )}
                <path d="M242 138 H247 M287 138 H292 M332 138 H337 M242 202 H247 M287 202 H292 M332 202 H337 M377 140 H384 M377 200 H384" style={{ ...THIN, strokeWidth: 2 }} />
              </g>
            ) : (
              <g style={d(0.6)} className={active === "battery" ? "" : "text-muted"}>
                <rect className="draw" pathLength={1} x="196" y="104" width="244" height="132" rx="4" style={HIDDEN} />
              </g>
            )}
          </g>

          {/* 2 — HV penthouse on the rear of the pack, with runs to the drive unit and charge port */}
          <g className={`${part("hv")} ${active === "hv" ? "" : "text-accent"}`} onPointerEnter={hoverPart("hv")}>
            <rect x="380" y="112" width="58" height="116" fill="transparent" stroke="none" />
            <g style={d(0.8)}>
              <rect
                className="draw"
                pathLength={1}
                x="384"
                y="116"
                width="50"
                height="108"
                rx="3"
                fill={inside("hv") ? "var(--paper)" : "none"}
                style={inside("hv") ? THICK : HIDDEN}
              />
              <path className="draw" pathLength={1} d="M434 170 H446" style={{ ...(inside("hv") ? THICK : HIDDEN), strokeWidth: inside("hv") ? 3 : 1.5 }} />
              <path className="draw" pathLength={1} d="M420 116 V92 H532 V82" style={{ ...(inside("hv") ? THICK : HIDDEN), strokeWidth: inside("hv") ? 3 : 1.5 }} />
              <rect x="524" y="74" width="16" height="8" rx="1.5" style={inside("hv") ? THICK : HIDDEN} />
              {inside("hv") ? (
                <g style={THIN}>
                  <rect x="390" y="122" width="38" height="6" rx="1" />
                  <rect x="392" y="138" width="14" height="22" rx="2" />
                  <rect x="412" y="138" width="14" height="22" rx="2" />
                  <rect x="398" y="172" width="22" height="8" rx="2" />
                </g>
              ) : null}
            </g>
          </g>

          {/* 3 — Rear drive unit */}
          <g className={part("du")} style={d(0.4)} onPointerEnter={hoverPart("du")}>
            <rect x="440" y="130" width="60" height="80" fill="transparent" stroke="none" />
            <DriveUnit inside={inside("du")} />
          </g>

          {/* Wheelbase dimension */}
          <g className={`transition-opacity duration-300 ${active ? "opacity-40" : ""}`}>
            <g className="fade-in" style={d(1.2)}>
              <g style={THIN}>
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

        {/* ------------------------------------------------ Detail views */}
        <g className="zoom-stage" style={detailStyle("battery")}>
          <CellDetail hatch={`hatch-${id}`} s={s} compact={compact} />
        </g>
        <g className="zoom-stage" style={detailStyle("hv")}>
          <PenthouseDetail hatch={`hatch-${id}`} s={s} compact={compact} />
        </g>
        <g className="zoom-stage" style={detailStyle("du")}>
          <MotorDetail hatch={`hatch-${id}`} s={s} compact={compact} />
        </g>
      </g>

      {/* Detail frame */}
      <rect
        x={STAGE.x - 8}
        y={STAGE.y - 6}
        width={STAGE.w + 16}
        height={STAGE.h + 12}
        className={`text-line transition-opacity duration-300 ${focus ? "opacity-100" : "opacity-0"}`}
        style={{ ...THIN, strokeDasharray: "2 4" }}
      />

      {/* Callout balloons — fixed in place so the pointer can move between them while zoomed */}
      <g className="fade-in" style={d(1.5)}>
        {PARTS.map(({ id: pid, n }) => {
          const b = BALLOONS[pid];
          const on = active === pid;
          return (
            <g
              key={pid}
              className={`cursor-pointer text-accent transition-opacity duration-200 ${active && !on ? "opacity-40" : ""}`}
              onClick={() => onPick(pid)}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") onHover(pid);
              }}
            >
              <line
                x1={b.x}
                y1={26 + r}
                x2={b.to[0]}
                y2={b.to[1]}
                className={`transition-opacity duration-200 ${focus ? "opacity-0" : ""}`}
                style={THIN}
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

      {/* View label */}
      <g className="fade-in" style={d(1.7)}>
        {focus ? (
          <text x="624" y="331" textAnchor="end" style={{ ...text, fontSize: compact ? 15 : 10, fill: "var(--accent)" }}>
            {compact ? ZOOM[focus].short : ZOOM[focus].name}
          </text>
        ) : compact ? null : (
          <text x="600" y="331" textAnchor="end" className="text-muted" style={xray ? { ...text, fontSize: 10, fill: "var(--accent)" } : { ...text, fontSize: 10 }}>
            {xray ? "PLAN VIEW · X-RAY · NTS" : "PLAN VIEW · SINGLE-MOTOR EV · NTS"}
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
          Plan-view drawing of an electric car&apos;s powertrain: a floor battery pack, an HV penthouse on the rear of the
          pack, and a rear drive unit. Choosing a system zooms into a detail drawing: a single cell in section, a side
          section of the penthouse, or a cross-section of the motor.
        </figcaption>
        <PowertrainDrawing compact active={active} xray={xray} onPick={toggle} onHover={hover} className="mx-auto w-full sm:hidden" />
        <PowertrainDrawing active={active} xray={xray} onPick={toggle} onHover={hover} className="mx-auto hidden w-full max-w-[44rem] sm:block" />
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
        <p aria-live="polite" className="mt-3 min-h-[5.6rem] text-sm leading-relaxed text-muted sm:min-h-[4.2rem]">
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
