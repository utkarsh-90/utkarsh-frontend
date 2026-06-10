"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Post, PostCategory } from "@/lib/types";
import { formatPostDate, zeroPad } from "@/lib/utils";

const CATEGORIES = [
  "all",
  "ai",
  "geopolitics",
  "finance",
  "tech",
  "philosophy",
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: "All",
  ai: "AI",
  geopolitics: "Geopolitics",
  finance: "Finance",
  tech: "Tech",
  philosophy: "Philosophy",
};

interface PostsListProps {
  posts: Post[];
}

export default function PostsList({ posts }: PostsListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const result: Record<CategoryFilter, number> = {
      all: posts.length,
      ai: 0,
      geopolitics: 0,
      finance: 0,
      tech: 0,
      philosophy: 0,
    };
    for (const post of posts) {
      result[post.category as PostCategory]++;
    }
    return result;
  }, [posts]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory =
        filter === "all" || post.category === filter;
      const matchesSearch =
        !query || post.title.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [posts, filter, search]);

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="posts-list-wrap">
      <div className="page-header">
        <div>
          <div className="page-title">Posts</div>
          <div className="breadcrumb">
            <Link href="/admin" className="bc-link">
              Admin
            </Link>
            <span>/</span>
            <span>Posts</span>
          </div>
        </div>
        <Link href="/admin/posts/new" className="btn btn-primary">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Post
        </Link>
      </div>

      <div className="posts-list-inner">
        <div className="tbl-wrap">
          <div className="tbl-head">
            <div className="tbl-title-row">
              {CATEGORIES.map((cat, i) => (
                <span key={cat} style={{ display: "contents" }}>
                  <button
                    type="button"
                    className={`filter-tab${filter === cat ? " active" : ""}`}
                    onClick={() => setFilter(cat)}
                  >
                    {CATEGORY_LABELS[cat].toUpperCase()}
                    <span
                      style={{
                        marginLeft: 5,
                        color:
                          filter === cat ? "var(--accent)" : "var(--border-strong)",
                        fontSize: 9,
                      }}
                    >
                      {counts[cat]}
                    </span>
                  </button>
                  {i < CATEGORIES.length - 1 && <div className="filter-sep" />}
                </span>
              ))}
            </div>
            <div className="tbl-actions">
              <input
                className="search-input"
                placeholder="SEARCH POSTS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <table className="posts-table">
            <thead>
              <tr>
                <th className="td-num">#</th>
                <th style={{ minWidth: 320 }}>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Read</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post, i) => (
                <tr
                  key={post.id}
                  onClick={() => router.push(`/admin/posts/${post.id}`)}
                >
                  <td className="td-num">{zeroPad(i + 1)}</td>
                  <td>
                    <div className="td-title-main">{post.title}</div>
                  </td>
                  <td>
                    <span className="cat-badge">
                      {post.category.toUpperCase()}
                    </span>
                  </td>
                  <td className="td-mono">{formatPostDate(post.date)}</td>
                  <td className="td-mono">{post.read_time}</td>
                  <td>
                    <span className="status-cell">
                      <span
                        className={`status-dot ${
                          post.status === "published"
                            ? "status-dot--published"
                            : "status-dot--draft"
                        }`}
                      />
                      {post.status === "published" ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="posts-empty">
                    No posts match your filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="tbl-footer">
            <span>
              Showing {filtered.length} of {posts.length} posts
            </span>
            <span>
              {publishedCount} published · {draftCount} draft
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
