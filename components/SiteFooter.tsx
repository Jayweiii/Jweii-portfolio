import Link from "next/link";
import { profile } from "@/lib/profile";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2">
        <div>
          <p className="font-display text-2xl">Jason Wei</p>
          <p className="mt-2 max-w-sm text-sm text-muted">{profile.tagline}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm sm:items-end">
          <a className="py-1 hover:text-accent" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a className="py-1 hover:text-accent" href={profile.links.linkedin}>
            LinkedIn
          </a>
          <a className="py-1 hover:text-accent" href={profile.links.github}>
            GitHub
          </a>
          <Link className="py-1 hover:text-accent" href="/about-me/">
            {profile.resume.label} · {profile.resume.date}
          </Link>
        </div>
      </div>
    </footer>
  );
}
