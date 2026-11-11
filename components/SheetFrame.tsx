const COLUMNS = ["8", "7", "6", "5", "4", "3", "2", "1"];
const ROWS = ["A", "B", "C", "D", "E", "F"];

/** The double border and zone references around every page (desktop only). */
export function SheetFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="sheet">
      <div aria-hidden="true" className="zones zones--top">
        {COLUMNS.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      <div aria-hidden="true" className="zones zones--bottom">
        {COLUMNS.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      <div aria-hidden="true" className="zones zones--left">
        {ROWS.map((r) => (
          <span key={r}>{r}</span>
        ))}
      </div>
      <div aria-hidden="true" className="zones zones--right">
        {ROWS.map((r) => (
          <span key={r}>{r}</span>
        ))}
      </div>
      <div className="sheet-inner flex min-h-dvh flex-col lg:min-h-[calc(100dvh-5.5rem)]">{children}</div>
    </div>
  );
}
