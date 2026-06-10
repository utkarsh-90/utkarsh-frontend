export type PostCategory =
  | "ai"
  | "geopolitics"
  | "finance"
  | "tech"
  | "philosophy";

export type PostStatus = "draft" | "published";

export type ProjectStatus = "shipped" | "wip" | "archived";

export type ReadingFormat = "book" | "paper" | "essay";

export type ReadingSection =
  | "currently_reading"
  | "recent"
  | "papers"
  | "bounced";

export type AboutSectionKey = "who" | "what" | "why";

export interface SiteConfig {
  id: number;
  location: string;
  reading_now: string;
  building_now: string;
  writing_now: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  date: string;
  read_time: string;
  category: PostCategory;
  excerpt: string;
  body: string;
  status: PostStatus;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  slug: string;
  status: ProjectStatus;
  description: string;
  stack: string[];
  problem: string;
  approach: string;
  learned: string;
  github_url: string;
  live_url: string;
  sort_order: number;
}

export interface ReadingItem {
  id: number;
  title: string;
  author: string;
  year: number | null;
  format: ReadingFormat;
  note: string;
  reason: string;
  section: ReadingSection;
  sort_order: number;
}

export interface AboutSection {
  id: number;
  section_key: AboutSectionKey;
  body: string;
}

export interface ContactLink {
  id: number;
  label: string;
  url: string;
  sort_order: number;
}

export interface ReadingGrouped {
  currently_reading: ReadingItem[];
  recent: ReadingItem[];
  papers: ReadingItem[];
  bounced: ReadingItem[];
}

export interface AboutResponse {
  sections: AboutSection[];
  contact_links: ContactLink[];
}
