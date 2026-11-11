import { ZoneTracker } from "@/components/ZoneTracker";

const COLUMNS = ["8", "7", "6", "5", "4", "3", "2", "1"];
const ROWS = ["A", "B", "C", "D", "E", "F"];

/** The double border and zone references around every page (desktop only). */
export function SheetFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="sheet">
      {(["top", "bottom"] as const).map((side) => (
        <div key={side} aria-hidden="true" className={`zones zones--${side}`}>
          {COLUMNS.map((c, i) => (
            <span key={c} data-col={i}>
              {c}
            </span>
          ))}
        </div>
      ))}
      {(["left", "right"] as const).map((side) => (
        <div key={side} aria-hidden="true" className={`zones zones--${side}`}>
          {ROWS.map((r, i) => (
            <span key={r} data-row={i}>
              {r}
            </span>
          ))}
        </div>
      ))}
      <ZoneTracker />
      <div className="sheet-inner flex min-h-dvh flex-col lg:min-h-[calc(100dvh-5.5rem)]">{children}</div>
    </div>
  );
}
