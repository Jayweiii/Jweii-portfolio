import type { Metadata } from "next";
import { ExperienceList } from "@/components/ExperienceList";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "About",
  description: profile.summary,
  alternates: { canonical: "/about-me/" },
  openGraph: {
    title: "About · Jason Wei",
    description: profile.summary,
    url: "/about-me/",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-accent">{profile.headline}</p>
          <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">About</h1>
          <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={profile.resume.href}
              className="inline-flex min-h-11 items-center bg-accent px-4 text-sm text-white hover:bg-[#841f12]"
            >
              {profile.resume.label} · {profile.resume.date}
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-11 items-center border border-ink px-4 text-sm hover:border-accent hover:text-accent"
            >
              {profile.email}
            </a>
          </div>
        </div>
        <img
          src="/media/portrait.webp"
          alt="Portrait of Jason Wei"
          width={652}
          height={652}
          className="aspect-square w-full max-w-xs object-cover"
        />
      </div>

      <section id="experience" className="mt-16 scroll-mt-24">
        <h2 className="font-display text-4xl">Experience</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          The current Tesla role is from LinkedIn. Earlier roles follow the November 19, 2024 résumé. Gaucho Racing
          is shown from November 2021 with no end date, because the résumé and the old site still said present.
        </p>
        <div className="mt-6">
          <ExperienceList items={profile.experience} />
        </div>
      </section>

      <section id="education" className="mt-16 scroll-mt-24">
        <h2 className="font-display text-4xl">Education</h2>
        <ol className="mt-6 divide-y divide-line border-y border-line">
          {profile.education.map((school) => (
            <li key={school.school} className="grid gap-3 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8">
              <div>
                {school.dates ? <p className="text-sm text-muted">{school.dates}</p> : null}
                {school.location ? <p className="mt-1 text-sm text-muted">{school.location}</p> : null}
              </div>
              <div>
                <h3 className="font-display text-2xl leading-tight">{school.school}</h3>
                <p className="mt-1">{school.credential}</p>
                {school.details.length > 0 ? (
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                    {school.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                ) : null}
                {school.link ? (
                  <p className="mt-3 text-sm">
                    <a className="text-accent underline underline-offset-4" href={school.link.href}>
                      {school.link.label}
                    </a>
                    {school.link.note ? <span className="text-muted"> ({school.link.note})</span> : null}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="skills" className="mt-16 scroll-mt-24">
        <h2 className="font-display text-4xl">Skills</h2>
        <p className="mt-3 text-sm text-muted">From the November 19, 2024 résumé. Add or remove lines in content/profile.json.</p>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          {profile.skills.map((group) => (
            <div key={group.group} className="border-t border-line pt-4">
              <dt className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-accent">{group.group}</dt>
              <dd className="mt-2 text-sm leading-relaxed">{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="honors" className="mt-16 scroll-mt-24">
        <h2 className="font-display text-4xl">Honors & awards</h2>
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          {profile.honors.map((group) => (
            <div key={group.group}>
              <h3 className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-accent">{group.group}</h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {group.items.map((item) => (
                  <li key={`${item.year}-${item.text}`} className="grid grid-cols-[3.5rem_1fr] gap-3 py-3 text-sm">
                    <span className="text-muted">{item.year}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mt-16 scroll-mt-24 border border-line bg-card p-6 sm:p-8">
        <h2 className="font-display text-3xl">Contact</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          {profile.role}, {profile.team} at {profile.company}. {profile.location}.
        </p>
        <ul className="mt-5 space-y-2 text-sm">
          <li>
            <a className="underline underline-offset-4 hover:text-accent" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </li>
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
            <a className="underline underline-offset-4 hover:text-accent" href={profile.resume.href}>
              {profile.resume.label} ({profile.resume.date})
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
