import type { Metadata } from "next";
import { ZoomLink as Link } from "@/components/Zoom";
import { notFound } from "next/navigation";
import {
  adjacentProjects,
  formatDate,
  getProject,
  getProjects,
  visibleCategories,
} from "@/lib/content";
import { View } from "@/components/View";
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
    <>
    <View label="View A" className="!border-t-0">
    <article className="mx-auto max-w-5xl px-5 py-8">
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
            className="inline-flex min-h-11 items-center bg-accent px-4 text-sm text-white hover:bg-accent-strong"
          >
            {project.linkLabel ?? "Open site"}
          </a>
        </p>
      ) : null}
    </article>
    </View>

    {project.cover ? (
      <View label="Detail A" scale="2:1" className="mx-auto max-w-5xl px-5 pb-10 pt-10">
        <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
          <figure className="ticks relative border border-line bg-card p-3">
            <img src={project.cover} alt="" className="aspect-[4/3] w-full bg-wash object-cover" />
            <figcaption className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
              View A · {project.title}
            </figcaption>
          </figure>
          <figure className="mx-auto w-48 md:w-full">
            <div className="detail-circle bg-wash">
              <img src={project.cover} alt="" className="h-full w-full scale-[2] object-cover" />
            </div>
            <figcaption className="mt-2 text-center font-mono text-[0.62rem] uppercase tracking-[0.16em] text-accent">
              Detail A · 2:1
            </figcaption>
          </figure>
        </div>
      </View>
    ) : null}

    <View label="Notes" className="mx-auto max-w-5xl px-5 pb-14 pt-10">
      <div className="prose max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />
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
    </View>
    </>
  );
}
