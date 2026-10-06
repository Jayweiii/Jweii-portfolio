import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Project, Term } from "@/lib/types";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

function asTerms(value: unknown): Term[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as { name?: unknown; slug?: unknown };
      if (typeof record.name !== "string" || typeof record.slug !== "string") return null;
      return { name: record.name, slug: record.slug };
    })
    .filter((item): item is Term => item !== null);
}

function asStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function readProject(filePath: string): Project {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const slug = path.basename(filePath).replace(/\.mdx?$/, "");
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    excerpt: String(data.excerpt ?? ""),
    source: typeof data.source === "string" ? data.source : undefined,
    featured: Boolean(data.featured),
    featureRank: typeof data.featureRank === "number" ? data.featureRank : 0,
    pinned: Boolean(data.pinned),
    cover: typeof data.cover === "string" ? data.cover : undefined,
    link: typeof data.link === "string" ? data.link : undefined,
    linkLabel: typeof data.linkLabel === "string" ? data.linkLabel : undefined,
    categories: asTerms(data.categories),
    tags: asTerms(data.tags),
    aliases: asStrings(data.aliases),
    content,
  };
}

export function getProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => readProject(path.join(PROJECTS_DIR, file)))
    .sort(compareProjects);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return getProjects()
    .filter((project) => project.featured)
    .sort((a, b) => a.featureRank - b.featureRank || compareProjects(a, b));
}

export function compareProjects(a: Project, b: Project): number {
  if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
  const date = sortKey(b.date).localeCompare(sortKey(a.date));
  if (date !== 0) return date;
  return a.title.localeCompare(b.title);
}

function sortKey(date: string): string {
  if (!date) return "0000-00-00";
  if (/^\d{4}-\d{2}$/.test(date)) return `${date}-01`;
  return date;
}

export function formatDate(date: string): string {
  if (!date) return "";
  if (/^\d{4}-\d{2}$/.test(date)) {
    const [year, month] = date.split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, 1)));
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return date;
  const [, year, month, day] = match;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))));
}

export function visibleCategories(project: Project): Term[] {
  return project.categories.filter((category) => category.slug !== "uncategorized");
}

export type TermCount = Term & { count: number };

export function getCategories(): TermCount[] {
  const map = new Map<string, TermCount>();
  for (const project of getProjects()) {
    for (const category of project.categories) {
      const existing = map.get(category.slug);
      if (existing) existing.count += 1;
      else map.set(category.slug, { ...category, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getTags(): TermCount[] {
  const map = new Map<string, TermCount>();
  for (const project of getProjects()) {
    for (const tag of project.tags) {
      const existing = map.get(tag.slug);
      if (existing) existing.count += 1;
      else map.set(tag.slug, { ...tag, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function projectsInCategory(slug: string): Project[] {
  return getProjects().filter((project) => project.categories.some((category) => category.slug === slug));
}

export function projectsWithTag(slug: string): Project[] {
  return getProjects().filter((project) => project.tags.some((tag) => tag.slug === slug));
}

export function adjacentProjects(slug: string): { previous?: Project; next?: Project } {
  const projects = getProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return {};
  return {
    previous: projects[index - 1],
    next: projects[index + 1],
  };
}
