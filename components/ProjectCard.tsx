import Link from "next/link";
import { visibleCategories } from "@/lib/content";
import type { Project } from "@/lib/types";

export function ProjectCard({ project, index }: { project: Project; index?: number }) {
  const categories = visibleCategories(project);
  const showExcerpt = Boolean(project.excerpt);
  return (
    <article className="h-full">
      <Link
        href={`/${project.slug}/`}
        className="ticks group flex h-full flex-col border border-line bg-card p-3 transition-colors hover:border-accent/50"
      >
        {project.cover ? (
          <img
            src={project.cover}
            alt=""
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full bg-wash object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] items-end bg-wash2 p-4">
            <span className="font-display text-2xl leading-tight">{project.title}</span>
          </div>
        )}
        <div className="flex flex-1 flex-col px-1 pb-2 pt-3">
          {index ? (
            <p className="mb-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-accent">
              DWG {project.date ? `${project.date.slice(0, 4)}-` : ""}
              {String(index).padStart(2, "0")}
            </p>
          ) : null}
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-[1.35rem] leading-tight group-hover:text-accent">
              {project.title}
            </h3>
            {project.date ? (
              <time dateTime={project.date} className="shrink-0 text-xs text-muted">
                {project.date.slice(0, 4)}
              </time>
            ) : null}
          </div>
          {categories.length > 0 ? (
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">
              {categories.map((category) => category.name).join(" · ")}
            </p>
          ) : null}
          {showExcerpt ? (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{project.excerpt}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
