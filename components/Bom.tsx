import Link from "next/link";

export type BomRow = {
  part: string;
  description: string;
  detail?: string;
  year?: string;
  href: string;
};

/** Bill-of-materials table. Rows stack as cards on small screens. */
export function Bom({ rows, caption, yearLabel = "Qty / Year" }: { rows: BomRow[]; caption: string; yearLabel?: string }) {
  const head = "p-2.5 font-normal";
  return (
    <div className="border border-ink/70 bg-card">
      <table className="bom w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-ink/70 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
            <th className={`${head} w-14`}>Item</th>
            <th className={`${head} w-36`}>Part no.</th>
            <th className={head}>Description</th>
            <th className={`${head} w-24`}>{yearLabel}</th>
            <th className={`${head} w-20`}>
              <span className="sr-only">Link</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.href} className="border-b border-line last:border-b-0 hover:bg-wash">
              <td data-label="Item" className="p-2.5 font-mono text-muted">
                {String(i + 1).padStart(2, "0")}
              </td>
              <td data-label="Part no." className="p-2.5 font-mono text-accent">
                {row.part}
              </td>
              <td data-label="Description" className="p-2.5">
                <Link href={row.href} className="font-medium hover:text-accent">
                  {row.description}
                </Link>
                {row.detail ? <span className="mt-0.5 line-clamp-2 block text-xs text-muted">{row.detail}</span> : null}
              </td>
              <td data-label={yearLabel} className="p-2.5 text-muted">
                {row.year ?? "—"}
              </td>
              <td className="p-2.5">
                <Link
                  href={row.href}
                  aria-label={`Open ${row.description}`}
                  className="font-mono text-xs uppercase tracking-[0.14em] hover:text-accent"
                >
                  Open →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function projectRows(
  projects: { slug: string; title: string; date: string; excerpt: string }[],
): BomRow[] {
  return projects.map((p, i) => ({
    part: `JW-P${String(i + 1).padStart(2, "0")}`,
    description: p.title,
    detail: p.excerpt || undefined,
    year: p.date ? p.date.slice(0, 4) : undefined,
    href: `/${p.slug}/`,
  }));
}
