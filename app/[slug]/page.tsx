import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  adjacentProjects,
  formatDate,
  getProject,
  getProjects,
  visibleCategories,
} from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { profile } from "@/lib/profile";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const description = project.excerpt || project.title;
  const images = project.cover ? [project.cover] : [profile.portrait.src];
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

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const html = await renderMarkdown(project.content);
  const { previous, next } = adjacentProjects(project.slug);
  const categories = visibleCategories(project);

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <p className="text-sm text-muted">
        <Link href="/projects/" className="hover:text-accent">
          Projects
        </Link>
        {categories.map((category) => (
          <span key={category.slug}>
            {" / "}
            <Link href={`/category/${category.slug}/`} className="hover:text-accent">
              {category.name}
            </Link>
          </span>
        ))}
      </p>
      <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">{project.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
        {project.date ? <time dateTime={project.date}>{formatDate(project.date)}</time> : null}
        {project.tags.map((tag) => (
          <Link key={tag.slug} href={`/tag/${tag.slug}/`} className="hover:text-accent">
            {tag.name}
          </Link>
        ))}
      </div>
      {project.link ? (
        <p className="mt-6">
          <a
            href={project.link}
            className="inline-flex min-h-11 items-center bg-accent px-4 text-sm text-white hover:bg-[#841f12]"
          >
            {project.linkLabel ?? "Open site"}
          </a>
        </p>
      ) : null}
      <div className="prose mt-10" dangerouslySetInnerHTML={{ __html: html }} />
      <nav aria-label="More projects" className="mt-14 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
        {next ? (
          <Link href={`/${next.slug}/`} className="hover:text-accent">
            <span className="block text-xs uppercase tracking-[0.14em] text-muted">Older</span>
            <span className="mt-1 block font-display text-xl">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {previous ? (
          <Link href={`/${previous.slug}/`} className="sm:text-right hover:text-accent">
            <span className="block text-xs uppercase tracking-[0.14em] text-muted">Newer</span>
            <span className="mt-1 block font-display text-xl">{previous.title}</span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
