import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionHead } from "@/components/SectionHead";
import { dateRange, profile } from "@/lib/profile";

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

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="chevron h-4 w-4 flex-none" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHeader dwg="Dwg JW-003" kicker="About the author" title="About">
        <div className="mt-8 grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_17rem]">
          <div>
            <div className="max-w-2xl space-y-4 text-lg leading-relaxed">
              {profile.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={profile.resume.href} className="btn btn-primary">
                Download résumé ↓
              </a>
              <a href={`mailto:${profile.email}`} className="btn btn-secondary">
                Email me
              </a>
            </div>
            <p className="mt-3 font-mono text-xs text-muted">Résumé PDF dated {profile.resume.date}.</p>
          </div>

          {/* Portrait, dimensioned like a detail on the sheet */}
          <figure className="relative mx-auto w-full max-w-[17rem] pl-7 pt-7">
            <div aria-hidden="true" className="absolute left-7 right-0 top-0 flex items-center gap-2 text-muted">
              <span className="h-3 border-l border-current" />
              <span className="h-px flex-1 bg-current" />
              <span className="font-mono text-[0.6rem] tracking-[0.12em]">DETAIL A</span>
              <span className="h-px flex-1 bg-current" />
              <span className="h-3 border-r border-current" />
            </div>
            <div aria-hidden="true" className="absolute bottom-0 left-0 top-7 flex flex-col items-center gap-2 text-muted">
              <span className="w-3 border-t border-current" />
              <span className="w-px flex-1 bg-current" />
              <span className="font-mono text-[0.6rem] tracking-[0.12em] [writing-mode:vertical-rl] rotate-180">1:1</span>
              <span className="w-px flex-1 bg-current" />
              <span className="w-3 border-b border-current" />
            </div>
            <div className="ticks border border-line-strong bg-card p-2">
              <img
                src={profile.portrait.src}
                alt={profile.portrait.alt}
                width={profile.portrait.width}
                height={profile.portrait.height}
                className="aspect-square w-full object-cover grayscale-[15%]"
              />
            </div>
          </figure>
        </div>
      </PageHeader>

      {/* ---- Experience ---- */}
      <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-6 px-4 py-12 sm:px-8 sm:py-16">
        <SectionHead n="1" id="experience-heading" label="Revision history" title="Experience" />
        <ol className="mt-8 border border-line-strong bg-card">
          {profile.experience.map((item, i) => {
            const rev = String.fromCharCode(65 + profile.experience.length - 1 - i);
            const head = (
              <>
                <span className={`grid h-8 w-8 flex-none place-items-center rounded-full border-[1.5px] font-mono text-xs ${i === 0 ? "border-accent text-accent" : "border-line-strong"}`}>
                  {rev}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="row-title block font-display text-xl font-semibold uppercase leading-tight tracking-[0.03em] transition-colors sm:text-2xl">
                    {item.org}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {item.role}
                    {item.team ? ` · ${item.team}` : ""}
                  </span>
                </span>
                <span className="hidden flex-none text-right font-mono text-xs text-muted sm:block">
                  {dateRange(item.start, item.end)}
                  <br />
                  {item.location}
                </span>
              </>
            );
            return (
              <li key={`${item.org}-${item.role}-${item.start}`} className="border-b border-line last:border-b-0">
                {item.bullets.length > 0 ? (
                  <details className="disclosure" open={i < 2}>
                    <summary className="flex min-h-11 items-center gap-4 px-4 py-4 sm:px-5">
                      {head}
                      <Chevron />
                    </summary>
                    <div className="pb-5 pl-16 pr-5 sm:pl-[4.25rem]">
                      <p className="mb-3 font-mono text-xs text-muted sm:hidden">
                        {dateRange(item.start, item.end)} · {item.location}
                      </p>
                      <ul className="max-w-3xl list-[square] space-y-2 pl-4 text-[0.95rem] leading-relaxed marker:text-accent">
                        {item.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ) : (
                  <div className="flex items-center gap-4 px-4 py-4 sm:px-5">
                    {head}
                    <span className="h-4 w-4 flex-none" />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* ---- Education ---- */}
      <section id="education" aria-labelledby="education-heading" className="scroll-mt-6 border-t border-line-strong px-4 py-12 sm:px-8 sm:py-16">
        <SectionHead n="2" id="education-heading" label="Basis of design" title="Education" />
        <ol className="mt-8 grid gap-6 md:grid-cols-2">
          {profile.education.map((school) => (
            <li key={school.school} className="ticks border border-line-strong bg-card p-5">
              <p className="label">{[school.dates, school.location].filter(Boolean).join(" · ") || "High school"}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold uppercase leading-tight tracking-[0.03em]">{school.school}</h3>
              <p className="mt-1">{school.credential}</p>
              {school.details.length > 0 ? (
                <ul className="mt-3 list-[square] space-y-1.5 pl-4 text-sm leading-relaxed text-muted marker:text-accent">
                  {school.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              ) : null}
              {school.link ? (
                <p className="mt-3 text-sm">
                  <a className="inline-flex min-h-11 items-center text-accent underline underline-offset-4" href={school.link.href}>
                    {school.link.label} ↗
                  </a>
                  {school.link.note ? <span className="text-muted"> — {school.link.note}</span> : null}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      {/* ---- Skills ---- */}
      <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-6 border-t border-line-strong px-4 py-12 sm:px-8 sm:py-16">
        <SectionHead n="3" id="skills-heading" label="Material specification" title="Skills" />
        <dl className="mt-8 border border-line-strong bg-card">
          {profile.skills.map((group) => (
            <div key={group.group} className="grid border-b border-line last:border-b-0 sm:grid-cols-[16rem_minmax(0,1fr)]">
              <dt className="label border-line bg-paper-2 px-4 py-3 sm:border-r">{group.group}</dt>
              <dd className="flex flex-wrap gap-2 px-4 py-3">
                {group.items.map((skill) => (
                  <span key={skill} className="border border-line px-2 py-1 text-sm">
                    {skill}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---- Honors ---- */}
      <section id="honors" aria-labelledby="honors-heading" className="scroll-mt-6 border-t border-line-strong px-4 py-12 sm:px-8 sm:py-16">
        <SectionHead n="4" id="honors-heading" label="Approvals" title="Honors & awards" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {profile.honors.map((group) => (
            <div key={group.group} className="border border-line-strong bg-card">
              <h3 className="label border-b border-line-strong bg-paper-2 px-4 py-2.5">{group.group}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={`${item.year}-${item.text}`} className="grid grid-cols-[4rem_1fr] border-b border-line text-sm last:border-b-0">
                    <span className="border-r border-line px-4 py-3 font-mono text-xs text-muted">{item.year}</span>
                    <span className="px-4 py-3">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
