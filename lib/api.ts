import type {
  AboutResponse,
  Post,
  Project,
  ReadingGrouped,
  SiteConfig,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchOptions = { next: { revalidate: 60 } } as const;

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, fetchOptions);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function getPosts(category?: string): Promise<Post[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiFetch<Post[]>(`/api/public/posts/${query}`);
}

export function getPost(slug: string): Promise<Post> {
  return apiFetch<Post>(`/api/public/posts/${slug}/`);
}

export function getProjects(): Promise<Project[]> {
  return apiFetch<Project[]>("/api/public/projects/");
}

export function getProject(slug: string): Promise<Project> {
  return apiFetch<Project>(`/api/public/projects/${slug}/`);
}

export function getReading(): Promise<ReadingGrouped> {
  return apiFetch<ReadingGrouped>("/api/public/reading/");
}

export function getConfig(): Promise<SiteConfig> {
  return apiFetch<SiteConfig>("/api/public/config/");
}

export function getAbout(): Promise<AboutResponse> {
  return apiFetch<AboutResponse>("/api/public/about/");
}
