import type { MetadataRoute } from "next";
import { getCategories, getProjects, getTags } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getProjects();
  const last = projects.find((project) => project.date)?.date;

  return [
    { url: "https://jweii.com/", lastModified: last, changeFrequency: "monthly", priority: 1 },
    { url: "https://jweii.com/projects/", lastModified: last, changeFrequency: "monthly", priority: 0.9 },
    { url: "https://jweii.com/about-me/", changeFrequency: "yearly", priority: 0.8 },
    ...projects.map((project) => ({
      url: `https://jweii.com/${project.slug}/`,
      lastModified: project.date || undefined,
      changeFrequency: "yearly" as const,
      priority: project.featured ? 0.8 : 0.6,
    })),
    ...getCategories().map((category) => ({
      url: `https://jweii.com/category/${category.slug}/`,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
    ...getTags().map((tag) => ({
      url: `https://jweii.com/tag/${tag.slug}/`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
