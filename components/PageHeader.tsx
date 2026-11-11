import Link from "next/link";

type Crumb = { href: string; label: string };

/** Top of every inner sheet: breadcrumb, drawing label, big title, and a short lead. */
export function PageHeader({
  dwg,
  kicker,
  title,
  lead,
  crumbs = [],
  children,
}: {
  dwg: string;
  kicker: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-line-strong px-4 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10">
      {crumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="-ml-1 mb-4 flex flex-wrap items-center font-mono text-xs uppercase tracking-[0.12em] text-muted">
          {crumbs.map((crumb) => (
            <span key={crumb.href} className="flex items-center">
              <Link href={crumb.href} className="inline-flex min-h-11 items-center px-1 transition-colors hover:text-accent">
                {crumb.label}
              </Link>
              <span aria-hidden="true" className="px-1">
                /
              </span>
            </span>
          ))}
        </nav>
      ) : null}
      <p className="label">
        <span className="text-accent">{dwg}</span> · {kicker}
      </p>
      <h1 className="mt-3 max-w-4xl font-display text-[clamp(2.6rem,7vw,5rem)] font-bold uppercase leading-[0.92] tracking-[0.01em]">
        {title}
      </h1>
      {lead ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p> : null}
      {children}
    </header>
  );
}
