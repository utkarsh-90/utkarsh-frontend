"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  adminCreatePost,
  adminDeletePost,
  adminUpdatePost,
} from "@/lib/adminApi";
import type { Post, PostCategory, PostStatus } from "@/lib/types";
import { slugify } from "@/lib/utils";

const CATEGORIES: PostCategory[] = [
  "ai",
  "geopolitics",
  "finance",
  "tech",
  "philosophy",
];

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

interface PostEditorProps {
  post?: Post;
}

export default function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const isNew = !post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!post);
  const [category, setCategory] = useState<PostCategory>(
    post?.category ?? "ai"
  );
  const [readTime, setReadTime] = useState(post?.read_time ?? "");
  const [date, setDate] = useState(post?.date ?? todayISO());
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slugEdited && title) {
      setSlug(slugify(title));
    }
  }, [title, slugEdited]);

  async function save(status: PostStatus) {
    setSaving(true);
    try {
      const payload = {
        title,
        slug,
        date,
        read_time: readTime,
        category,
        excerpt,
        body,
        status,
      };

      if (isNew) {
        await adminCreatePost(payload);
      } else {
        await adminUpdatePost(post.id, payload);
      }

      router.push("/admin/posts");
    } catch {
      alert("Failed to save post. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!post) return;
    if (!window.confirm("Delete this post? This cannot be undone.")) return;

    setSaving(true);
    try {
      await adminDeletePost(post.id);
      router.push("/admin/posts");
    } catch {
      alert("Failed to delete post. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="post-editor-shell">
      <div className="post-editor-scroll">
        <div style={{ marginBottom: 24 }}>
          <Link
            href="/admin/posts"
            className="btn btn-ghost"
            style={{ fontSize: 9, padding: "4px 10px" }}
          >
            ← Posts
          </Link>
        </div>

        <input
          className="editor-title-input"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="editor-slug-row">
          <label className="editor-field-label" htmlFor="post-slug">
            Slug
          </label>
          <input
            id="post-slug"
            className="editor-slug-input"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            placeholder="post-slug-here"
          />
          <div className="editor-slug-preview">/{slug || "—"}</div>
        </div>

        <div className="editor-fields-row">
          <div>
            <label className="editor-field-label" htmlFor="post-category">
              Category
            </label>
            <select
              id="post-category"
              className="editor-field-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="editor-field-label" htmlFor="post-read-time">
              Read Time
            </label>
            <input
              id="post-read-time"
              className="editor-field-input"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="8 min"
            />
          </div>
          <div>
            <label className="editor-field-label" htmlFor="post-date">
              Date
            </label>
            <input
              id="post-date"
              type="date"
              className="editor-field-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label className="editor-field-label" htmlFor="post-excerpt">
            Excerpt
          </label>
          <textarea
            id="post-excerpt"
            className="editor-textarea editor-excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description for listing pages and SEO..."
            rows={4}
          />
        </div>

        <div>
          <div className="editor-body-header">
            <label className="editor-field-label" htmlFor="post-body">
              Body
            </label>
            <button
              type="button"
              className={`preview-btn${preview ? " active" : ""}`}
              onClick={() => setPreview((p) => !p)}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {preview ? "Edit" : "Preview"}
            </button>
          </div>

          {preview ? (
            <div className="editor-preview-pane">
              {body.trim() ? (
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              ) : (
                <div className="editor-preview-placeholder">
                  Nothing to preview yet
                </div>
              )}
            </div>
          ) : (
            <textarea
              id="post-body"
              className="editor-textarea editor-body-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="<p>Start writing HTML...</p>"
              rows={16}
            />
          )}
        </div>
      </div>

      <div className="post-editor-bottom-bar">
        {!isNew ? (
          <button
            type="button"
            className="btn-danger-text"
            onClick={handleDelete}
            disabled={saving}
          >
            Delete
          </button>
        ) : (
          <span />
        )}
        <div className="post-editor-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => save("draft")}
            disabled={saving}
          >
            Save Draft
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => save("published")}
            disabled={saving}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
