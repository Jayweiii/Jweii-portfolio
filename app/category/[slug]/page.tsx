import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/ProjectCard";
import { drawingNumbers } from "@/lib/sheets";
import { getCategories, projectsInCategory } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategories().find((item) => item.slug === slug);
  if (!category) return {};
  const title = category.name;
  return {
    title,
    description: `${category.name} projects by Jason Wei.`,
    alternates: { canonical: `/category/${category.slug}/` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategories().find((item) => item.slug === slug);
  if (!category) notFound();
  const projects = projectsInCategory(slug);

  const numbers = drawingNumbers();

  return (
    <>
      <PageHeader
        dwg="Dwg JW-002"
        kicker={`Category · ${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
        title={category.name}
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
