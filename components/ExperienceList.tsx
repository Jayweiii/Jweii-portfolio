import { dateRange } from "@/lib/profile";
import type { Experience } from "@/lib/types";

export function ExperienceList({ items }: { items: Experience[] }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <li key={`${item.org}-${item.role}-${item.start}`} className="grid gap-3 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8">
          <div>
            <p className="text-sm text-muted">{dateRange(item.start, item.end)}</p>
            <p className="mt-1 text-sm text-muted">{item.location}</p>
          </div>
          <div>
            <h3 className="font-display text-2xl leading-tight">{item.org}</h3>
            <p className="mt-1">
              {item.role}
              {item.team ? <span className="text-muted"> · {item.team}</span> : null}
            </p>
            {item.bullets.length > 0 ? (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink/90">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
