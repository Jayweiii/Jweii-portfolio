/**
 * Hero drawing: a 2170 cylindrical cell in third-angle projection.
 * This is the cell format in the FSAE packs. Lines draw themselves once on load.
 */
export function CellDrawing({ className = "", compact = false }: { className?: string; compact?: boolean }) {
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

  return (
    <svg
      viewBox={compact ? "0 44 400 290" : "0 0 600 340"}
      role="img"
      aria-labelledby={compact ? undefined : "cell-title cell-desc"}
      aria-hidden={compact ? true : undefined}
      className={className}
      fill="none"
      stroke="currentColor"
    >
      {compact ? null : (
        <>
      <title id="cell-title">Drawing of a 2170 battery cell</title>
      <desc id="cell-desc">
        Front and end views of a cylindrical 2170 cell, 21 mm in diameter and 70 mm long, with the can, jelly roll and
        positive terminal called out.
      </desc>
        </>
      )}

      {/* Object lines — front view */}
      <g style={d(0)}>
        <rect className="draw" pathLength={1} x="60" y="130" width="280" height="84" style={thick} />
        <rect className="draw" pathLength={1} x="340" y="158" width="9" height="28" style={thick} />
      </g>
      <g style={d(0.35)}>
        <line className="draw" pathLength={1} x1="322" y1="130" x2="322" y2="214" style={thin} />
        <line className="draw" pathLength={1} x1="329" y1="130" x2="329" y2="214" style={thin} />
        <line className="draw" pathLength={1} x1="68" y1="130" x2="68" y2="214" style={thin} />
      </g>

      {/* Object lines — end view */}
      <g style={d(0.2)} display={compact ? "none" : undefined}>
        <circle className="draw" pathLength={1} cx="480" cy="172" r="42" style={thick} />
        <circle className="draw" pathLength={1} cx="480" cy="172" r="33" style={thin} />
        <circle className="draw" pathLength={1} cx="480" cy="172" r="14" style={thick} />
      </g>

      {/* Hidden lines: jelly roll */}
      <g style={d(0.7)} className="text-muted">
        <rect className="draw" pathLength={1} x="76" y="137" width="240" height="70" style={hidden} />
      </g>

      {/* Centre lines */}
      <g style={d(0.9)} className="text-muted">
        <line className="draw" pathLength={1} x1="40" y1="172" x2="366" y2="172" style={centre} />
        {compact ? null : (
          <>
            <line className="draw" pathLength={1} x1="426" y1="172" x2="534" y2="172" style={centre} />
            <line className="draw" pathLength={1} x1="480" y1="118" x2="480" y2="226" style={centre} />
          </>
        )}
      </g>

      {/* Projection lines between views */}
      <g style={d(1)} className="text-line" display={compact ? "none" : undefined}>
        <line className="draw" pathLength={1} x1="356" y1="130" x2="476" y2="130" style={{ ...thin, strokeDasharray: "2 4" }} />
        <line className="draw" pathLength={1} x1="356" y1="214" x2="476" y2="214" style={{ ...thin, strokeDasharray: "2 4" }} />
      </g>

      {/* Dimensions */}
      <g className="fade-in" style={d(1.2)}>
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

      {/* Callout balloons */}
      <g className="fade-in text-accent" style={d(1.5)}>
        <g style={thin}>
          <line x1="84" y1="84" x2="110" y2="130" />
          <line x1="166" y1="84" x2="176" y2="137" />
          <line x1="294" y1="84" x2="345" y2="158" />
        </g>
        {[
          { x: 80, n: "1", label: "CAN" },
          { x: 160, n: "2", label: "JELLY ROLL" },
          { x: 288, n: "3", label: "+ TERMINAL" },
        ].map((b) => (
          <g key={b.n}>
            <circle cx={b.x} cy="72" r="13" fill="var(--paper)" style={{ strokeWidth: 1.5 }} />
            <text x={b.x} y="76" textAnchor="middle" style={{ ...text, fontSize: 12, letterSpacing: 0 }}>
              {b.n}
            </text>
            <text x={b.x + 20} y="76" style={text}>
              {b.label}
            </text>
          </g>
        ))}
      </g>

      {/* View labels */}
      <g className="fade-in text-muted" style={d(1.7)}>
        <text x="200" y="318" textAnchor="middle" style={text}>
          FRONT VIEW
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
