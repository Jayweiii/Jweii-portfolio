import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bom, projectRows } from "@/components/Bom";
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

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-sm text-muted">
        <Link href="/projects/" className="hover:text-accent">
          Projects
        </Link>
        {" / "}
        Category
      </p>
      <h1 className="mt-3 font-display text-5xl tracking-tight">{category.name}</h1>
      <div className="mt-10">
        <Bom rows={projectRows(projects)} caption={`${category.name} projects`} yearLabel="Year" />
      </div>
    </div>
  );
}
