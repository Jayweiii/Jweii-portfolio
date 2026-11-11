import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/ProjectCard";
import { drawingNumbers } from "@/lib/sheets";
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

  const numbers = drawingNumbers();

  return (
    <>
      <PageHeader
        dwg="Dwg JW-002"
        kicker={`Tag · ${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
        title={tag.name}
        crumbs={[{ href: "/projects/", label: "Projects" }]}
      />
      <ul className="grid gap-6 px-4 py-10 sm:grid-cols-2 sm:px-8 sm:py-12 xl:grid-cols-3">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <ProjectCard project={project} detail={String(i + 1)} dwg={numbers[project.slug]} />
          </li>
        ))}
      </ul>
    </>
  );
}
