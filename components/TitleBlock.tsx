import { profile } from "@/lib/profile";

/** Engineering-drawing title block. Every field comes from profile.json. */
export function TitleBlock({ className = "" }: { className?: string }) {
  const fields: [string, string][] = [
    ["Drawn by", profile.name],
    ["Title", "Portfolio"],
    ["Org", `${profile.company}, ${profile.team}`],
    ["Location", profile.location],
    ["Rev", profile.resume.date],
    ["Sheet", "1 of 1"],
  ];
  return (
    <dl className={`grid grid-cols-2 border border-ink/70 bg-card text-sm sm:grid-cols-3 ${className}`}>
      {fields.map(([label, value]) => (
        <div key={label} className="border-b border-r border-line p-2.5 [&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-last-child(-n+3)]:border-b-0">
          <dt className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">{label}</dt>
          <dd className="mt-0.5 font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
