import type {
  AboutSection,
  ContactLink,
  Post,
  Project,
  ReadingItem,
  SiteConfig,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAccessToken(): Promise<string | undefined> {
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    return cookies().get("access_token")?.value;
  }

  const res = await fetch("/api/auth/access-token", { credentials: "include" });
  if (!res.ok) return undefined;
  const data = (await res.json()) as { access: string };
  return data.access;
}

async function handleUnauthorized(): Promise<never> {
  if (typeof window !== "undefined") {
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  const { redirect } = await import("next/navigation");
  redirect("/admin/login");
  throw new Error("Unauthorized");
}

async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    await handleUnauthorized();
  }

  if (!res.ok) {
    throw new Error(`Admin API error: ${res.status} ${res.statusText}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// Posts
export function adminGetPosts(): Promise<Post[]> {
  return adminFetch<Post[]>("/api/admin/posts/");
}

export function adminGetPost(id: number): Promise<Post> {
  return adminFetch<Post>(`/api/admin/posts/${id}/`);
}

export function adminCreatePost(
  data: Omit<Post, "id" | "created_at" | "updated_at">
): Promise<Post> {
  return adminFetch<Post>("/api/admin/posts/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function adminUpdatePost(
  id: number,
  data: Partial<Omit<Post, "id" | "created_at" | "updated_at">>
): Promise<Post> {
  return adminFetch<Post>(`/api/admin/posts/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function adminDeletePost(id: number): Promise<void> {
  return adminFetch<void>(`/api/admin/posts/${id}/`, {
    method: "DELETE",
  });
}

// Projects
export function adminGetProjects(): Promise<Project[]> {
  return adminFetch<Project[]>("/api/admin/projects/");
}

export function adminGetProject(id: number): Promise<Project> {
  return adminFetch<Project>(`/api/admin/projects/${id}/`);
}

export function adminCreateProject(
  data: Omit<Project, "id">
): Promise<Project> {
  return adminFetch<Project>("/api/admin/projects/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function adminUpdateProject(
  id: number,
  data: Partial<Omit<Project, "id">>
): Promise<Project> {
  return adminFetch<Project>(`/api/admin/projects/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function adminDeleteProject(id: number): Promise<void> {
  return adminFetch<void>(`/api/admin/projects/${id}/`, {
    method: "DELETE",
  });
}

// Reading items
export function adminGetReading(): Promise<ReadingItem[]> {
  return adminFetch<ReadingItem[]>("/api/admin/reading/");
}

export function adminCreateReading(
  data: Omit<ReadingItem, "id">
): Promise<ReadingItem> {
  return adminFetch<ReadingItem>("/api/admin/reading/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function adminUpdateReading(
  id: number,
  data: Partial<Omit<ReadingItem, "id">>
): Promise<ReadingItem> {
  return adminFetch<ReadingItem>(`/api/admin/reading/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function adminDeleteReading(id: number): Promise<void> {
  return adminFetch<void>(`/api/admin/reading/${id}/`, {
    method: "DELETE",
  });
}

// About sections
export function adminGetAboutSections(): Promise<AboutSection[]> {
  return adminFetch<AboutSection[]>("/api/admin/about-sections/");
}

export function adminCreateAboutSection(
  data: Omit<AboutSection, "id">
): Promise<AboutSection> {
  return adminFetch<AboutSection>("/api/admin/about-sections/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function adminUpdateAboutSection(
  id: number,
  data: Partial<Omit<AboutSection, "id">>
): Promise<AboutSection> {
  return adminFetch<AboutSection>(`/api/admin/about-sections/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function adminDeleteAboutSection(id: number): Promise<void> {
  return adminFetch<void>(`/api/admin/about-sections/${id}/`, {
    method: "DELETE",
  });
}

// Contact links
export function adminGetContactLinks(): Promise<ContactLink[]> {
  return adminFetch<ContactLink[]>("/api/admin/contact-links/");
}

export function adminCreateContactLink(
  data: Omit<ContactLink, "id">
): Promise<ContactLink> {
  return adminFetch<ContactLink>("/api/admin/contact-links/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function adminUpdateContactLink(
  id: number,
  data: Partial<Omit<ContactLink, "id">>
): Promise<ContactLink> {
  return adminFetch<ContactLink>(`/api/admin/contact-links/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function adminPutContactLink(
  id: number,
  data: Omit<ContactLink, "id">
): Promise<ContactLink> {
  return adminFetch<ContactLink>(`/api/admin/contact-links/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function adminDeleteContactLink(id: number): Promise<void> {
  return adminFetch<void>(`/api/admin/contact-links/${id}/`, {
    method: "DELETE",
  });
}

// Site config
export function adminGetConfig(): Promise<SiteConfig> {
  return adminFetch<SiteConfig>("/api/admin/config/");
}

export function adminUpdateConfig(
  data: Partial<Omit<SiteConfig, "id">>
): Promise<SiteConfig> {
  return adminFetch<SiteConfig>("/api/admin/config/", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Reorder
export function adminReorderProjects(
  ids: number[]
): Promise<{ ids: number[] }> {
  return adminFetch<{ ids: number[] }>("/api/admin/projects/reorder/", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

export function adminReorderReading(
  ids: number[]
): Promise<{ ids: number[] }> {
  return adminFetch<{ ids: number[] }>("/api/admin/reading/reorder/", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}
