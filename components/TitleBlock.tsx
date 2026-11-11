"use client";

import { usePathname } from "next/navigation";
import type { SheetInfo } from "@/lib/sheets";

type Props = {
  name: string;
  email: string;
  linkedin: string;
  github: string;
  location: string;
  sheets: Record<string, SheetInfo>;
  revision: string;
};

function Cell({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-line px-4 py-3 ${className}`}>
      <p className="label">{label}</p>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}

const linkClass =
  "inline-flex min-h-11 items-center underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent";

/** The site footer, drawn as the title block in the corner of every sheet. */
export function TitleBlock({ name, email, linkedin, github, location, sheets, revision }: Props) {
  const pathname = usePathname() || "/";
  const archive = pathname.startsWith("/category/") || pathname.startsWith("/tag/");
  const sheet = sheets[pathname] ?? (archive ? { title: "Project archive", dwg: "JW-002" } : { title: "Not found", dwg: "JW-404" });
  const total = Object.keys(sheets).length;
  const number = Object.keys(sheets).indexOf(pathname) + 1;

  return (
    <footer className="border-t-2 border-line-strong">
      <div className="grid grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]">
        <div className="col-span-2 border-b border-line px-4 py-4 sm:px-5 lg:col-span-1 lg:row-span-2 lg:border-b-0 lg:border-r">
          <p className="label">Contact</p>
          <p className="mt-1 font-display text-2xl font-semibold uppercase tracking-[0.06em]">{name}</p>
          <ul className="mt-1 flex flex-wrap gap-x-5 text-sm">
            <li>
              <a className={linkClass} href={`mailto:${email}`}>
                {email}
              </a>
            </li>
            <li>
              <a className={linkClass} href={linkedin}>
                LinkedIn
              </a>
            </li>
            <li>
              <a className={linkClass} href={github}>
                GitHub
              </a>
            </li>
          </ul>
        </div>
        <Cell label="Title" className="col-span-2 border-b lg:col-span-2 lg:border-r">
          <span className="font-medium">{sheet.title}</span>
        </Cell>
        <Cell label="Dwg no." className="border-b border-r lg:col-span-1">
          {sheet.dwg}
        </Cell>
        <Cell label="Rev" className="border-b lg:col-span-1">
          {revision}
        </Cell>
        <Cell label="Drawn by" className="border-r">
          J. Wei
        </Cell>
        <Cell label="Location" className="lg:border-r">
          {location}
        </Cell>
        <Cell label="Units" className="hidden border-r lg:block">
          mm
        </Cell>
        <Cell label="Sheet" className="hidden lg:block">
          {number > 0 ? `${number} of ${total}` : "—"}
        </Cell>
      </div>
    </footer>
  );
}
