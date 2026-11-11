import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PartsList, type PartRow } from "@/components/PartsList";
import { PROJECT_GROUPS, getProjects, hasWriteUp, projectGroup } from "@/lib/content";
import { profile } from "@/lib/profile";
import { drawingNumbers } from "@/lib/sheets";

const description = "Formula SAE battery work, side builds, a track-day lap app, and shop and lab projects from UCSB.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: "/projects/" },
  openGraph: {
    title: "Projects · Jason Wei",
    description,
    url: "/projects/",
    images: [{ url: profile.portrait.src, alt: profile.portrait.alt }],
  },
};

export default function ProjectsPage() {
  const projects = getProjects();
  const numbers = drawingNumbers();
  const rows: PartRow[] = projects.map((project) => ({
    slug: project.slug,
    dwg: numbers[project.slug],
    title: project.title,
    excerpt: project.excerpt,
    year: project.date ? project.date.slice(0, 4) : "Now",
    cover: project.cover,
    group: projectGroup(project),
    hasWriteUp: hasWriteUp(project),
  }));

  return (
    <>
      <PageHeader dwg="Dwg JW-002" kicker="Parts list" title="Projects" lead={description} />
      <div className="px-4 py-10 sm:px-8 sm:py-12">
        <PartsList rows={rows} groups={[...PROJECT_GROUPS]} />
      </div>
    </>
  );
}
