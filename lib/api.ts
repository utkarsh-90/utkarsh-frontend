import type {
  AboutResponse,
  Post,
  Project,
  ReadingGrouped,
  SiteConfig,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchOptions = { next: { revalidate: 60 } } as const;

const EMPTY_CONFIG: SiteConfig = {
  id: 0,
  location: "",
  reading_now: "",
  building_now: "",
  writing_now: "",
};

const EMPTY_READING: ReadingGrouped = {
  currently_reading: [],
  recent: [],
  papers: [],
  bounced: [],
};

const EMPTY_ABOUT: AboutResponse = {
  sections: [],
  contact_links: [],
};

async function apiFetch<T>(path: string, fallback: T): Promise<T> {
  if (!BASE_URL) return fallback;
  try {
    const res = await fetch(`${BASE_URL}${path}`, fetchOptions);
    if (!res.ok) return fallback;
    return res.json() as Promise<T>;
  } catch {
    return fallback;
  }
}

export function getPosts(category?: string): Promise<Post[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiFetch<Post[]>(`/api/public/posts/${query}`, []);
}

export function getPost(slug: string): Promise<Post> {
  return apiFetch<Post>(`/api/public/posts/${slug}/`, null as unknown as Post);
}

export function getProjects(): Promise<Project[]> {
  return apiFetch<Project[]>("/api/public/projects/", []);
}

export function getProject(slug: string): Promise<Project> {
  return apiFetch<Project>(`/api/public/projects/${slug}/`, null as unknown as Project);
}

export function getReading(): Promise<ReadingGrouped> {
  return apiFetch<ReadingGrouped>("/api/public/reading/", EMPTY_READING);
}

export function getConfig(): Promise<SiteConfig> {
  return apiFetch<SiteConfig>("/api/public/config/", EMPTY_CONFIG);
}

export function getAbout(): Promise<AboutResponse> {
  return apiFetch<AboutResponse>("/api/public/about/", EMPTY_ABOUT);
}
