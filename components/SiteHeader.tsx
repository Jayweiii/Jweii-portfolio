"use client";

import { usePathname } from "next/navigation";
import { ZoomLink } from "@/components/Zoom";
import { profile } from "@/lib/profile";

const NAV = [
  { href: "/", label: "Sheet" },
  { href: "/projects/", label: "Projects" },
  { href: "/about-me/", label: "About" },
];

const SHEETS = 4;

function sheetFor(path: string) {
  if (path === "/") return { n: 1, title: "Overview", dwg: "JW-001" };
  if (path.startsWith("/projects")) return { n: 2, title: "Projects", dwg: "JW-002" };
  if (path.startsWith("/about-me")) return { n: 3, title: "About", dwg: "JW-003" };
  return { n: 4, title: "Detail", dwg: "JW-004" };
}

/** Site header laid out as a single-row drawing title block, with primary nav inside it. */
export function SiteHeader() {
  const pathname = usePathname() || "/";
  const sheet = sheetFor(pathname);
  const rev = String(new Date().getFullYear());
  const cell = "border-r border-line px-3 py-1.5";
  const label = "block font-mono text-[0.55rem] uppercase tracking-[0.16em] text-muted";
  return (
    <header className="shrink-0 border-b border-ink/70 bg-card">
      <div className="flex flex-wrap items-stretch">
        <div className={`${cell} min-w-0 flex-1 basis-40`}>
          <ZoomLink href="/" className="block font-display text-xl leading-tight tracking-tight">
            {profile.name}
          </ZoomLink>
          <span className="block text-xs text-muted">{profile.tagline}</span>
        </div>
        <div className={cell}>
          <span className={label}>Dwg no.</span>
          <span className="text-xs font-medium">{sheet.dwg}</span>
        </div>
        <div className={cell}>
          <span className={label}>Rev</span>
          <span className="text-xs font-medium">{rev}</span>
        </div>
        <div className={`${cell} hidden lg:block`}>
          <span className={label}>Title</span>
          <span className="text-xs font-medium">{sheet.title}</span>
        </div>
        <div className={cell}>
          <span className={label}>Sheet</span>
          <span className="text-xs font-medium">
            {sheet.n} of {SHEETS}
          </span>
        </div>
        <nav aria-label="Primary" className="flex w-full text-sm sm:w-auto">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <ZoomLink
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 flex-1 items-center justify-center border-r border-line px-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] last:border-r-0 sm:flex-none ${
                  active ? "bg-ink text-paper" : "hover:text-accent"
                }`}
              >
                {item.label}
              </ZoomLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
