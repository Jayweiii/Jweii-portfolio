import Link from "next/link";
import { Dimension } from "@/components/Dimension";
import { ProjectCard } from "@/components/ProjectCard";
import { View } from "@/components/View";
import { getFeaturedProjects, getProjects } from "@/lib/content";
import { dateRange, profile } from "@/lib/profile";

export default function HomePage() {
  const featured = getFeaturedProjects();
  const projects = getProjects();

  return (
    <>
      <View label="View A" className="!border-t-0">
        <div aria-hidden="true" className="grid-paper pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl items-end gap-10 px-5 py-14 md:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.75fr)] md:py-20">
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
                className="inline-flex min-h-11 items-center bg-accent px-4 text-sm text-white hover:bg-accent-strong"
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
          <div className="md:w-full md:max-w-xs md:justify-self-end">
            <img
              src={profile.portrait.src}
              alt={profile.portrait.alt}
              width={profile.portrait.width}
              height={profile.portrait.height}
              fetchPriority="high"
              className="aspect-square w-36 object-cover sm:w-52 md:w-full"
            />
            <Dimension label={profile.name} className="mt-3 w-36 sm:w-52 md:w-full" />
          </div>
        </div>
      </View>

      <Dimension label="Selected work" className="mx-5 my-2" />

      <View label="Detail B" scale="2:1" className="mx-auto max-w-6xl px-5 py-16">
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
          {featured.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i + 1} />
          ))}
        </div>
      </View>

      <Dimension label="History" className="mx-5 my-2" />

      <View id="revisions" label="Detail C" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-accent">Revisions</p>
              <h2 id="experience-heading" className="mt-2 font-display text-4xl">
                Work
              </h2>
            </div>
            <a href={profile.resume.href} className="text-sm underline decoration-line underline-offset-4 hover:text-accent">
              {profile.resume.label}
            </a>
          </div>
          <div className="overflow-x-auto border border-ink/70 bg-card">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink/70 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
                  <th className="w-14 border-r border-line p-2.5 font-normal">Rev</th>
                  <th className="w-44 border-r border-line p-2.5 font-normal">Date</th>
                  <th className="border-r border-line p-2.5 font-normal">Description</th>
                  <th className="p-2.5 font-normal">Location</th>
                </tr>
              </thead>
              <tbody>
                {profile.experience.map((item, i) => (
                  <tr key={`${item.org}-${item.role}-${item.start}`} className="border-b border-line last:border-b-0">
                    <td className="border-r border-line p-2.5 font-mono text-accent">
                      {String.fromCharCode(65 + profile.experience.length - 1 - i)}
                    </td>
                    <td className="border-r border-line p-2.5 text-muted">{dateRange(item.start, item.end)}</td>
                    <td className="border-r border-line p-2.5">
                      <span className="font-medium">{item.org}</span>
                      <span className="text-muted"> · {item.role}</span>
                      {item.team ? <span className="text-muted">, {item.team}</span> : null}
                    </td>
                    <td className="p-2.5 text-muted">{item.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </View>

      <Dimension label="Index" className="mx-5 my-2" />

      <View label="Section D" className="mx-auto max-w-6xl px-5 pb-8 pt-10">
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
      </View>
    </>
  );
}
