import Link from "next/link";
import { CellDrawing } from "@/components/CellDrawing";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHead } from "@/components/SectionHead";
import { getFeaturedProjects, getProjects } from "@/lib/content";
import { profile } from "@/lib/profile";
import { drawingNumbers } from "@/lib/sheets";

const DETAILS = "ABCDEF";

export default function HomePage() {
  const featured = getFeaturedProjects().slice(0, DETAILS.length);
  const total = getProjects().length;
  const numbers = drawingNumbers();
  const current = profile.experience[0];
  const school = profile.education[0];

  const specs = [
    { label: "Role", value: `${profile.role}` },
    { label: "Team", value: `${profile.team}, ${profile.company}` },
    { label: "Based", value: profile.location },
    { label: "Education", value: `${school.credential}, UCSB` },
  ];

  return (
    <>
      {/* ---- Hero ---- */}
      <section aria-labelledby="hero-heading" className="border-b border-line-strong">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="px-4 py-10 sm:px-8 sm:py-14 lg:border-r lg:border-line lg:py-16">
            <p className="label">
              <span className="text-accent">Dwg JW-001</span> · General arrangement
            </p>
            <h1
              id="hero-heading"
              className="mt-4 font-display text-[clamp(3.6rem,11vw,7.5rem)] font-bold uppercase leading-[0.86] tracking-[0.01em]"
            >
              Jason
              <br />
              Wei
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed">
              I design battery hardware at {profile.company}. Before that I built electric race car packs with Gaucho
              Racing at UCSB.
            </p>

            <dl className="mt-8 max-w-lg border border-line-strong bg-card text-sm">
              {specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] border-b border-line last:border-b-0">
                  <dt className="label flex items-center border-r border-line bg-paper-2 px-3 py-2.5">{spec.label}</dt>
                  <dd className="px-3 py-2.5">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects/" className="btn btn-primary">
                See all {total} projects
              </Link>
              <Link href="/about-me/" className="btn btn-secondary">
                About &amp; résumé
              </Link>
            </div>
          </div>

          <div className="relative flex items-center border-t border-line px-3 pb-6 pt-10 sm:px-6 lg:border-t-0 lg:py-14">
            <p className="label absolute left-4 top-3 sm:left-6">Detail — the 2170 cell, scale NTS</p>
            <CellDrawing compact className="mx-auto w-full sm:hidden" />
            <CellDrawing className="mx-auto hidden w-full max-w-[44rem] sm:block" />
          </div>
        </div>
      </section>

      {/* ---- Featured work ---- */}
      <section aria-labelledby="work-heading" className="px-4 py-12 sm:px-8 sm:py-16">
        <SectionHead
          n="1"
          id="work-heading"
          label="Detail views"
          title="Selected work"
          action={{ href: "/projects/", label: "Parts list" }}
        />
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((project, i) => (
            <li key={project.slug}>
              <ProjectCard project={project} detail={DETAILS[i]} dwg={numbers[project.slug]} />
            </li>
          ))}
        </ul>
      </section>

      {/* ---- Experience ---- */}
      <section aria-labelledby="history-heading" className="border-t border-line-strong px-4 py-12 sm:px-8 sm:py-16">
        <SectionHead
          n="2"
          id="history-heading"
          label="Revision history"
          title="Experience"
          action={{ href: "/about-me/#experience", label: "Full details" }}
        />
        <div className="mt-8 overflow-hidden border border-line-strong bg-card">
          <div className="hidden grid-cols-[4rem_11rem_minmax(0,1fr)_minmax(0,1fr)] border-b border-line-strong bg-paper-2 md:grid">
            {["Rev", "Date", "Organisation", "Role"].map((h) => (
              <p key={h} className="label border-r border-line px-3 py-2 last:border-r-0">
                {h}
              </p>
            ))}
          </div>
          <ol>
            {profile.experience.map((item, i) => {
              const rev = String.fromCharCode(65 + profile.experience.length - 1 - i);
              const isCurrent = item === current;
              return (
                <li
                  key={`${item.org}-${item.role}-${item.start}`}
                  className="grid grid-cols-[3rem_minmax(0,1fr)] border-b border-line last:border-b-0 md:grid-cols-[4rem_11rem_minmax(0,1fr)_minmax(0,1fr)]"
                >
                  <span className="row-span-3 grid place-items-start border-r border-line px-3 py-3 font-mono text-sm md:row-span-1">
                    <span className={isCurrent ? "balloon h-7 w-7 text-accent" : ""}>{rev}</span>
                  </span>
                  <span className="px-3 pt-3 font-mono text-xs text-muted md:border-r md:border-line md:py-3.5">
                    {item.start}
                    {item.end ? ` – ${item.end}` : " –"}
                  </span>
                  <span className="px-3 pt-0.5 font-medium md:border-r md:border-line md:py-3">{item.org}</span>
                  <span className="px-3 pb-3 text-sm text-muted md:py-3 md:text-base">
                    {item.role}
                    {item.team ? `, ${item.team}` : ""}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ---- Notes ---- */}
      <section aria-labelledby="notes-heading" className="border-t border-line-strong px-4 py-12 sm:px-8 sm:py-16">
        <SectionHead n="3" id="notes-heading" label="Unless otherwise specified" title="General notes" />
        <ol className="mt-8 grid max-w-3xl gap-4 font-mono text-sm leading-relaxed">
          {[...profile.bio, "For anything else, see the title block below."].map((note, i) => (
            <li key={note} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2">
              <span className="text-accent">{i + 1}.</span>
              <span className="uppercase tracking-[0.04em]">{note}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
