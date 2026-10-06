import profileJson from "@/content/profile.json";
import type { Profile } from "@/lib/types";

export const profile = profileJson as Profile;

export function dateRange(start: string, end: string): string {
  if (start && end) return `${start} – ${end}`;
  if (start) return `${start} –`;
  return end;
}
