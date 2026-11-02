const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const NUMBERS = ["1", "2", "3", "4", "5", "6"];

/** One continuous drawing sheet: border wrapping the whole page, with zone markers. */
export function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <div className="sheet relative m-1.5 flex h-[calc(100dvh-0.75rem)] flex-col border border-ink/60 md:m-3 md:h-[calc(100dvh-1.5rem)]">
      <div aria-hidden="true" className="zone-row border-b">
        {NUMBERS.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
      <div aria-hidden="true" className="zone-col left-0 border-r">
        {LETTERS.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
      <div aria-hidden="true" className="zone-col right-0 border-l">
        {LETTERS.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
      <div className="flex min-h-0 flex-1 flex-col md:mx-6">{children}</div>
      <div aria-hidden="true" className="zone-row border-t">
        {NUMBERS.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
    </div>
  );
}
