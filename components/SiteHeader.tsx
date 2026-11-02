"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/lib/profile";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects/", label: "Projects" },
  { href: "/about-me/", label: "About" },
];

const SHEETS = 4;

function sheetFor(path: string) {
  if (path === "/") return { n: 1, title: "Home", dwg: "JW-001" };
  if (path.startsWith("/projects")) return { n: 2, title: "Projects", dwg: "JW-002" };
  if (path.startsWith("/about-me")) return { n: 3, title: "About", dwg: "JW-003" };
  return { n: 4, title: "Project", dwg: "JW-004" };
}

/** Site header laid out as a drawing title block, with primary nav inside it. */
export function SiteHeader() {
  const pathname = usePathname() || "/";
  const sheet = sheetFor(pathname);
  const rev = String(new Date().getFullYear());
  const cell = "border-b border-r border-line px-3 py-2";
  const label = "block font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted";
  return (
    <header className="border-b border-ink/70 bg-card">
      <div className="grid grid-cols-2 sm:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))]">
        <div className={`${cell} col-span-2 sm:col-span-1`}>
          <Link href="/" className="block font-display text-2xl leading-tight tracking-tight">
            {profile.name}
          </Link>
          <span className="text-sm text-muted">{profile.tagline}</span>
        </div>
        <div className={cell}>
          <span className={label}>Dwg no.</span>
          <span className="text-sm font-medium">{sheet.dwg}</span>
        </div>
        <div className={cell}>
          <span className={label}>Rev</span>
          <span className="text-sm font-medium">{rev}</span>
        </div>
        <div className={cell}>
          <span className={label}>Title</span>
          <span className="text-sm font-medium">{sheet.title}</span>
        </div>
        <div className={cell}>
          <span className={label}>Sheet</span>
          <span className="text-sm font-medium">
            {sheet.n} of {SHEETS}
          </span>
        </div>
      </div>
      <nav aria-label="Primary" className="flex flex-wrap text-sm">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`min-h-11 flex-1 border-r border-line px-4 py-3 text-center font-mono text-[0.7rem] uppercase tracking-[0.16em] last:border-r-0 sm:flex-none sm:text-left ${
                active ? "bg-ink text-paper" : "hover:text-accent"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
