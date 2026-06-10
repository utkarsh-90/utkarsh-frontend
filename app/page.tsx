import Link from "next/link";
import CatStrip from "@/components/CatStrip";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Newsletter from "@/components/Newsletter";
import SectionHd from "@/components/SectionHd";
import { getPosts, getProjects } from "@/lib/api";
import {
  formatPostDate,
  getDerivedCategories,
  linkStyle,
  statusClass,
  statusLabel,
  zeroPad,
} from "@/lib/utils";

export const revalidate = 60;

export default async function HomePage() {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  const recentPosts = posts.slice(0, 5);
  const activeProjects = projects.filter((p) => p.status !== "archived");
  const categories = getDerivedCategories(posts);
  const metaStatus = `INDEX · ${posts.length} ESSAYS / ${projects.length} PROJECTS`;

  return (
    <>
      <Nav page="home" metaStatus={metaStatus} />
      <div className="page-wrap">
        <div className="outer">
          <div className="home-grid">
            <div className="home-col home-col-left">
              <SectionHd label="01 / WRITING" />
              <CatStrip categories={categories} />
              {recentPosts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/writing/${post.slug}`}
                  className="home-post-row"
                  style={linkStyle}
                >
                  <span className="home-post-num">{zeroPad(i + 1)}</span>
                  <div>
                    <div className="home-post-title">{post.title}</div>
                    <div className="home-post-meta">
                      {formatPostDate(post.date)} · {post.read_time} ·{" "}
                      {post.category.toUpperCase()}
                    </div>
                  </div>
                </Link>
              ))}
              <Link href="/writing" className="all-link">
                → ALL WRITING{" "}
                <span className="all-link-count">({posts.length})</span>
              </Link>
            </div>

            <div className="home-col-rule"></div>

            <div className="home-col home-col-right">
              <SectionHd label="02 / PROJECTS" />
              {activeProjects.map((p, i) => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="home-proj-row"
                  style={linkStyle}
                >
                  <span className="home-proj-num">{zeroPad(i + 1)}</span>
                  <div>
                    <div className="home-proj-name">{p.name}</div>
                    <div className="home-proj-desc">{p.description}</div>
                    <div className="home-proj-meta">
                      <span className={statusClass(p.status)}>
                        {statusLabel(p.status)}
                      </span>
                      <span style={{ color: "var(--border)", margin: "0 6px" }}>
                        ·
                      </span>
                      {p.stack.slice(0, 3).join(" / ")}
                    </div>
                  </div>
                </Link>
              ))}
              <Link href="/projects" className="all-link">
                → ALL PROJECTS{" "}
                <span className="all-link-count">({projects.length})</span>
              </Link>
            </div>
          </div>

          <div className="mt-16 mb-16">
            <Newsletter />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
