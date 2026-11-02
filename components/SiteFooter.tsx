import { profile } from "@/lib/profile";

/** Slim contact strip along the bottom edge of the sheet (the title block lives in the header). */
export function SiteFooter() {
  const link = "inline-flex min-h-8 items-center hover:text-accent";
  return (
    <footer className="flex shrink-0 flex-wrap items-center justify-between gap-x-5 border-t border-ink/70 bg-card px-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
      <a className={link} href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <span className="flex gap-5">
        <a className={link} href={profile.links.linkedin}>
          LinkedIn
        </a>
        <a className={link} href={profile.links.github}>
          GitHub
        </a>
      </span>
    </footer>
  );
}
