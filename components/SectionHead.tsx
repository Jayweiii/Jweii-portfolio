import Link from "next/link";

type Props = {
  n: string;
  label: string;
  title: string;
  id: string;
  action?: { href: string; label: string };
};

/** Section heading: callout balloon, drafting label, title, and an optional link on the same rule. */
export function SectionHead({ n, label, title, id, action }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-line-strong pb-3">
      <div className="flex items-center gap-4">
        <span className="balloon text-accent">{n}</span>
        <div>
          <p className="label">{label}</p>
          <h2 id={id} className="font-display text-3xl font-semibold uppercase leading-none tracking-[0.04em] sm:text-4xl">
            {title}
          </h2>
        </div>
      </div>
      {action ? (
        <Link
          href={action.href}
          className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.14em] underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          {action.label} →
        </Link>
      ) : null}
    </div>
  );
}
