import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { adjacentProjects, formatDate, getProject, getProjects, hasWriteUp, projectGroup } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { profile } from "@/lib/profile";
import { drawingNumber } from "@/lib/sheets";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const description = project.excerpt || project.title;
  const images = project.cover && !project.cover.endsWith(".svg") ? [project.cover] : [profile.portrait.src];
  return {
    title: project.title,
    description,
    alternates: { canonical: `/${project.slug}/` },
    openGraph: {
      title: `${project.title} · Jason Wei`,
      description,
      url: `/${project.slug}/`,
      type: "article",
      images,
    },
    twitter: { card: "summary_large_image", title: project.title, description, images },
  };
}

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-r border-line px-3 py-2.5">
      <dt className="label">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const html = await renderMarkdown(project.content);
  const { previous, next } = adjacentProjects(project.slug);
  const group = projectGroup(project);
  const dwg = drawingNumber(project.slug);
  const writeUp = hasWriteUp(project);
  const coverInBody = project.cover ? project.content.includes(project.cover) : true;
  const tags = project.tags;

  return (
    <article>
      <PageHeader
        dwg={`Dwg ${dwg}`}
        kicker={group}
        title={project.title}
        lead={project.excerpt || undefined}
        crumbs={[{ href: "/projects/", label: "Projects" }]}
      >
        <dl className="mt-8 grid max-w-3xl grid-cols-2 border-l border-t border-line-strong bg-card sm:grid-cols-4">
          <Spec label="Dwg no.">{dwg}</Spec>
          <Spec label="Date">
            {project.date ? <time dateTime={project.date}>{formatDate(project.date)}</time> : "In progress"}
          </Spec>
          <Spec label="Group">{group}</Spec>
          <Spec label="Tags">
            {tags.length > 0
              ? tags.map((tag, i) => (
                  <span key={tag.slug}>
                    {i > 0 ? ", " : ""}
                    <Link href={`/tag/${tag.slug}/`} className="underline decoration-line underline-offset-4 hover:text-accent">
                      {tag.name}
                    </Link>
                  </span>
                ))
              : "—"}
          </Spec>
        </dl>
        {project.link ? (
          <p className="mt-6">
            <a href={project.link} className="btn btn-primary">
              {project.linkLabel ?? "Open site"} ↗
            </a>
          </p>
        ) : null}
      </PageHeader>

      <div className="px-4 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-3xl">
          {project.cover && !coverInBody ? (
            <div className="prose mb-10">
              <figure>
                <img
                  src={project.cover}
                  alt=""
                  className={project.cover.endsWith(".svg") ? "svg-cover !bg-white p-4" : undefined}
                />
              </figure>
            </div>
          ) : null}
          {!writeUp ? (
            <p className="mb-8 border border-dashed border-line px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-muted">
              Note: write-up not drafted yet{project.content.trim() ? " — photos only" : ""}.
            </p>
          ) : null}
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>

      <nav aria-label="More projects" className="grid border-t border-line-strong sm:grid-cols-2">
        {next ? (
          <Link
            href={`/${next.slug}/`}
            className="group border-b border-line px-4 py-5 transition-colors hover:bg-paper-2 active:bg-paper-2 sm:border-b-0 sm:border-r sm:px-8"
          >
            <span className="label">← Older project</span>
            <span className="mt-1 block font-display text-xl font-semibold uppercase tracking-[0.03em] group-hover:text-accent">
              {next.title}
            </span>
          </Link>
        ) : (
          <span className="hidden sm:block sm:border-r sm:border-line" />
        )}
        {previous ? (
          <Link
            href={`/${previous.slug}/`}
            className="group px-4 py-5 transition-colors hover:bg-paper-2 active:bg-paper-2 sm:px-8 sm:text-right"
          >
            <span className="label">Newer project →</span>
            <span className="mt-1 block font-display text-xl font-semibold uppercase tracking-[0.03em] group-hover:text-accent">
              {previous.title}
            </span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
