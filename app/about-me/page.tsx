import type { Metadata } from "next";
import { Dimension } from "@/components/Dimension";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "About",
  description: profile.summary,
  alternates: { canonical: "/about-me/" },
  openGraph: {
    title: "About · Jason Wei",
    description: profile.summary,
    url: "/about-me/",
    images: [{ url: profile.portrait.src, alt: profile.portrait.alt }],
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div>
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-accent">Note 01</p>
          <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">About</h1>
          <div className="mt-8 max-w-xl space-y-4 text-base leading-relaxed sm:text-lg">
            {profile.bio.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={profile.resume.href}
              className="inline-flex min-h-11 items-center bg-accent px-4 text-sm text-white hover:bg-accent-strong"
            >
              {profile.resume.label}
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-11 items-center border border-ink px-4 text-sm hover:border-accent hover:text-accent"
            >
              {profile.email}
            </a>
          </div>
        </div>
        <div>
          <img
            src={profile.portrait.src}
            alt={profile.portrait.alt}
            width={profile.portrait.width}
            height={profile.portrait.height}
            className="aspect-square w-full max-w-xs object-cover"
          />
          <Dimension label={profile.location} className="mt-3 max-w-xs" />
        </div>
      </div>

      <ul className="mt-12flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <li>
          <a className="underline underline-offset-4 hover:text-accent" href={profile.links.linkedin}>
            LinkedIn
          </a>
        </li>
        <li>
          <a className="underline underline-offset-4 hover:text-accent" href={profile.links.github}>
            GitHub
          </a>
        </li>
        <li>
          <a className="underline underline-offset-4 hover:text-accent" href="/#revisions">
            Work history
          </a>
        </li>
      </ul>
    </div>
  );
}
