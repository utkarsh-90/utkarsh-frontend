import Link from "next/link";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { getConfig, getPosts } from "@/lib/api";
import type { PostCategory } from "@/lib/types";
import {
  formatPostDate,
  getDerivedCategories,
  linkStyle,
  zeroPad,
} from "@/lib/utils";

export const revalidate = 60;

interface WritingPageProps {
  searchParams: { category?: string; q?: string };
}

function buildWritingHref(category: string, q?: string): string {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `/writing?${query}` : "/writing";
}

export default async function WritingPage({ searchParams }: WritingPageProps) {
  const [posts, config] = await Promise.all([getPosts(), getConfig()]);
  const categories = ["all", ...getDerivedCategories(posts)] as const;
  const activeCategory = (searchParams.category || "all") as
    | "all"
    | PostCategory;
  const query = searchParams.q?.trim().toLowerCase() || "";

  let filtered =
    activeCategory === "all"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  if (query) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query)
    );
  }

  const metaStatus = config.writing_now
    ? `DRAFTING · ${config.writing_now.toUpperCase()}`
    : "";

  return (
    <>
      <Nav page="writing" metaStatus={metaStatus} />
      <div className="page-wrap">
        <div className="outer">
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 32,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div>
              <h1 className="h1 mb-8">WRITING</h1>
              <span className="mono-sm text-muted">
                01 / ESSAYS, NOTES, AND ARGUMENTS
              </span>
            </div>
            <form action="/writing" method="get">
              {activeCategory !== "all" && (
                <input type="hidden" name="category" value={activeCategory} />
              )}
              <input
                type="search"
                name="q"
                defaultValue={searchParams.q || ""}
                className="nl-input"
                placeholder="Search posts…"
                style={{ minWidth: 200, fontSize: 14 }}
              />
            </form>
          </div>

          <div className="filter-row">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={buildWritingHref(cat, searchParams.q)}
                className={`filter-tab${activeCategory === cat ? " active" : ""}`}
              >
                {cat.toUpperCase()}
              </Link>
            ))}
            <span className="filter-count">
              {posts.length} POSTS
              {activeCategory !== "all" || query
                ? ` / FILTERED: ${filtered.length}`
                : ""}
            </span>
          </div>

          <div>
            {filtered.map((post, i) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="writing-post-row"
                style={linkStyle}
              >
                <span className="writing-post-num">{zeroPad(i + 1)}</span>
                <div>
                  <div className="writing-post-title">{post.title}</div>
                  <div className="writing-post-meta">
                    {formatPostDate(post.date)} · {post.read_time} ·{" "}
                    {post.category.toUpperCase()}
                  </div>
                  <div className="writing-post-excerpt">{post.excerpt}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
