import type { Post, PostCategory, ProjectStatus } from "./types";

export function zeroPad(n: number, len = 3): string {
  return String(n).padStart(len, "0");
}

export function statusClass(status: ProjectStatus): string {
  if (status === "shipped") return "proj-status-shipped";
  if (status === "wip") return "proj-status-wip";
  return "proj-status-archived";
}

export function statusLabel(status: ProjectStatus): string {
  if (status === "shipped") return "SHIPPED";
  if (status === "wip") return "IN PROGRESS";
  return "ARCHIVED";
}

export function formatPostDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getDerivedCategories(posts: Post[]): PostCategory[] {
  const categories = Array.from(
    new Set(posts.map((p) => p.category))
  ).sort();
  return categories;
}

export function readingMetaParts(item: {
  author: string;
  year: number | null;
  format: string;
}): string {
  const parts = [item.author];
  if (item.year) parts.push(String(item.year));
  if (item.format) parts.push(item.format.toUpperCase());
  return parts.join(" · ");
}

export const linkStyle = {
  textDecoration: "none",
  color: "inherit",
} as const;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[''"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
