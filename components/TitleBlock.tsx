import { profile } from "@/lib/profile";

/** Engineering-drawing title block. Fields come from the profile. */
export function TitleBlock({
  className = "",
  title = "Portfolio",
  sheet = "1 of 1",
  dwg = "JW-001",
}: {
  className?: string;
  title?: string;
  sheet?: string;
  dwg?: string;
}) {
  const fields: [string, string][] = [
    ["Drawn by", profile.name],
    ["Title", title],
    ["Org", `${profile.company}, ${profile.team}`],
    ["Location", profile.location],
    ["Dwg no.", dwg],
    ["Scale", "1:1"],
    ["Rev", String(new Date().getFullYear())],
    ["Sheet", sheet],
  ];
  return (
    <dl className={`grid grid-cols-2 border border-ink/70 bg-card text-sm sm:grid-cols-4 ${className}`}>
      {fields.map(([label, value]) => (
        <div key={label} className="border-b border-r border-line p-2.5 [&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-last-child(-n+4)]:border-b-0">
          <dt className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">{label}</dt>
          <dd className="mt-0.5 font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
