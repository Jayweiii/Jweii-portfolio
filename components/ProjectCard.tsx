import Link from "next/link";
import { projectGroup } from "@/lib/content";
import type { Project } from "@/lib/types";

/** A featured project drawn as a detail view: framed figure, detail letter, title, one line. */
export function ProjectCard({ project, detail, dwg }: { project: Project; detail: string; dwg: string }) {
  const year = project.date ? project.date.slice(0, 4) : "Now";

  return (
    <article className="h-full">
      <Link
        href={`/${project.slug}/`}
        className="card group flex h-full flex-col border border-line-strong bg-card transition-transform active:translate-y-px"
      >
        <div className="relative overflow-hidden border-b border-line-strong bg-paper-2">
          {project.cover ? (
            <img
              src={project.cover}
              alt=""
              width={1200}
              height={900}
              loading={detail === "A" || detail === "B" || detail === "C" ? "eager" : "lazy"}
              decoding="async"
              className={`card-img aspect-[4/3] w-full ${project.cover.endsWith(".svg") ? "object-contain p-6 svg-cover" : "object-cover"}`}
            />
          ) : (
            <div className="hatch grid aspect-[4/3] place-items-center">
              <span className="border-[1.5px] border-line-strong bg-card px-4 py-2 font-display text-2xl font-semibold uppercase tracking-[0.06em]">
                {project.title}
              </span>
            </div>
          )}
          <span className="absolute left-3 top-3 z-[1] grid h-9 w-9 place-items-center rounded-full border-[1.5px] border-line-strong bg-card font-mono text-sm transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
            {detail}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="label">
            Detail {detail} · {dwg}
          </p>
          <h3 className="mt-1.5 font-display text-2xl font-semibold uppercase leading-tight tracking-[0.03em] transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          {project.excerpt ? <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{project.excerpt}</p> : null}
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-dashed border-line pt-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">
            <span>{projectGroup(project)}</span>
            <span>{year}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
