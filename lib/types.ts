export type Term = {
  name: string;
  slug: string;
};

export type Project = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  source?: string;
  featured: boolean;
  featureRank: number;
  cover?: string;
  categories: Term[];
  tags: Term[];
  aliases: string[];
  content: string;
};

export type Experience = {
  org: string;
  role: string;
  team?: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};

export type Education = {
  school: string;
  credential: string;
  location: string;
  dates: string;
  details: string[];
  link?: {
    href: string;
    label: string;
    note?: string;
  };
};

export type SkillGroup = {
  group: string;
  items: string[];
};

export type Honor = {
  year: string;
  text: string;
};

export type Profile = {
  name: string;
  headline: string;
  role: string;
  team: string;
  company: string;
  location: string;
  summary: string;
  bio: string[];
  tagline: string;
  email: string;
  links: {
    linkedin: string;
    github: string;
  };
  resume: {
    href: string;
    label: string;
    date: string;
  };
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
  honors: { group: string; items: Honor[] }[];
};
