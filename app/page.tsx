import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { getFeaturedProjects, getProjects } from "@/lib/content";
import { dateRange, profile } from "@/lib/profile";

export default function HomePage() {
  const featured = getFeaturedProjects();
  const projects = getProjects();

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl items-end gap-10 px-5 py-14 md:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.75fr)] md:py-20">
          <div>
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-accent">
              {profile.team} · {profile.company}
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">Jason Wei</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed">{profile.summary}</p>
            <p className="mt-4 text-sm text-muted">
              {profile.role}, {profile.team} · {profile.location}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projects/"
                className="inline-flex min-h-11 items-center bg-accent px-4 text-sm text-white hover:bg-[#841f12]"
              >
                View projects
              </Link>
              <Link
                href="/about-me/"
                className="inline-flex min-h-11 items-center border border-ink px-4 text-sm hover:border-accent hover:text-accent"
              >
                About & résumé
              </Link>
            </div>
          </div>
          <img
            src={profile.portrait.src}
            alt={profile.portrait.alt}
            width={profile.portrait.width}
            height={profile.portrait.height}
            fetchPriority="high"
            className="aspect-square w-36 object-cover sm:w-52 md:w-full md:max-w-xs md:justify-self-end"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16" aria-labelledby="featured-heading">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-accent">Selected</p>
            <h2 id="featured-heading" className="mt-2 font-display text-4xl">
              Projects
            </h2>
          </div>
          <Link href="/projects/" className="text-sm underline decoration-line underline-offset-4 hover:text-accent">
            All projects
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="experience-heading">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-accent">History of</p>
              <h2 id="experience-heading" className="mt-2 font-display text-4xl">
                Work
              </h2>
            </div>
            <Link href="/about-me/#experience" className="text-sm underline decoration-line underline-offset-4 hover:text-accent">
              Full résumé
            </Link>
          </div>
          <ol className="divide-y divide-line border-y border-line">
            {profile.experience.map((item) => (
              <li key={`${item.org}-${item.role}-${item.start}`} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr_auto] sm:items-baseline sm:gap-6">
                <p className="text-sm text-muted">{dateRange(item.start, item.end)}</p>
                <p>
                  <span className="font-medium">{item.org}</span>
                  <span className="text-muted"> · {item.role}</span>
                  {item.team ? <span className="text-muted">, {item.team}</span> : null}
                </p>
                <p className="text-sm text-muted">{item.location}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8" aria-labelledby="index-heading">
        <h2 id="index-heading" className="font-display text-3xl">
          Every project
        </h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link href={`/${project.slug}/`} className="flex items-baseline justify-between gap-4 py-3 hover:text-accent">
                <span>{project.title}</span>
                {project.date ? (
                  <time dateTime={project.date} className="shrink-0 text-sm text-muted">
                    {project.date.slice(0, 4)}
                  </time>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
