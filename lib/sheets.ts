import { getProjects } from "@/lib/content";

/**
 * Drawing numbers. Projects are numbered oldest-first so a number never
 * changes when a new project is added: JW-101, JW-102, …
 */
export function drawingNumbers(): Record<string, string> {
  const oldestFirst = [...getProjects()].reverse();
  const map: Record<string, string> = {};
  oldestFirst.forEach((project, index) => {
    map[project.slug] = `JW-${String(101 + index)}`;
  });
  return map;
}

export function drawingNumber(slug: string): string {
  return drawingNumbers()[slug] ?? "JW-100";
}

export type SheetInfo = { title: string; dwg: string };

export function sheetIndex(): Record<string, SheetInfo> {
  const numbers = drawingNumbers();
  const index: Record<string, SheetInfo> = {
    "/": { title: "General arrangement", dwg: "JW-001" },
    "/projects/": { title: "Parts list", dwg: "JW-002" },
    "/about-me/": { title: "About the author", dwg: "JW-003" },
  };
  for (const project of getProjects()) {
    index[`/${project.slug}/`] = { title: project.title, dwg: numbers[project.slug] };
  }
  return index;
}
