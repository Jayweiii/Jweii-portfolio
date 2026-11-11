"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { href: "/projects/", label: "Projects" },
  { href: "/about-me/", label: "About" },
];

export function SiteHeader({ name, resume }: { name: string; resume: string }) {
  const pathname = usePathname() || "/";

  return (
    <header className="border-b-2 border-line-strong">
      <div className="flex flex-wrap items-stretch justify-between">
        <Link href="/" className="group flex min-h-14 items-center gap-3 px-4 sm:px-5" aria-label={`${name}, home`}>
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center border-[1.5px] border-line-strong font-display text-lg font-semibold leading-none transition-colors group-hover:border-accent group-hover:text-accent"
          >
            JW
          </span>
          <span className="font-display text-xl font-semibold uppercase tracking-[0.08em]">{name}</span>
        </Link>

        <div className="flex items-center px-4 sm:order-last sm:px-5">
          <ThemeToggle />
        </div>

        <nav aria-label="Primary" className="flex w-full border-t border-line sm:ml-auto sm:w-auto sm:border-t-0">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 flex-1 items-center justify-center border-r border-line px-5 font-mono text-xs uppercase tracking-[0.16em] transition-colors sm:flex-none sm:border-l sm:border-r-0 active:bg-paper-2 ${
                  active ? "text-accent" : "hover:text-accent"
                }`}
              >
                {active ? <span aria-hidden="true" className="mr-2 h-1.5 w-1.5 rounded-full bg-accent" /> : null}
                {item.label}
              </Link>
            );
          })}
          <a
            href={resume}
            className="flex min-h-12 flex-1 items-center justify-center px-5 font-mono text-xs uppercase tracking-[0.16em] transition-colors hover:text-accent active:bg-paper-2 sm:flex-none sm:border-l sm:border-line"
          >
            Résumé
            <span aria-hidden="true" className="ml-1.5">
              ↗
            </span>
          </a>
        </nav>
      </div>
    </header>
  );
}
