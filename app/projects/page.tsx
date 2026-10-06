import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { getCategories, getProjects } from "@/lib/content";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Projects",
  description: "Formula SAE battery work, a track-day lap app, shop projects, and research notes.",
  alternates: { canonical: "/projects/" },
  openGraph: {
    title: "Projects · Jason Wei",
    description: "Formula SAE battery work, a track-day lap app, shop projects, and research notes.",
    url: "/projects/",
    images: [{ url: profile.portrait.src, alt: profile.portrait.alt }],
  },
};

export default function ProjectsPage() {
  const projects = getProjects();
  const categories = getCategories().filter((category) => category.slug !== "uncategorized");

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-accent">Things I’ve made</p>
      <h1 className="mt-2 font-display text-5xl tracking-tight sm:text-6xl">Projects</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Formula SAE battery work, a track-day lap app, shop projects, and research notes. Older pages keep the original write-ups.
      </p>
      {categories.length > 0 ? (
        <nav aria-label="Project categories" className="mt-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}/`}
              className="border border-line bg-card px-3 py-2 text-sm hover:border-accent hover:text-accent"
            >
              {category.name}
              <span className="text-muted"> {category.count}</span>
            </Link>
          ))}
        </nav>
      ) : null}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
