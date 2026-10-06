import Link from "next/link";
import { visibleCategories } from "@/lib/content";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const categories = visibleCategories(project);
  const showExcerpt = project.excerpt && !/^to be updated\.?$/i.test(project.excerpt);
  return (
    <article className="h-full">
      <Link
        href={`/${project.slug}/`}
        className="group flex h-full flex-col border border-line bg-card p-3 transition-colors hover:border-accent/50"
      >
        {project.cover ? (
          <img
            src={project.cover}
            alt=""
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full bg-[#ebe6de] object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] items-end bg-[#e7e1d8] p-4">
            <span className="font-display text-2xl leading-tight">{project.title}</span>
          </div>
        )}
        <div className="flex flex-1 flex-col px-1 pb-2 pt-3">
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
