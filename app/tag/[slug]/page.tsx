import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/ProjectCard";
import { getTags, projectsWithTag } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getTags().map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTags().find((item) => item.slug === slug);
  if (!tag) return {};
  return {
    title: tag.name,
    description: `Projects tagged ${tag.name}.`,
    alternates: { canonical: `/tag/${tag.slug}/` },
  };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = getTags().find((item) => item.slug === slug);
  if (!tag) notFound();
  const projects = projectsWithTag(slug);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-sm text-muted">
        <Link href="/projects/" className="hover:text-accent">
          Projects
        </Link>
        {" / "}
        Tag
      </p>
      <h1 className="mt-3 font-display text-5xl tracking-tight">{tag.name}</h1>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
