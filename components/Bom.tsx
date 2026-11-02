import { ZoomLink as Link } from "@/components/Zoom";

export type BomRow = {
  part: string;
  description: string;
  detail?: string;
  year?: string;
  href: string;
  /** Detail letter shown instead of the running item number (matches the circled details on the sheet). */
  item?: string;
};

/**
 * Bill-of-materials table. Rows stack as cards on small screens.
 * `compact` drops the excerpt and the trailing link column (the whole description is the link).
 */
export function Bom({
  rows,
  caption,
  yearLabel = "Qty / Year",
  compact = false,
}: {
  rows: BomRow[];
  caption: string;
  yearLabel?: string;
  compact?: boolean;
}) {
  const head = compact ? "px-2 py-1.5 font-normal" : "p-2.5 font-normal";
  const cell = compact ? "px-2 py-1.5" : "p-2.5";
  return (
    <div className="border border-ink/70 bg-card">
      <table className={`bom w-full border-collapse text-left ${compact ? "bom-compact text-xs" : "text-sm"}`}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-ink/70 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
            <th className={`${head} w-12`}>Item</th>
            <th className={`${head} ${compact ? "w-20" : "w-36"}`}>Part no.</th>
            <th className={head}>Description</th>
            <th className={`${head} ${compact ? "w-14" : "w-24"}`}>{yearLabel}</th>
            {compact ? null : (
              <th className={`${head} w-20`}>
                <span className="sr-only">Link</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.href} className="border-b border-line last:border-b-0 hover:bg-wash">
              <td data-label="Item" className={`${cell} font-mono text-muted`}>
                {row.item ?? String(i + 1).padStart(2, "0")}
              </td>
              <td data-label="Part no." className={`${cell} font-mono text-accent`}>
                {row.part}
              </td>
              <td data-label="Description" className={cell}>
                <Link href={row.href} className="font-medium hover:text-accent">
                  {row.description}
                </Link>
                {!compact && row.detail ? (
                  <span className="mt-0.5 line-clamp-2 block text-xs text-muted">{row.detail}</span>
                ) : null}
              </td>
              <td data-label={yearLabel} className={`${cell} text-muted`}>
                {row.year ?? "—"}
              </td>
              {compact ? null : (
                <td className={cell}>
                  <Link
                    href={row.href}
                    aria-label={`Open ${row.description}`}
                    className="font-mono text-xs uppercase tracking-[0.14em] hover:text-accent"
                  >
                    Open →
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function partNo(index: number) {
  return `JW-P${String(index + 1).padStart(2, "0")}`;
}

export function projectRows(
  projects: { slug: string; title: string; date: string; excerpt: string }[],
): BomRow[] {
  return projects.map((p, i) => ({
    part: partNo(i),
    description: p.title,
    detail: p.excerpt || undefined,
    year: p.date ? p.date.slice(0, 4) : undefined,
    href: `/${p.slug}/`,
  }));
}
