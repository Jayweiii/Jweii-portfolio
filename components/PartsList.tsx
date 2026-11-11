"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type PartRow = {
  slug: string;
  dwg: string;
  title: string;
  excerpt: string;
  year: string;
  cover?: string;
  group: string;
  hasWriteUp: boolean;
};

/** The full project index, as a bill of materials with a segmented filter. */
export function PartsList({ rows, groups }: { rows: PartRow[]; groups: string[] }) {
  const [group, setGroup] = useState("All");
  const shown = useMemo(() => (group === "All" ? rows : rows.filter((row) => row.group === group)), [group, rows]);
  const options = ["All", ...groups];

  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects"
        className="-mx-4 flex gap-0 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none]"
      >
        <div className="flex border border-line-strong">
          {options.map((option) => {
            const count = option === "All" ? rows.length : rows.filter((row) => row.group === option).length;
            const active = option === group;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => setGroup(option)}
                className={`flex min-h-11 shrink-0 items-center gap-2 border-r border-line-strong px-4 font-mono text-xs uppercase tracking-[0.12em] whitespace-nowrap transition-colors last:border-r-0 active:translate-y-px ${
                  active ? "bg-ink text-paper" : "hover:text-accent"
                }`}
              >
                {option}
                <span className={active ? "text-paper/70" : "text-muted"}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 border border-line-strong bg-card">
        <div className="hidden grid-cols-[4.5rem_5.5rem_minmax(0,1fr)_9rem_4rem] border-b border-line-strong bg-paper-2 sm:grid">
          {["Item", "Dwg no.", "Description", "Group", "Year"].map((h) => (
            <p key={h} className="label border-r border-line px-3 py-2 last:border-r-0">
              {h}
            </p>
          ))}
        </div>
        <ol aria-live="polite">
          {shown.map((row, index) => (
            <li key={row.slug} className="border-b border-line last:border-b-0">
              <Link
                href={`/${row.slug}/`}
                className="group grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-x-3 px-3 py-3 transition-colors active:bg-paper-2 sm:grid-cols-[4.5rem_5.5rem_minmax(0,1fr)_9rem_4rem] sm:gap-x-0 sm:px-0 sm:py-0 hover:bg-paper-2"
              >
                <span className="row-span-2 sm:row-span-1 sm:border-r sm:border-line sm:px-3 sm:py-3">
                  {row.cover ? (
                    <img
                      src={row.cover}
                      alt=""
                      width={96}
                      height={96}
                      loading="lazy"
                      decoding="async"
                      className={`h-16 w-16 border border-line bg-paper-2 sm:h-12 sm:w-12 ${row.cover.endsWith(".svg") ? "object-contain p-1 svg-cover" : "object-cover"}`}
                    />
                  ) : (
                    <span className="grid h-16 w-16 place-items-center border border-dashed border-line font-mono text-xs text-muted sm:h-12 sm:w-12">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                </span>
                <span className="hidden font-mono text-xs text-muted sm:block sm:border-r sm:border-line sm:px-3 sm:py-3 sm:self-stretch sm:content-center">
                  {row.dwg}
                </span>
                <span className="min-w-0 sm:border-r sm:border-line sm:px-4 sm:py-3 sm:self-stretch sm:content-center">
                  <span className="block font-medium leading-snug transition-colors group-hover:text-accent">{row.title}</span>
                  {row.excerpt ? (
                    <span className="mt-0.5 line-clamp-1 hidden text-sm text-muted sm:block">{row.excerpt}</span>
                  ) : !row.hasWriteUp ? (
                    <span className="mt-0.5 hidden text-sm text-muted sm:block">Photos only</span>
                  ) : null}
                </span>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted sm:border-r sm:border-line sm:px-3 sm:py-3 sm:self-stretch sm:content-center">
                  <span className="sm:hidden">{row.dwg} · </span>
                  {row.group}
                  <span className="sm:hidden"> · {row.year}</span>
                </span>
                <span className="hidden font-mono text-xs text-muted sm:block sm:px-3 sm:py-3">{row.year}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
